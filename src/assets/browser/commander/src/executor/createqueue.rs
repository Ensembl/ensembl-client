use std::sync::{ Arc, Mutex };
use crate::agent::agent::Agent;
use crate::task::taskhandle::ExecutorTaskHandle;

#[derive(Clone)]
pub(crate) struct CreateQueue(Arc<Mutex<Option<Vec<(Box<dyn ExecutorTaskHandle + 'static>,Agent)>>>>);

impl CreateQueue {
    pub(crate) fn new() -> CreateQueue {
        CreateQueue(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn drain_creates(&mut self) -> Vec<(Box<dyn ExecutorTaskHandle + 'static>,Agent)> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }

    pub(crate) fn add(&self, task: Box<dyn ExecutorTaskHandle + 'static>, agent: Agent) {
        self.0.lock().unwrap().as_mut().unwrap().push((task,agent));
    }
}