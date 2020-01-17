use std::sync::{ Arc, Mutex };

use crate::taskcontainer::TaskContainerHandle;
use crate::blocker::Blocker;

#[derive(Clone)]
pub struct Block {
    blocking_task: Arc<Mutex<Option<TaskContainerHandle>>>,
    blocked: Arc<Mutex<bool>>,
    unblock_sent: Arc<Mutex<bool>>,
    downstream: Arc<Mutex<Vec<Block>>>,
    blocker: Blocker
}

/* task_control is always Some except in unit test */

impl Block {
    pub(crate) fn new(blocker: &Blocker) -> Block {
        Block {
            blocking_task:  Arc::new(Mutex::new(None)),
            blocked: Arc::new(Mutex::new(true)),
            unblock_sent: Arc::new(Mutex::new(false)),
            downstream: Arc::new(Mutex::new(vec![])),
            blocker: blocker.clone()
        }
    }

    pub(crate) fn set_blocking_task(&mut self, bt: TaskContainerHandle) {
        *self.blocking_task.lock().unwrap() = Some(bt);
    }

    pub fn add(&mut self, upstream: &Block) {
        upstream.downstream.lock().unwrap().push(self.clone());
    }

    /* This is the one called asynchronously. It creates an unblock EA */
    pub fn unblock(&self) {
        *self.unblock_sent.lock().unwrap() = true;
        self.blocker.unblock_task(self);
    }

    /* This one is then called by the executor from an EA handler */
    pub(crate) fn unblock_steps(&mut self) -> Option<TaskContainerHandle> {
        let mut handle = self.blocking_task.lock().unwrap().clone();
        *self.blocked.lock().unwrap() = false;
        *self.blocking_task.lock().unwrap() = None;
        for other in self.downstream.lock().unwrap().iter_mut() {
            let h2 = other.unblock_steps();
            if handle.is_none() {
                handle = h2;
            }
        }
        handle
    }

    /* Controls execution of step (set from unblock_steps) */
    pub(crate) fn step_blocked(&self) -> bool {
        *self.blocked.lock().unwrap()
    }

    /* Controls sending correct number of Unblock EAs */
    pub(crate) fn unblock_was_sent(&self) -> bool {
        *self.unblock_sent.lock().unwrap()
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
        let unblocker = Blocker::new(&integration,&eah,&h);
        let mut b1 = Block::new(&unblocker);
        let mut b2 = Block::new(&unblocker);
        b1.add(&b2);
        assert!(b1.step_blocked());
        assert!(b2.step_blocked());
        b2.unblock_steps();
        assert!(!b1.step_blocked());
        assert!(!b2.step_blocked());
    }
}