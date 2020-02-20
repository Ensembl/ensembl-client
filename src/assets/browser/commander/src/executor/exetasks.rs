use hashbrown::{ HashSet, HashMap };
use super::timings::ExecutorTimings;
use super::taskcontainer::{ TaskContainer, TaskContainerHandle };
use super::runnable::Runnable;
use crate::agent::agent::Agent;
use crate::task::slot::RunSlot;
use crate::task::task::TaskSummary;
use crate::task::taskhandle::ExecutorTaskHandle;

pub(crate) struct ExecutorTasks {
    tasks: TaskContainer,
    runnable: Runnable,
    blocked_by: HashSet<TaskContainerHandle>,
    slot_map: HashMap<RunSlot,TaskContainerHandle>
}

impl ExecutorTasks {
    pub(crate) fn new() -> ExecutorTasks {
        ExecutorTasks {
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            blocked_by: HashSet::new(),
            slot_map: HashMap::new()
        }
    }

    fn free_slot(&self, handle: &TaskContainerHandle, slot: &RunSlot) -> bool {
        if let Some(task) = self.tasks.get(handle) {
            if !slot.is_push() { return false }
            task.evict();
        }
        true
    }

    // XXX race with eviction
    pub(crate) fn check_slot(&mut self, agent: &Agent) -> bool {
        if let Some(slot) = agent.get_config().get_slot() {
            if let Some(tch) = self.slot_map.get(slot) {
                if !self.free_slot(tch,slot) {
                    return false;
                }
            }
        }
        true
    }

    pub(crate) fn use_slot(&mut self, agent: &Agent, handle: &TaskContainerHandle) {
        if let Some(slot) = agent.get_config().get_slot() {
            self.slot_map.insert(slot.clone(),handle.clone());
        }
    }

    pub(crate) fn block_task(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.blocked_by.insert(handle.clone());
    }

    pub(crate) fn unblock_task(&mut self, handle: &TaskContainerHandle) {
        self.blocked_by.remove(&handle);
        self.runnable.add(&self.tasks,&handle);
    }

    pub(crate) fn remove_task(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,&handle);
        self.blocked_by.remove(&handle);
        self.tasks.remove(&handle);
    }

    pub(crate) fn execute(&mut self, tick: u64) -> bool {
        self.runnable.run(&mut self.tasks,tick)
    }

    pub(crate) fn any_runnable(&self) -> bool {
        !self.runnable.empty()
    }

    pub(crate) fn create_handle(&mut self, agent: &Agent, handle: Box<dyn ExecutorTaskHandle>) -> TaskContainerHandle {
        let container_handle = self.tasks.allocate();
        agent.run_agent().register(&container_handle);
        handle.set_identity(container_handle.identity());
        self.tasks.set(&container_handle,handle);
        container_handle
    }

    pub(crate) fn check_timers(&self, timings: &ExecutorTimings) {
        timings.check_timers(&self.tasks);
    }

    pub fn summarize_all(&self) -> Vec<TaskSummary> {
        let mut out = vec![];
        for th in self.tasks.all_handles().to_vec().iter() {
            if let Some(t) = self.tasks.get(th) {
                if let Some(summary) = t.summarize() {
                    out.push(summary);
                }
            }
        }
        out
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use super::super::executor::Executor;
    use crate::task::task::TaskResult;
    use crate::integration::testintegration::TestIntegration;
    use crate::helper::flagfuture::FlagFuture;
    use crate::task::runconfig::RunConfig;

    #[test]
    pub fn test_executor_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = FlagFuture::new();
        let fos2 = fos.clone();
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.tick(2).await;
            fos2.await;
        };
        let mut tc = x.add(step,ctx);
        x.tick(10.);
        x.tick(10.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        fos.flag();
        assert_eq!(1,x.get_tasks().tasks.len());
        x.tick(10.);
        x.tick(10.);
        assert_eq!(0,x.get_tasks().tasks.len());
    }
}