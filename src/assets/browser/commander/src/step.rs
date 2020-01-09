use std::sync::Arc;
use crate::control::TaskControl;

pub enum StepState2<Y,E> {
    Again,
    Tick,
    Done(Result<Y,E>),
    Block
}

#[derive(Clone,PartialEq)]
pub enum KillReason {
    Timeout,
    Cancelled,
    NotNeeded
}

pub enum StepResult<Y,E> {
    Done(Result<Y,E>),
    Killed(KillReason)
}

pub trait Step2<X,Y,Error=()> : Send {
    fn execute(&mut self, input: &X, signal: &mut TaskControl) -> StepState2<Y,Error>;
    fn drop(&mut self, _: &X, _: StepResult<Y,Error>) {}
}

#[derive(Clone)]
pub struct RunConfig {
    slot: Arc<Option<RunSlot>>,
    priority: i8,
    timeout: Option<f64>
}

pub struct RunSlot {}

impl RunConfig {
    pub fn new(slot: Option<RunSlot>, priority: i8, timeout: Option<f64>) -> RunConfig {
        RunConfig {
            slot: Arc::new(slot),
            priority,
            timeout
        }
    }

    pub fn get_slot(&self) -> &Option<RunSlot> { &self.slot }
    pub fn get_priority(&self) -> i8 { self.priority }
    pub fn get_timeout(&self) -> Option<f64> { self.timeout }
}

#[allow(unused)]
mod test {
    use super::*;

    #[test]
    pub fn test_runconfig() {
        let rc = RunConfig::new(None,-2,Some(10.));
        assert!(rc.get_slot().is_none());
        assert_eq!(-2,rc.get_priority());
        assert_eq!(Some(10.),rc.get_timeout());
    }
}
