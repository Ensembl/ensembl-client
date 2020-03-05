use futures::task::ArcWake;
use std::sync::{ Arc, Mutex };
use crate::executor::action::Action;
use crate::executor::link::TaskLink;
use crate::integration::reentering::ReenteringIntegration;

/* A Block sits behind a Waker and is responsible for
 *   1. blocking and unblocking a task when approriate;
 *   2. indicating whether a branch is "worth" investigating: for turnstiles, etc.
 * 
 * Our executor guarantees that processing of received actions ("servicing") does
 * not take place at the same time as running the future itself ("executing"). 
 * A Block can be woken asynchronously, potentially in another thread. However all
 * this unblock does is send an action. Therefore reasoning about blocks can be
 * simplified into unblock actions in servicing and block actions in execution
 * which do not overlap.
 * 
 * A block manages a boolean, "blocked". Blocking simply sets this flag. This
 * happens either on exit from the execution phase at the top level or a turnstile
 * method on receiving a Poll::Pending. At the top level, the action sends a
 * message to block the task. This flag can be queried by turnstiles, etc.
 * 
 * Blocks have an associated action. The associated action is triggered by
 * unblocking. At the top level, a distinct action is posted to unblock the task. 
 * For other levels, it is upto the creating utility (eg turnstile) to
 * determine the action. In the case of turnstiles, the unblock is propagated to
 * the outer action.
 * 
 * The use of a separate action prevents a race. As this second action is always
 * itself generated during servicing, so any unblocks generated during execution
 * before the executor submitted the block message will still get serviced and
 * the block and unblock messages cannot be reordered.
 * 
 * Currently only turnstile uses inner blocks but it is anticipated that other
 * users may follow which are more selective in their propagation.
 */

identitynumber!(IDENTITY);

#[derive(Clone)]
pub(crate) struct Block {
    blocked: Arc<Mutex<bool>>,
    callback: Arc<Mutex<Box<dyn Fn(&TaskLink<Action>) + Send>>>,
    task_action_link: TaskLink<Action>,
    integration: ReenteringIntegration,
    identity: u64
}

hashable!(Block,identity);

pub(crate) struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().send_unblock_to_executor();
    }
}

impl Block {
    pub(crate) fn new(integration: &ReenteringIntegration, task_action_link: &TaskLink<Action>, unblock: Box<dyn Fn(&TaskLink<Action>) + Send>) -> Block {
        let identity = IDENTITY.next();
        Block {
            callback: Arc::new(Mutex::new(unblock)),
            blocked: Arc::new(Mutex::new(false)),
            task_action_link: task_action_link.clone(),
            integration: integration.clone(),
            identity
        }
    }

    pub(crate) fn new_main(integration: &ReenteringIntegration, task_action_link: &TaskLink<Action>) -> Block {
        Block::new(integration,task_action_link,Box::new(move |ah| {
            ah.add(Action::UnblockTask());
        }))
    }

    pub(crate) fn make_waker(&self) -> Arc<StepWaker> {
        Arc::new(StepWaker(Mutex::new(self.clone())))
    }

    pub(crate) fn send_unblock_to_executor(&self) {
        self.task_action_link.add(Action::Unblock(self.clone()));
        self.integration.cause_reentry();
    }

    pub(crate) fn block(&self) {
        *self.blocked.lock().unwrap() = true;
    }

    pub(crate) fn is_blocked(&self) -> bool {
        *self.blocked.lock().unwrap()
    }

    pub(crate) fn run_unblock(&self) {
        *self.blocked.lock().unwrap() = false;
        (self.callback.lock().unwrap())(&self.task_action_link);
    }
}
