use crate::block::Block;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::ReenteringIntegration;
use crate::taskcontainer::TaskContainerHandle;

#[derive(Clone)]
pub(crate) struct Blocker {
    integration: ReenteringIntegration,
    action_handle: ExecutorActionHandle,
    task_handle: TaskContainerHandle,
}

impl Blocker {
    pub fn new(integration: &ReenteringIntegration, action_handle: &ExecutorActionHandle, task_handle: &TaskContainerHandle) -> Blocker {
        Blocker {
            integration: integration.clone(),
            action_handle: action_handle.clone(),
            task_handle: task_handle.clone(),
        }
    }

    pub(crate) fn block_task(&self, blocker: &Block) {
        self.action_handle.add(ExecutorAction::Block(self.task_handle.clone(),blocker.clone()));
        if blocker.unblock_was_sent() {
            self.action_handle.add(ExecutorAction::Unblock(blocker.clone()));
        }
    }

    pub(crate) fn unblock_task(&mut self, blocker: &Block) {
        self.action_handle.add(ExecutorAction::Unblock(blocker.clone()));
        self.integration.cause_reentry();
    }
}
