use std::sync::{ Arc, Mutex };

use crate::edgetrigger::EdgeTrigger;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::ReenteringIntegration;
use crate::step::{ KillReason, RunConfig };
use crate::timer::TimerSet;
use crate::taskcontainer::TaskHandle;

#[derive(Clone)]
pub struct TaskControl {
    integration: ReenteringIntegration,
    config: RunConfig,
    finished: Arc<Mutex<bool>>,
    kill_reason: Arc<Mutex<Option<KillReason>>>,
    task_handle: TaskHandle,
    action_handle: ExecutorActionHandle,
    timers: TimerSet,
    unblock: Arc<Mutex<EdgeTrigger<'static>>>
}

impl TaskControl {
    pub(crate) fn new(config: &RunConfig, timers: &TimerSet, 
                      action_handle: &ExecutorActionHandle, task_handle: &TaskHandle, 
                      integration: &ReenteringIntegration) -> TaskControl {
        let action_handle = action_handle.clone();
        let mut action_handle2 = action_handle.clone();
        let task_handle = *task_handle;
        TaskControl {
            config: config.clone(),
            finished: Arc::new(Mutex::new(false)),
            kill_reason: Arc::new(Mutex::new(None)),
            task_handle, action_handle,
            integration: integration.clone(),
            timers: timers.clone(),
            unblock: Arc::new(Mutex::new(EdgeTrigger::new(move || {
                action_handle2.add(ExecutorAction::Unblock(task_handle));
            })))
        }
    }

    /* timers */
    pub fn add_timer<T>(&mut self, timeout: f64, callback: T) where T: FnMut() + 'static {
        self.action_handle.add(ExecutorAction::Timer(timeout,Box::new(callback)));
    }

    pub(crate) fn check_timers(&mut self, now: f64) {
        self.timers.check(now);
    }

    /* kills */
    pub fn finish(&mut self, reason: Option<&KillReason>) {
        let mut finished = self.finished.lock().unwrap();
        if !*finished {
            if let Some(reason) = reason {
                *self.kill_reason.lock().unwrap() = Some(reason.clone());
                self.action_handle.add(ExecutorAction::Kill(self.task_handle,reason.clone()));
            } else {
                self.action_handle.add(ExecutorAction::Done(self.task_handle));
            }
            *finished = true;
            self.integration.cause_reentry();
        }
    }

    /* NOTE: relying on this value to detect completion here is racey. 
     * If true it has definitely finished, but if not it may well have
     * finished even before you get the false. Therefore it should only
     * be relied on to detect finish cases which would definitely have
     * occured before this call.
     */
    pub fn is_finished(&self) -> bool { *self.finished.lock().unwrap() }

    pub fn kill_reason(&self) -> Option<KillReason> {
        self.kill_reason.lock().unwrap().as_ref().map(|x| x.clone())
    }

    /* misc */
    pub fn get_config(&self) -> &RunConfig { &self.config }
    //pub fn get_remaining(&self) -> f64 { 0. }
    //pub fn dropped(&self) -> bool { false }

    /* blocking */

    pub fn unblock(&mut self) {
        self.unblock.lock().unwrap().set();
        self.integration.cause_reentry();
    }

    pub(crate) fn about_to_run(&mut self) {
        self.unblock.lock().unwrap().reset();
    }

    pub(crate) fn not_runnable(&mut self) {
        self.action_handle.add(ExecutorAction::Block(self.task_handle));
        if self.unblock.lock().unwrap().is_set() {
            /* handle race between this unblock call and rerun_soon
             * (we need to gurantee that the latter always wins)
             */
            self.action_handle.add(ExecutorAction::Unblock(self.task_handle));
        }
    }

    pub(crate) fn wait_for_next_tick(&mut self) {
        self.action_handle.add(ExecutorAction::Tick(self.task_handle));
    }

}

#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::taskcontainer::TaskContainer;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::control::TaskControl;
    use crate::step::{ Step2, StepState2 };

    pub struct FakeIntegration(Arc<Mutex<f64>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { *self.0.lock().unwrap() }
        fn sleep(&mut self, amount: SleepQuantity) {}
    }

    struct FakeStep();
    impl Step2<(),()> for FakeStep {
        fn execute(&mut self, input: &(), control: &mut TaskControl) -> StepState2<(),()> {
            StepState2::Block
        }
    }


    #[test]
    pub fn test_control_timers() {
        /* setup */
        let time = Arc::new(Mutex::new(0.));
        let integration = FakeIntegration(time.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = ExecutorActionHandle::new();
        let mut tc = x.add(FakeStep(),(),&cfg,"test");
        /* test */
        let mut shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.add_timer(1.,move || { *shared2.lock().unwrap() = true; });
        x.run_actions();
        x.check_timers(0.5);
        assert!(!*shared.lock().unwrap());
        x.check_timers(1.5);
        assert!(*shared.lock().unwrap());
    }

    #[test]
    pub fn test_control_kill() {
        /* setup */
        let cfg = RunConfig::new(None,0,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let integration = ReenteringIntegration::new(FakeIntegration(Arc::new(Mutex::new(0.))));
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&integration);
        /* test */
        assert!(!tc.is_finished());
        tc.finish(Some(&KillReason::Cancelled));
        assert!(tc.is_finished());
        tc.finish(Some(&KillReason::Timeout));
        assert!(tc.is_finished());
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Kill(_,KillReason::Cancelled) = actions[0] {
        } else {
            assert!(false);
        }
    }

    #[test]
    pub fn test_blocking() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let integration = ReenteringIntegration::new(FakeIntegration(Arc::new(Mutex::new(0.))));
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&integration);
        /* quickly test vaious accessors */
        assert_eq!(2,tc.get_config().get_priority());
        /* test */
        /* 2 unblocks cause single action */
        tc.unblock();
        tc.unblock();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Unblock(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* reset and then unblock and we should get another */
        tc.about_to_run();
        tc.unblock();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Unblock(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* not_runnable should cause a block */
        tc.about_to_run();
        tc.not_runnable();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Block(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* not runnable should not cause block if unblock called in-between */
        tc.about_to_run();
        tc.unblock();
        tc.not_runnable();
        let actions = eah.drain();
        assert_eq!(3,actions.len());
        if let (ExecutorAction::Unblock(_),
                ExecutorAction::Block(_),
                ExecutorAction::Unblock(_)) = (&actions[0],&actions[1],&actions[2]) {
        } else {
            assert!(false);
        }
        /* wait for next tick */
        tc.about_to_run();
        tc.wait_for_next_tick();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Tick(_) = actions[0] {
        } else {
            assert!(false);
        }
    }

    pub struct FakeIntegration2(Arc<Mutex<Vec<SleepQuantity>>>);
    impl CommanderIntegration2 for FakeIntegration2 {
        fn current_time(&mut self) -> f64 { 4. }
        fn sleep(&mut self, quantity: SleepQuantity) { self.0.lock().unwrap().push(quantity); }
    }

    #[test]
    pub fn test_oneshot() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let mut sleeps = Arc::new(Mutex::new(Vec::new()));
        let mut integration = ReenteringIntegration::new(FakeIntegration2(sleeps.clone()));
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&integration.clone());
        /* simulate */
        integration.sleep(SleepQuantity::Time(1.));
        tc.unblock(); /* sets one-shot, sends SleepQuantity::None */
        integration.sleep(SleepQuantity::Time(2.)); /* not sent */
        integration.reentering(); /* sent by executor at start of tick */
        integration.sleep(SleepQuantity::Time(3.));
        assert_eq!(vec![
            SleepQuantity::Time(1.),
            SleepQuantity::None,
            SleepQuantity::Time(3.)
        ],*sleeps.lock().unwrap());
    }
}
