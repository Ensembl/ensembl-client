use crate::agent::Agent;
use crate::block::Block;
use crate::task::Task;
use crate::taskcontainer::TaskContainerHandle;
use std::sync::{ Arc, Mutex };

/* For before we end up on the executor */
pub(crate) enum Action {
    Block(Block),
    Unblock(Block),
    Done(),
    Finishing(),
    Tick(u64,Box<dyn FnMut() + 'static + Send>),
    Timer(f64,Box<dyn FnMut() + 'static + Send>),
    Create(Box<dyn Task + 'static + Send>,Agent)
}

struct TaskActionLinkState {
    queue: Vec<Action>,
    eah: ActionLink,
    task: Option<TaskContainerHandle>
}

#[derive(Clone)]
pub(crate) struct TaskActionLink(Arc<Mutex<TaskActionLinkState>>);

impl TaskActionLink {
    fn new(eah: &ActionLink) -> TaskActionLink {
        TaskActionLink(Arc::new(Mutex::new(
            TaskActionLinkState {
                queue: Vec::new(),
                eah: eah.clone(),
                task: None
            }
        )))
    }

    pub(crate) fn get_action_link(&self) -> ActionLink {
        self.0.lock().unwrap().eah.clone()
    }

    pub(crate) fn register(&self, handle: &TaskContainerHandle) {
        let mut state = self.0.lock().unwrap();
        let mut queue = Vec::new();
        queue.append(&mut state.queue);
        for action in queue.drain(..) {
            state.eah.add(&handle,action);
        }
        state.task = Some(handle.clone());
    }

    pub(crate) fn add(&self, action: Action) {
        let mut state = self.0.lock().unwrap();
        if let Some(task) = &state.task {
            state.eah.add(task,action);
        } else {
            state.queue.push(action);
        }
    }
}

#[derive(Clone)]
pub(crate) struct ActionLink(Arc<Mutex<Option<Vec<(TaskContainerHandle,Action)>>>>);

impl ActionLink {
    pub(crate) fn new() -> ActionLink {
        ActionLink(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn new_task(&self) -> TaskActionLink {
        TaskActionLink::new(&self)
    }

    fn add(&self, tch: &TaskContainerHandle, action: Action) {
        self.0.lock().unwrap().as_mut().unwrap().push((tch.clone(),action));
    }

    pub(crate) fn drain(&mut self) -> Vec<(TaskContainerHandle,Action)> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }
}

#[allow(unused)]
mod test {
    use super::*;

    use crate::taskcontainer::TaskContainer;

    #[test]
    pub fn test_executoraction() {
        let mut c = TaskContainer::new();
        let mut eah = ActionLink::new();
        let h = c.allocate();
        eah.add(&h,Action::Timer(0.,Box::new(|| {})));
        eah.add(&h,Action::Done());
        let actions = eah.drain();
        if let (Action::Timer(_,_),Action::Done()) = (&actions[0].1,&actions[1].1) {
        } else {
            assert!(false);
        }
        assert!(eah.drain().len() == 0);
        eah.add(&h,Action::Tick(0,Box::new(|| {})));
        let actions = eah.drain();
        if let Action::Tick(0,_) = &actions[0].1 {
        } else {
            assert!(false);
        }
    }
}