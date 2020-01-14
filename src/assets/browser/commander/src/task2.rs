use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;
use crate::step::{ RunConfig, Step2, StepState2, StepRun, StepRunner, OngoingState };

pub(crate) struct Task2Impl {
    runner: StepRunner<(),()>,
    run_config: RunConfig,
    task_control: TaskControl,
    name: String
}

pub(crate) trait Task2 {
    fn run(&mut self, tick_index: u64);
    fn get_priority(&self) -> i8;
    fn get_name(&self) -> String;
}

impl Task2Impl {
    pub(crate) fn new<X>(step: &mut Box<dyn Step2<X,(),()>>, input: &X, run_config: &RunConfig, task_control: &mut TaskControl, name: &str) -> Task2Impl where X: Send {
        let runner : StepRunner<(),()> = task_control.new_step(step,input);
        Task2Impl {
            runner,
            task_control: task_control.clone(),
            run_config: run_config.clone(),
            name: name.to_string()
        }
    }
}

impl Task2 for Task2Impl {
    fn get_priority(&self) -> i8 { self.run_config.get_priority() }
    fn get_name(&self) -> String { self.name.clone() }

    fn run(&mut self, tick_index: u64) {
        /* We use this racey method because we only really care about the single-threaded
         * case (this method is non-rentrant). If a task completes with Done in a previous
         * call (and this is the only call which handles this case), don't call execute
         * again. Other terminations (via kill) are never guaranteed synchronous and so one
         * more call of the step may occur if the signal is delivered between is_finished
         * and the call to execute. But this is just an extension of the inevitable
         * asynchrony of a signal being delivered at the start of an execute call as we are
         * non pre-emptive.
         */
        if self.task_control.is_finished() { 
            return;
        }
        self.task_control.about_to_run(tick_index);
        match self.runner.more() {
            StepState2::Done(_) | StepState2::Ongoing(OngoingState::Dead) => {
                self.task_control.finish_internal(None);
            },
            StepState2::Ongoing(OngoingState::Block) => {
                self.task_control.not_runnable();
            },
            StepState2::Ongoing(OngoingState::Tick) => {
                self.task_control.wait_for_next_tick();
            },
            StepState2::Ongoing(OngoingState::Again) => {}
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

    #[derive(Clone)]
    struct FakeStepRun(i32);
    impl StepRun<(),()> for FakeStepRun {
        fn more(&mut self, control: &mut StepControl) -> StepState2<(),()> {
            if self.0 < 0 {
                self.0 += 1;
                control.unblock();
                return StepState2::Ongoing(OngoingState::Block);
            }
            self.0 += 1;
            if self.0 == 1 {
                control.task_control().add_timer(0.,||{});
            }
            match self.0 {
                1|2 => StepState2::Ongoing(OngoingState::Again),
                _ => StepState2::Done(Ok(()))
            }
        }
    }

    struct FakeStep(FakeStepRun);
    impl Step2<(),()> for FakeStep {
        fn start(&mut self, input: &(), task_control: &mut TaskControl) -> Box<dyn StepRun<(),()>> {
            Box::new(self.0.clone())
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
        let s1 = FakeStep(FakeStepRun(0));
        let mut tc2 = tc.clone();
        let mut t = Task2Impl::new(&mut (Box::new(s1) as Box<dyn Step2<(),()>>),&(),&cfg,&mut tc2,"test");
        /* simple accessors */
        assert_eq!("test",t.get_name());
        assert_eq!(3,t.get_priority());
        /* simple running to completion */
        assert!(!tc.is_finished());
        t.run(0);
        assert!(!tc.is_finished());
        t.run(0);
        assert!(!tc.is_finished());
        /* check for tick action in one of those two runs */
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Timer(_,_,_) = actions[0] {
        } else {
            assert!(false);
        }
        /* finish */
        t.run(0);
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
        let s1 = FakeStep(FakeStepRun(-1));
        let mut tc2 = tc.clone();
        let mut t = Task2Impl::new(&mut (Box::new(s1) as Box<dyn Step2<(),()>>),&(),&cfg,&mut tc2,"test");
        /* test */
        assert!(!tc.is_finished());
        t.run(0);
        let actions = eah.drain();
        assert_eq!(3,actions.len());
        if let (ExecutorAction::Unblock(_),ExecutorAction::Block(h),ExecutorAction::Unblock(_)) = (&actions[0],&actions[1],&actions[2]) {
        } else {
            assert!(false);
        }
    }
}
