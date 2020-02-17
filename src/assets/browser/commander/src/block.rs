/* Blocks represent the underlying datastructure of a Waker. A block is created 
 * whenever a task is stepped and also when passing through turnstiles (see
 * turnstile helper). During exeuction, blocks are managed on a stack. As pushing
 * a block links the element to the member beneath it and as references can be
 * kept by inidivudal steps beyond their execution, the overall result is a tree.
 * 
 * The "lower" blocks, ie the ones created by the agent step and outer turnstiles
 * are termed "downstream" to inner turnstiles, which are called "upstream". When
 * an "upstream" is unblocked (via the waker) all blocks downstream of this are also
 * unblocked. The lowest Block is handled specially by the agent, after a step is 
 * run. If Poll::Pending is returned, the task is added to blocked tasks with the
 * lowest block added as the blocking task via a call to Block (mediated by 
 * BlockAgent). When the waker is woken, probably asynchronously, the unblocking 
 * travels down the block tree, triggering Unblock messages to the executor at each 
 * stage. When the executor services requests, it calls do_unblock() to actually
 * update the status of blocks. This ensures no races within the futures themselves
 * from asynchronously-triggered blocks: they only see as unblocked adter the
 * Executor has processed the message which happens outside any async code. If one of 
 * these unblocks matches the task stored against this task, the task is unblocked by
 * the executor. 
 * 
 * Because the Block message is sent at the end of step-execution and the unblock
 * asynchronously, there could be an ordering issue with messages. To prevent this,
 * logic to resend any unblock is included in BlockAgent which wraps calls to send
 * block/unblock messages.
 */

use std::sync::{ Arc, Mutex };
use futures::task::ArcWake;

use crate::blockagent::BlockAgent;

sequence!(IDENTITY);

struct BlockState {
    blocked: bool,
    unblock_was_sent: bool,
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
        arc_self.0.lock().unwrap().send_unblock_to_executor();
    }
}

impl Block {
    pub(crate) fn new(blocker: &BlockAgent) -> Block {
        let identity = IDENTITY.next();
        Block {
            state: Arc::new(Mutex::new(BlockState {
                blocked: true,
                unblock_was_sent: false,
                downstream: Vec::new()
            })),
            blocker: blocker.clone(),
            identity
        }
    }

    pub(crate) fn make_waker(&self) -> Arc<StepWaker> {
        Arc::new(StepWaker(Mutex::new(self.clone())))
    }

    pub fn add_upstream(&self, upstream: &Block) {
        upstream.state.lock().unwrap().downstream.push(self.clone());
    }

    fn send_unblock_to_executor(&self) {
        self.state.lock().unwrap().unblock_was_sent = true;
        self.blocker.unblock_task(self);
    }

    /* This one is then called by the executor from an EA handler */
    pub(crate) fn do_unblock(&self) {
        let mut state = self.state.lock().unwrap();
        state.blocked = false;
        for other in state.downstream.iter_mut() {
            other.do_unblock();
        }
    }

    /* Are we actually blocked (set from unblock_real) */
    pub(crate) fn is_blocked(&self) -> bool {
        self.state.lock().unwrap().blocked
    }

    /* Checked to ensure race avoidance*/
    pub(crate) fn unblock_was_sent(&self) -> bool {
        self.state.lock().unwrap().unblock_was_sent
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::taskcontainer::TaskContainer;
    use crate::task::runconfig::RunConfig;
    use crate::executor::action::ActionLink;
    use crate::integration::testintegration::TestIntegration;
    use crate::integration::reentering::ReenteringIntegration;

    #[test]
    pub fn test_blocker() {
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let eah = eah.new_task_action_link();
        eah.register(&h);
        let unblocker = BlockAgent::new(&integration,&eah);
        let mut b1 = Block::new(&unblocker);
        let mut b2 = Block::new(&unblocker);
        b1.add_upstream(&b2);
        assert!(b1.is_blocked());
        assert!(b2.is_blocked());
        b2.do_unblock();
        assert!(!b1.is_blocked());
        assert!(!b2.is_blocked());
    }
}