use crate::blocker::Blocker;
use crate::step::KillReason;
use crate::taskcontainer::TaskHandle;
use std::sync::{ Arc, Mutex };

pub(crate) enum ExecutorAction {
    Block(TaskHandle),
    Unblock(TaskHandle),
    Done(TaskHandle),
    Kill(TaskHandle,KillReason),
    Tick(TaskHandle),
    Timer(TaskHandle,f64,Box<dyn FnMut() + 'static + Send>)
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
        eah.add(ExecutorAction::Tick(h.clone()));
        eah.add(ExecutorAction::Done(h.clone()));
        let actions = eah.drain();
        if let (ExecutorAction::Tick(_),ExecutorAction::Done(_)) = (&actions[0],&actions[1]) {
        } else {
            assert!(false);
        }
        assert!(eah.drain().len() == 0);
        eah.add(ExecutorAction::Unblock(h));
        let actions = eah.drain();
        if let ExecutorAction::Unblock(_) = &actions[0] {
        } else {
            assert!(false);
        }
    }
}