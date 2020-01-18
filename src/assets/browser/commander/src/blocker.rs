use crate::block::Block;
use crate::executoraction::{ AnonExecutorAction, ExecutorActionTaskHandle };
use crate::integration::ReenteringIntegration;

#[derive(Clone)]
pub(crate) struct Blocker {
    integration: ReenteringIntegration,
    action_handle: ExecutorActionTaskHandle
}

impl Blocker {
    pub fn new(integration: &ReenteringIntegration, action_handle: &ExecutorActionTaskHandle) -> Blocker {
        Blocker {
            integration: integration.clone(),
            action_handle: action_handle.clone()
        }
    }

    pub(crate) fn block_task(&self, blocker: &Block) {
        self.action_handle.add(AnonExecutorAction::Block(blocker.clone()));
        if blocker.unblock_was_sent() {
            self.action_handle.add(AnonExecutorAction::Unblock(blocker.clone()));
        }
    }

    pub(crate) fn unblock_task(&self, blocker: &Block) {
        self.action_handle.add(AnonExecutorAction::Unblock(blocker.clone()));
        self.integration.cause_reentry();
    }
}
