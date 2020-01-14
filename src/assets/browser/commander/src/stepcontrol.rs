use crate::taskcontrol::TaskControl;

pub struct StepControl {
    task_control: TaskControl,
    blocked_on_tick: Option<u64>,
    is_dead: bool
}

impl StepControl {
    pub(crate) fn new(task_control: &TaskControl) -> StepControl {
        StepControl {
            task_control: task_control.clone(),
            blocked_on_tick: None,
            is_dead: false
        }
    }

    pub fn task_control(&mut self) -> &mut TaskControl {
        &mut self.task_control
    }

    pub(crate) fn check_tick(&mut self, tick: u64) -> bool {
        let blocked = self.blocked_on_tick.map(|b| b==tick).unwrap_or(false);
        if !blocked {
            self.blocked_on_tick = None;
        }
        !blocked
    }

    pub(crate) fn block_on_tick(&mut self, tick: u64) {
        self.blocked_on_tick = Some(tick);
    }

    pub fn unblock(&mut self) {
        self.task_control.unblock();
    }

    pub(crate) fn die(&mut self) {
        self.is_dead = true;
    }

    pub(crate) fn is_dead(&self) -> bool {
        self.is_dead
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::step::RunConfig;
    use crate::taskcontainer::TaskContainer;
    use crate::executoraction::ExecutorActionHandle;
    use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
    use crate::timer::TimerSet;

    pub struct FakeIntegration(Arc<Mutex<f64>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { *self.0.lock().unwrap() }
        fn sleep(&mut self, amount: SleepQuantity) {}
    }

    #[test]
    pub fn test_block_on_tick() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let timers = TimerSet::new();
        let integration = ReenteringIntegration::new(FakeIntegration(Arc::new(Mutex::new(0.))));
        let mut tc = TaskControl::new(&cfg,&timers,&eah,&h,&integration);
        let mut sc = StepControl::new(&tc);
        assert!(sc.check_tick(0));
        sc.block_on_tick(0);
        assert!(!sc.check_tick(0));
        assert!(sc.check_tick(1));
        assert!(sc.check_tick(0));
    }
}