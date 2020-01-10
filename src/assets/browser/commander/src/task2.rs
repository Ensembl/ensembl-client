use crate::control::TaskControl;
use crate::step::{ RunConfig, Step2, StepState2 };

pub(crate) struct Task2Impl<X> {
    step: Box<dyn Step2<X,(),()>>,
    input: X,
    run_config: RunConfig,
    name: String,
    control: TaskControl
}

pub(crate) trait Task2 {
    fn run(&mut self, now: f64);
    fn get_priority(&self) -> i8;
    fn get_name(&self) -> String;
}

impl<X> Task2Impl<X> {
    pub(crate) fn new<S>(step: S, input: X, run_config: &RunConfig, control: TaskControl, name: &str) -> Task2Impl<X> where S: Step2<X,(),()> + 'static + Send, X: Send {
        Task2Impl {
            step: Box::new(step),
            input, control,
            run_config: run_config.clone(),
            name: name.to_string()
        }
    }
}

impl<X> Task2 for Task2Impl<X> where X: Send {
    fn get_priority(&self) -> i8 { self.run_config.get_priority() }
    fn get_name(&self) -> String { self.name.clone() }

    fn run(&mut self, now: f64) {
        self.control.check_timers(now);
        /* We use this racey method because we only really care about the single-threaded
         * case (this method is non-rentrant). If a task completes with Done in a previous
         * call (and this is the only call which handles this case), don't call execute
         * again. Other terminations (via kill) are never guaranteed synchronous and so one
         * more call of the step may occur if the signal is delivered between is_finished
         * and the call to execute. But this is just an extension of the inevitable
         * asynchrony of a signal being delivered at the start of an execute call as we are
         * non pre-emptive.
         */
        if self.control.is_finished() { 
            return;
        }
        self.control.about_to_run();
        match self.step.execute(&self.input,&mut self.control) {
            StepState2::Done(_) => {
                self.control.finish(None);
            },
            StepState2::Block => {
                self.control.not_runnable();
            },
            StepState2::Tick => {
                self.control.wait_for_next_tick();
            },
            StepState2::Again => {}
        }
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
    use crate::integration::{ SleepQuantity, CommanderIntegration2, ReenteringIntegration };
    use crate::taskcontainer::TaskContainer;
    use crate::timer::TimerSet;

    pub struct FakeIntegration();
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { 0. }
        fn sleep(&mut self, amount: SleepQuantity) {}
    }

    struct FakeStep(i32);
    impl Step2<(),()> for FakeStep {
        fn execute(&mut self, input: &(), control: &mut TaskControl) -> StepState2<(),()> {
            if self.0 < 0 {
                self.0 += 1;
                control.unblock();
                return StepState2::Block;
            }
            self.0 += 1;
            match self.0 {
                1 => StepState2::Tick,
                2 => StepState2::Again,
                _ => StepState2::Done(Ok(()))
            }
        }
    }

    #[test]
    pub fn test_task_smoke() {
        /* setup */
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&ReenteringIntegration::new(FakeIntegration()));
        let s1 = FakeStep(0);
        let tc2 = tc.clone();
        let mut t = Task2Impl::new(s1,(),&cfg,tc2,"test");
        /* simple accessors */
        assert_eq!("test",t.get_name());
        assert_eq!(3,t.get_priority());
        /* simple running to completion */
        assert!(!tc.is_finished());
        t.run(0.);
        assert!(!tc.is_finished());
        t.run(0.);
        assert!(!tc.is_finished());
        /* check for tick action in one of those two runs */
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Tick(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* finish */
        t.run(0.);
        assert!(tc.is_finished());
    }

    #[test]
    pub fn test_task_block() {
        /* setup */
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&ReenteringIntegration::new(FakeIntegration()));
        let s1 = FakeStep(-1);
        let tc2 = tc.clone();
        let mut t = Task2Impl::new(s1,(),&cfg,tc2,"test");
        /* test */
        assert!(!tc.is_finished());
        t.run(0.);
        let actions = eah.drain();
        assert_eq!(3,actions.len());
        if let (ExecutorAction::Unblock(_),ExecutorAction::Block(h),ExecutorAction::Unblock(_)) = (&actions[0],&actions[1],&actions[2]) {
        } else {
            assert!(false);
        }
    }
}
