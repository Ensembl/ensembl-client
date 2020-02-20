use std::sync::Arc;
use super::slot::RunSlot;

/* A RunConfig implements settings for running a task which are likely to be constant
 * across invocations to reduce the number of arguments passed to run methods. Future
 * extensions will likely extend or alter RunConfig to keep the rest of the API stable.
 */

#[derive(Clone)]
pub struct RunConfig {
    slot: Arc<Option<RunSlot>>,
    priority: i8,
    timeout: Option<f64>
}

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

#[cfg(test)]
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
