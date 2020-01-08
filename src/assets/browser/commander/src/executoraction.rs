use crate::step::KillReason;
use crate::taskcontainer::TaskHandle;
use std::sync::{ Arc, Mutex };

#[derive(PartialEq)]
pub(crate) enum ExecutorAction {
    Block(TaskHandle),
    Unblock(TaskHandle),
    Done(TaskHandle),
    Kill(TaskHandle,KillReason)
}

#[derive(Clone)]
pub(crate) struct ExecutorActionHandle(Arc<Mutex<Option<Vec<ExecutorAction>>>>);

impl ExecutorActionHandle {
    pub(crate) fn new() -> ExecutorActionHandle {
        ExecutorActionHandle(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn add(&mut self, action: ExecutorAction) {
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
        eah.add(ExecutorAction::Block(h));
        eah.add(ExecutorAction::Done(h));
        assert!(vec![ExecutorAction::Block(h),ExecutorAction::Done(h)] == eah.drain());
        assert!(eah.drain().len() == 0);
        eah.add(ExecutorAction::Unblock(h));
        assert!(vec![ExecutorAction::Unblock(h)] == eah.drain());
    }
}