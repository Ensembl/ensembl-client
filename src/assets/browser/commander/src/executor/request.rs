use crate::agent::agent::Agent;
use crate::task::taskhandle::ExecutorTaskHandle;

pub(crate) enum Request {
    Create(Box<dyn ExecutorTaskHandle + 'static>,Agent),
    Tick(u64,Box<dyn FnMut() + 'static>),
    Timer(f64,Box<dyn FnMut() + 'static>)
}
