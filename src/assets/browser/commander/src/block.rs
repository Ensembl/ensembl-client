/* Blocks are unblocked in two stages. An unblock can bre REQUESTED from anywhere, asynchronously.
 * The unblock only actually occurs, though, when the executor spots that request. That ensures
 * that no changes of state to block can race tast execution.
 */

use std::sync::{ Arc, Mutex };
use futures::task::ArcWake;

use crate::blockagent::BlockAgent;

sequence!(IDENTITY);

struct BlockState {
    blocked: bool,
    request_sent: bool,
    downstream: Vec<Block>
}

#[derive(Clone)]
pub struct Block {
    state: Arc<Mutex<BlockState>>,
    blocker: BlockAgent,
    identity: u64
}

hashable!(IDENTITY,Block,identity);

pub(crate) struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

impl Block {
    pub(crate) fn new(blocker: &BlockAgent) -> Block {
        let identity = IDENTITY.next();
        Block {
            state: Arc::new(Mutex::new(BlockState {
                blocked: true,
                request_sent: false,
                downstream: Vec::new()
            })),
            blocker: blocker.clone(),
            identity
        }
    }

    pub(crate) fn future_waker(&self) -> Arc<StepWaker> {
        Arc::new(StepWaker(Mutex::new(self.clone())))
    }

    pub fn add(&self, upstream: &Block) {
        upstream.state.lock().unwrap().downstream.push(self.clone());
    }

    /* This is the one called asynchronously. It creates an unblock EA */
    pub fn unblock(&self) {
        self.state.lock().unwrap().request_sent = true;
        self.blocker.unblock_task(self);
    }

    /* This one is then called by the executor from an EA handler */
    pub(crate) fn unblock_real(&self) {
        let mut state = self.state.lock().unwrap();
        state.blocked = false;
        for other in state.downstream.iter_mut() {
            other.unblock_real();
        }
    }

    /* Are we actually blocked (set from unblock_real) */
    pub(crate) fn step_blocked(&self) -> bool {
        self.state.lock().unwrap().blocked
    }

    /* Checked to ensure race avoidance*/
    pub(crate) fn unblock_was_sent(&self) -> bool {
        self.state.lock().unwrap().request_sent
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::timer::TimerSet;
    use crate::taskcontainer::TaskContainer;
    use crate::runconfig::RunConfig;
    use crate::action::ActionLink;
    use crate::testintegration::TestIntegration;
    use crate::integration::ReenteringIntegration;

    #[test]
    pub fn test_blocker() {
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let eah = eah.new_task();
        eah.register(&h);
        let unblocker = BlockAgent::new(&integration,&eah);
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