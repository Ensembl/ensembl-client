use std::sync::{ Arc, Mutex };

use crate::taskcontrol::TaskUnblocker;

#[derive(Clone)]
pub struct Blocker {
    blocked: Arc<Mutex<bool>>,
    downstream: Arc<Mutex<Vec<Blocker>>>,
    ub: TaskUnblocker
}

/* task_control is always Some except in unit test */

impl Blocker {
    pub(crate) fn new(ub: &TaskUnblocker) -> Blocker {
        Blocker {
            blocked: Arc::new(Mutex::new(true)),
            downstream: Arc::new(Mutex::new(vec![])),
            ub: ub.clone()
        }
    }

    pub(crate) fn add(&mut self, upstream: &Blocker) {
        upstream.downstream.lock().unwrap().push(self.clone());
    }

    pub(crate) fn unblock_step(&mut self) {
        *self.blocked.lock().unwrap() = false;
        for other in self.downstream.lock().unwrap().iter_mut() {
            other.unblock_step();
        }
    }

    pub fn unblock(&mut self) {
        /* Unblocking comprises three things in strict order to avoid races:
         * 1. unblock steps which are part of this block
         * 2. send unblock message to executor
         * 3. cause executor reentry
        */
        self.unblock_step(); // 1
        self.ub.unblock(); // 2&3
    }

    pub(crate) fn is_blocked(&self) -> bool {
        *self.blocked.lock().unwrap()
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::timer::TimerSet;
    use crate::taskcontainer::TaskContainer;
    use crate::step::RunConfig;
    use crate::executoraction::ExecutorActionHandle;
    use crate::testintegration::TestIntegration;
    use crate::integration::ReenteringIntegration;

    #[test]
    pub fn test_blocker() {
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let unblocker = TaskUnblocker::new(&integration,&eah,&h);
        let mut b1 = Blocker::new(&unblocker);
        let mut b2 = Blocker::new(&unblocker);
        b1.add(&b2);
        assert!(b1.is_blocked());
        assert!(b2.is_blocked());
        b2.unblock_step();
        assert!(!b1.is_blocked());
        assert!(!b2.is_blocked());
    }
}