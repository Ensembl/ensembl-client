use crate::task::block::Block;

/* Actions are the back-channel to the executor from tasks. A queue of actions, the ActionLink
 * is populated by the Agent and TaskHandle when performing tasks and then drained by the
 * executor at the appropriate time.
 * 
 * This queue is known as the ActionLink. It is clonable and a copy sits in the Executor and in
 * each Agent. The copy in the executor is wrapped in a TaskActionLink. This TaskActionLink passes
 * presents the same API as ActionLink, but provides the required TaskContainerHandle from
 * its internal state. Not only does this simplify Agent, it allows Actions to be submitted before
 * the TaskContainerHandle is known (at startup). In this case the Actions are queued inside the
 * TaskActionLink itself until a TaskContainerHandle is registered (via register() called by the
 * Executor).
 */

pub(crate) enum Action {
    BlockTask(),
    Unblock(Block),
    UnblockTask(),
    Done(),
}

