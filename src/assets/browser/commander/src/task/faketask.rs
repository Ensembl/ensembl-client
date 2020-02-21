use std::sync::{ Arc, Mutex };
use super::task::{ KillReason, TaskSummary };
use super::taskhandle::ExecutorTaskHandle;

struct FakeTaskState {
    runs: u32,
    priority: i8
}

#[derive(Clone)]
pub(crate) struct FakeTask(Arc<Mutex<FakeTaskState>>);

impl FakeTask {
    pub(crate) fn new(priority: i8) -> FakeTask {
        FakeTask(Arc::new(Mutex::new(FakeTaskState {
            runs: 0,
            priority
        })))
    }

    pub(crate) fn run_count(&self) -> u32 {
        self.0.lock().unwrap().runs
    }
}

impl ExecutorTaskHandle for FakeTask {
    fn run(&mut self, _tick_index: u64) { self.0.lock().unwrap().runs += 1; }
    fn get_priority(&self) -> i8 { self.0.lock().unwrap().priority }
    fn summarize(&self) -> Option<TaskSummary> { None }
    fn evict(&self) {}
    fn kill(&self, _reason: KillReason) {}
    fn set_identity(&self, _identity: u64) {}
}
