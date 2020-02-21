use std::sync::Arc;
use super::slot::RunSlot;

/* A RunConfig implements settings for running a task which are likely to be constant
 * across invocations to reduce the number of arguments passed to run methods. Future
 * extensions will likely extend or alter RunConfig to keep the rest of the API stable.
 */

/// Implements settings for running a task which are likely to be constant across invocations.
/// 
/// Exists to reduce the number of arguments passed to run methods and allow reuse.
#[derive(Clone)]
pub struct RunConfig {
    slot: Arc<Option<RunSlot>>,
    priority: i8,
    timeout: Option<f64>
}

impl RunConfig {
    /// Create a configuration using the given parameters.
    /// 
    /// `slot`, if given represents the slot to use for this task (see crate-level documentation). `priority` represents
    /// the run priority. It is intended as a broad brush for classes of task (real-time, interactive, batch, etc), not
    /// for fine tuning of execution speeds. Don't go overboard with the number of priorities. `timeout`, if given, is a
    /// timeout in time units suppied by the integration, after which the executor will send a kill signal to the
    /// future. Note that, given the non-preemptability of our environment this still requires a "well-behaved" task.
    pub fn new(slot: Option<RunSlot>, priority: i8, timeout: Option<f64>) -> RunConfig {
        RunConfig {
            slot: Arc::new(slot),
            priority,
            timeout
        }
    }

    /// Return slot passed at creation.
    pub fn get_slot(&self) -> &Option<RunSlot> { &self.slot }

    /// Return priority passed at creation.
    pub fn get_priority(&self) -> i8 { self.priority }

    /// Return timeout passed at creation.
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
