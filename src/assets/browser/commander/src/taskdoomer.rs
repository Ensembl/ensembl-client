use crate::oneshot::OneShot;
use crate::timer::TimerSet;
use crate::task2::TaskControl;
use crate::commander::KillReason;

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
        let doomer = OneShot::new(|| control.kill(&KillReason::Timeout));
        self.timers.add(when,doomer.get_trigger().clone());
    }

    pub fn check(&mut self, now: f64) {
        self.timers.check(now);
    }
}