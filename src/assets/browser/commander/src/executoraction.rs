use crate::block::Block;
use crate::step::KillReason;
use crate::taskcontainer::TaskContainerHandle;
use std::sync::{ Arc, Mutex };

pub(crate) enum ExecutorAction {
    Block(TaskContainerHandle,Block),
    Unblock(Block),
    Done(TaskContainerHandle),
    Kill(TaskContainerHandle,KillReason),
    UnblockOnTick(TaskContainerHandle,u64,Box<dyn FnMut() + 'static + Send>),
    Timer(TaskContainerHandle,f64,Box<dyn FnMut() + 'static + Send>)
}

/* For before we end up on the executor */
pub(crate) enum AnonExecutorAction {
    Block(Block),
    Unblock(Block),
    Done(),
    Kill(KillReason),
    UnblockOnTick(u64,Box<dyn FnMut() + 'static + Send>),
    Timer(f64,Box<dyn FnMut() + 'static + Send>)
}

impl AnonExecutorAction {
    fn map(self, handle: &TaskContainerHandle) -> ExecutorAction {
        let handle = handle.clone();
        match self {
            AnonExecutorAction::Block(b) => ExecutorAction::Block(handle,b),
            AnonExecutorAction::Unblock(b) => ExecutorAction::Unblock(b),
            AnonExecutorAction::Done() => ExecutorAction::Done(handle),
            AnonExecutorAction::Kill(r) => ExecutorAction::Kill(handle,r),
            AnonExecutorAction::UnblockOnTick(t,f) => ExecutorAction::UnblockOnTick(handle,t,f),
            AnonExecutorAction::Timer(t,f) => ExecutorAction::Timer(handle,t,f)
        }
    }
}

struct ExecutorActionTaskHandleState {
    queue: Vec<AnonExecutorAction>,
    eah: ExecutorActionHandle,
    task: Option<TaskContainerHandle>
}

#[derive(Clone)]
pub(crate) struct ExecutorActionTaskHandle(Arc<Mutex<ExecutorActionTaskHandleState>>);

impl ExecutorActionTaskHandle {
    fn new(eah: &ExecutorActionHandle) -> ExecutorActionTaskHandle {
        ExecutorActionTaskHandle(Arc::new(Mutex::new(
            ExecutorActionTaskHandleState {
                queue: Vec::new(),
                eah: eah.clone(),
                task: None
            }
        )))
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

    pub(crate) fn add(&self, action: AnonExecutorAction) {
        let mut state = self.0.lock().unwrap();
        if let Some(task) = &state.task {
            state.eah.add(action.map(task));
        } else {
            state.queue.push(action);
        }
    }
}

#[derive(Clone)]
pub(crate) struct ExecutorActionHandle(Arc<Mutex<Option<Vec<ExecutorAction>>>>);

impl ExecutorActionHandle {
    pub(crate) fn new() -> ExecutorActionHandle {
        ExecutorActionHandle(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn new_task(&self) -> ExecutorActionTaskHandle {
        ExecutorActionTaskHandle::new(&self)
    }

    fn add(&self, action: ExecutorAction) {
        self.0.lock().unwrap().as_mut().unwrap().push(action);
    }

    pub(crate) fn drain(&mut self) -> Vec<ExecutorAction> {
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
        let mut eah = ExecutorActionHandle::new();
        let h = c.allocate();
        eah.add(ExecutorAction::Timer(h.clone(),0.,Box::new(|| {})));
        eah.add(ExecutorAction::Done(h.clone()));
        let actions = eah.drain();
        if let (ExecutorAction::Timer(_,_,_),ExecutorAction::Done(_)) = (&actions[0],&actions[1]) {
        } else {
            assert!(false);
        }
        assert!(eah.drain().len() == 0);
        eah.add(ExecutorAction::Kill(h,KillReason::Cancelled));
        let actions = eah.drain();
        if let ExecutorAction::Kill(_,_) = &actions[0] {
        } else {
            assert!(false);
        }
    }
}