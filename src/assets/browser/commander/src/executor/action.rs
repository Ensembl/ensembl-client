use crate::agent::agent::Agent;
use crate::task::block::Block;
use crate::task::taskhandle::ExecutorTaskHandle;
use super::taskcontainer::TaskContainerHandle;
use std::sync::{ Arc, Mutex };

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
    Tick(u64,Box<dyn FnMut() + 'static + Send>),
    Timer(f64,Box<dyn FnMut() + 'static + Send>),
    Create(Box<dyn ExecutorTaskHandle + 'static + Send>,Agent)
}

#[derive(Clone)]
pub(crate) struct ActionLink(Arc<Mutex<Option<Vec<(TaskContainerHandle,Action)>>>>);

impl ActionLink {
    pub(crate) fn new() -> ActionLink {
        ActionLink(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn new_task_action_link(&self) -> TaskActionLink {
        TaskActionLink::new(&self)
    }

    fn add_action(&self, handle: &TaskContainerHandle, action: Action) {
        self.0.lock().unwrap().as_mut().unwrap().push((handle.clone(),action));
    }

    pub(crate) fn drain_actions(&mut self) -> Vec<(TaskContainerHandle,Action)> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }
}


struct TaskActionLinkState {
    pre_queue: Vec<Action>,
    action_link: ActionLink,
    task: Option<TaskContainerHandle>
}

#[derive(Clone)]
pub(crate) struct TaskActionLink(Arc<Mutex<TaskActionLinkState>>);

impl TaskActionLink {
    fn new(action_link: &ActionLink) -> TaskActionLink {
        TaskActionLink(Arc::new(Mutex::new(
            TaskActionLinkState {
                pre_queue: Vec::new(),
                action_link: action_link.clone(),
                task: None
            }
        )))
    }

    pub(crate) fn get_action_link(&self) -> ActionLink {
        self.0.lock().unwrap().action_link.clone()
    }

    pub(crate) fn register(&self, handle: &TaskContainerHandle) {
        let mut state = self.0.lock().unwrap();
        let mut queue = Vec::new();
        queue.append(&mut state.pre_queue);
        for action in queue.drain(..) {
            state.action_link.add_action(&handle,action);
        }
        state.task = Some(handle.clone());
    }

    pub(crate) fn add(&self, action: Action) {
        let mut state = self.0.lock().unwrap();
        if let Some(task) = &state.task {
            state.action_link.add_action(task,action);
        } else {
            state.pre_queue.push(action);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    use super::super::taskcontainer::TaskContainer;

    #[test]
    pub fn test_executoraction() {
        let mut c = TaskContainer::new();
        let mut eah = ActionLink::new();
        let h = c.allocate();
        eah.add_action(&h,Action::Timer(0.,Box::new(|| {})));
        eah.add_action(&h,Action::Done());
        let actions = eah.drain_actions();
        if let (Action::Timer(_,_),Action::Done()) = (&actions[0].1,&actions[1].1) {
        } else {
            assert!(false);
        }
        assert!(eah.drain_actions().len() == 0);
        eah.add_action(&h,Action::Tick(0,Box::new(|| {})));
        let actions = eah.drain_actions();
        if let Action::Tick(0,_) = &actions[0].1 {
        } else {
            assert!(false);
        }
    }
}