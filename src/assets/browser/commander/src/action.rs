use crate::agent::Agent;
use crate::block::Block;
use crate::task::Task;
use crate::taskcontainer::TaskContainerHandle;
use std::sync::{ Arc, Mutex };

// XXX don't be dumb: tch+AnonAction here
pub(crate) enum Action {
    Block(TaskContainerHandle,Block),
    Unblock(TaskContainerHandle,Block),
    Done(TaskContainerHandle),
    Finishing(TaskContainerHandle),
    Tick(TaskContainerHandle,u64,Box<dyn FnMut() + 'static + Send>),
    Timer(TaskContainerHandle,f64,Box<dyn FnMut() + 'static + Send>),
    Create(TaskContainerHandle,Box<dyn Task + 'static + Send>,Agent)
}

/* For before we end up on the executor */
pub(crate) enum AnonAction {
    Block(Block),
    Unblock(Block),
    Done(),
    Finishing(),
    Tick(u64,Box<dyn FnMut() + 'static + Send>),
    Timer(f64,Box<dyn FnMut() + 'static + Send>),
    Create(Box<dyn Task + 'static + Send>,Agent)
}

impl AnonAction {
    fn map(self, handle: &TaskContainerHandle) -> Action {
        let handle = handle.clone();
        match self {
            AnonAction::Block(b) => Action::Block(handle,b),
            AnonAction::Unblock(b) => Action::Unblock(handle,b),
            AnonAction::Done() => Action::Done(handle),
            AnonAction::Finishing() => Action::Finishing(handle),
            AnonAction::Tick(t,f) => Action::Tick(handle,t,f),
            AnonAction::Timer(t,f) => Action::Timer(handle,t,f),
            AnonAction::Create(t,a) => Action::Create(handle,t,a)
        }
    }
}

struct TaskActionLinkState {
    queue: Vec<AnonAction>,
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
            state.eah.add(action.map(handle));
        }
        state.task = Some(handle.clone());
    }

    pub(crate) fn add(&self, action: AnonAction) {
        let mut state = self.0.lock().unwrap();
        if let Some(task) = &state.task {
            state.eah.add(action.map(task));
        } else {
            state.queue.push(action);
        }
    }
}

#[derive(Clone)]
pub(crate) struct ActionLink(Arc<Mutex<Option<Vec<Action>>>>);

impl ActionLink {
    pub(crate) fn new() -> ActionLink {
        ActionLink(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn new_task(&self) -> TaskActionLink {
        TaskActionLink::new(&self)
    }

    fn add(&self, action: Action) {
        self.0.lock().unwrap().as_mut().unwrap().push(action);
    }

    pub(crate) fn drain(&mut self) -> Vec<Action> {
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
        eah.add(Action::Timer(h.clone(),0.,Box::new(|| {})));
        eah.add(Action::Done(h.clone()));
        let actions = eah.drain();
        if let (Action::Timer(_,_,_),Action::Done(_)) = (&actions[0],&actions[1]) {
        } else {
            assert!(false);
        }
        assert!(eah.drain().len() == 0);
        eah.add(Action::Tick(h,0,Box::new(|| {})));
        let actions = eah.drain();
        if let Action::Tick(_,0,_) = &actions[0] {
        } else {
            assert!(false);
        }
    }
}