use std::sync::Arc;

#[derive(Clone,PartialEq,Eq)]
pub enum KillReason { // XXX test it
    Timeout,
    Cancelled,
    NotNeeded
}

#[derive(Clone,PartialEq,Eq)]
pub enum TaskResult {
    Ongoing,
    Done,
    Killed(KillReason)
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
