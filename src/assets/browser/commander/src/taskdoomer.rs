use crate::timer::TimerSet;
use crate::control::TaskControl;
use crate::step::KillReason;

pub struct TaskDoomer {
    timers: TimerSet
}

impl TaskDoomer {
    pub fn new() -> TaskDoomer {
        TaskDoomer {
            timers: TimerSet::new()
        }
    }
    
    pub fn add(&mut self, control: &TaskControl, when: f64) {
        let mut control = control.clone();
        self.timers.add(when,move || control.finish(Some(&KillReason::Timeout)));
    }

    pub fn check(&mut self, now: f64) {
        self.timers.check(now);
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
    use crate::step::RunConfig;
    use crate::taskcontainer::TaskContainer;

    #[test]
    pub fn test_doomer_smoke() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let mut tc = TaskControl::new(&cfg,&eah,&h);
        let mut doomer = TaskDoomer::new();
        /* test */
        doomer.add(&tc,1.);
        let actions = eah.drain();
        assert_eq!(0,actions.len());
        doomer.check(0.5);
        let actions = eah.drain();
        assert_eq!(0,actions.len());
        doomer.check(1.5);
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Kill(_,KillReason::Timeout) = actions[0] {
        } else {
            assert!(false);
        }
    }

    pub fn test_doomer_outofdate() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let mut tc = TaskControl::new(&cfg,&eah,&h);
        let mut doomer = TaskDoomer::new();
        /* test */
        doomer.add(&tc,1.);
        tc.finish(None);
        doomer.check(1.5);
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Done(_) = actions[0] {
        } else {
            assert!(false);
        }
    }
}