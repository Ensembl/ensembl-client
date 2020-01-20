use std::sync::{ Arc, Mutex };
use futures::task::{ ArcWake, Context, waker_ref };

use crate::blocker::Blocker;


lazy_static! {
    static ref IDENTITY : Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

#[derive(Clone)]
pub struct Block {
    blocked: Arc<Mutex<bool>>,
    request_sent: Arc<Mutex<bool>>,
    downstream: Arc<Mutex<Vec<Block>>>,
    blocker: Blocker,
    identity: u64
}

impl PartialEq for Block {
    fn eq(&self, other: &Self) -> bool {
        self.identity == other.identity
    }
}

pub(crate) struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

impl Block {
    pub(crate) fn new(blocker: &Blocker) -> Block {
        let mut identity_source = IDENTITY.lock().unwrap();
        let identity = *identity_source;
        *identity_source += 1;
        Block {
            blocked: Arc::new(Mutex::new(true)),
            request_sent: Arc::new(Mutex::new(false)),
            downstream: Arc::new(Mutex::new(vec![])),
            blocker: blocker.clone(),
            identity
        }
    }

    pub(crate) fn future_waker(&self) -> Arc<StepWaker> {
        Arc::new(StepWaker(Mutex::new(self.clone())))
    }

    pub fn add(&mut self, upstream: &Block) {
        upstream.downstream.lock().unwrap().push(self.clone());
    }

    /* This is the one called asynchronously. It creates an unblock EA */
    pub fn unblock(&self) {
        *self.request_sent.lock().unwrap() = true;
        self.blocker.unblock_task(self);
    }

    /* This one is then called by the executor from an EA handler */
    pub(crate) fn unblock_real(&mut self) {
        *self.blocked.lock().unwrap() = false;
        for other in self.downstream.lock().unwrap().iter_mut() {
            other.unblock_real();
        }
    }

    /* Controls execution of step (set from unblock_steps) */
    pub(crate) fn step_blocked(&self) -> bool {
        *self.blocked.lock().unwrap()
    }

    /* Checked to ensure race avoidance*/
    pub(crate) fn unblock_was_sent(&self) -> bool {
        *self.request_sent.lock().unwrap()
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
        let eah = eah.new_task();
        eah.register(&h);
        let unblocker = Blocker::new(&integration,&eah);
        let mut b1 = Block::new(&unblocker);
        let mut b2 = Block::new(&unblocker);
        b1.add(&b2);
        assert!(b1.step_blocked());
        assert!(b2.step_blocked());
        b2.unblock_real();
        assert!(!b1.step_blocked());
        assert!(!b2.step_blocked());
    }
}