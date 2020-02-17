/* A block agent is delegated the task of requesting blocking and unblocking
 * from the executor. This could be handled directly in Agent EXCEPT it is
 * also needed in individual Blocks to implement unblock. Agents are too scary
 * and complex to directly reference insidea Block so just this functionality
 * is spun out of Agent to allow Block to call it directly.
 */

use crate::block::Block;
use crate::action::{ Action, TaskActionLink };
use crate::integration::ReenteringIntegration;

#[derive(Clone)]
pub(crate) struct BlockAgent {
    integration: ReenteringIntegration,
    action_handle: TaskActionLink
}

impl BlockAgent {
    pub fn new(integration: &ReenteringIntegration, action_handle: &TaskActionLink) -> BlockAgent {
        BlockAgent {
            integration: integration.clone(),
            action_handle: action_handle.clone()
        }
    }

    pub(crate) fn block_task(&self, blocker: &Block) {
        self.action_handle.add(Action::Block(blocker.clone()));
        if blocker.unblock_was_sent() {
            self.action_handle.add(Action::Unblock(blocker.clone()));
        }
    }

    pub(crate) fn unblock_task(&self, blocker: &Block) {
        self.action_handle.add(Action::Unblock(blocker.clone()));
        self.integration.cause_reentry();
    }
}
