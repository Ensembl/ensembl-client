use crate::executor::action::Action;
use crate::executor::link::TaskLink;
use crate::integration::reentering::ReenteringIntegration;
use crate::task::block::Block;

/* BlockAgent is the Agent mixin handling blocking, turnstiles, etc */

pub(crate) struct BlockAgent {
    blocks: Vec<Block>,
    integration: ReenteringIntegration,
    task_action_link: TaskLink<Action>,
}

impl BlockAgent {
    pub(super) fn new(integration: &ReenteringIntegration, task_action_link: &TaskLink<Action>) -> BlockAgent {
        BlockAgent {
            blocks: vec![Block::new_main(integration,task_action_link)],
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(crate) fn top_block(&self) -> Block {
        self.blocks[self.blocks.len()-1].clone()
    }

    pub(crate) fn push_block(&mut self, new: &Block) {
        self.blocks.push(new.clone());
    }

    pub(crate) fn pop_block(&mut self) {
        self.blocks.pop();
    }

    pub(super) fn block_task(&mut self) {
        self.task_action_link.add(Action::BlockTask());
    }

    pub(super) fn root_block(&mut self) -> &mut Block {
        &mut self.blocks[0]
    }

    pub(crate) fn new_block(&self, unblock: Box<dyn Fn(&TaskLink<Action>) + Send>) -> Block {
        Block::new(&self.integration,&self.task_action_link,unblock)
    }
}
