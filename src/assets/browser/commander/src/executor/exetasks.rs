use hashbrown::{ HashMap, HashSet };
use crate::agent::agent::Agent;
use crate::task::slot::RunSlot;
use crate::task::task::TaskSummary;
use crate::task::taskhandle::ExecutorTaskHandle;
use super::runnable::Runnable;
use super::taskcontainer::{ TaskContainer, TaskContainerHandle };
use super::timings::ExecutorTimings;

pub(crate) struct ExecutorTasks {
    tasks: TaskContainer,
    runnable: Runnable,
    blocked_by: HashSet<TaskContainerHandle>,
    slot_queue: HashMap<RunSlot,Vec<TaskContainerHandle>>,
    handle_slot: HashMap<TaskContainerHandle,RunSlot>
}

impl ExecutorTasks {
    pub(crate) fn new() -> ExecutorTasks {
        ExecutorTasks {
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            blocked_by: HashSet::new(),
            slot_queue: HashMap::new(),
            handle_slot: HashMap::new()
        }
    }

    pub(crate) fn check_slot(&mut self, agent: &Agent) -> bool {
        if let Some(slot) = agent.get_config().get_slot() {
            let queue = self.slot_queue.entry(slot.clone()).or_insert_with(|| Vec::new());
            if slot.is_push() {
                for handle in queue.iter_mut() {
                    if let Some(task) = self.tasks.get(handle) {
                        task.evict();
                    }
                }
            } else {
                return queue.len() == 0;
            }
        }
        true
    }

    pub(crate) fn use_slot(&mut self, agent: &Agent, handle: &TaskContainerHandle) {
        if let Some(slot) = agent.get_config().get_slot() {
            self.slot_queue.entry(slot.clone()).or_insert_with(|| Vec::new()).push(handle.clone());
            self.handle_slot.insert(handle.clone(),slot.clone());
        }
    }

    pub(crate) fn block_task(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.blocked_by.insert(handle.clone());
    }

    fn other_using_slot(&self, slot: &RunSlot, handle: &TaskContainerHandle) -> bool {
        if let Some(queue) = self.slot_queue.get(slot) {
            if let Some(head) = queue.get(0) {
                if head != handle {
                    return true;
                }
            }
        }
        false
    }

    pub(crate) fn start_task(&mut self, handle: &TaskContainerHandle) {
        if let Some(slot) = self.handle_slot.get(&handle) {
            if self.other_using_slot(slot,handle) {
                /* Don't add to runnable until slot is free */
                return;
            }
        }
        self.runnable.add(&self.tasks,&handle);
    }

    pub(crate) fn unblock_task(&mut self, handle: &TaskContainerHandle) {
        self.blocked_by.remove(&handle);
        self.runnable.add(&self.tasks,&handle);
    }

    fn remove_from_slot_queue(&mut self, handle: &TaskContainerHandle) {
        if let Some(slot) = self.handle_slot.get(&handle) {
            if let Some(queue) = self.slot_queue.get_mut(slot) {
                if let Some(pos) = queue.iter().position(|v| v == handle) {
                    queue.remove(pos);
                }
                if let Some(next) = queue.get(0) {
                    self.runnable.add(&self.tasks,&next);
                }
            }
        }
    }

    pub(crate) fn remove_task(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.remove_from_slot_queue(handle);
        self.handle_slot.remove(&handle);
        self.blocked_by.remove(&handle);
        self.tasks.remove(&handle);
    }

    pub(crate) fn execute(&mut self, tick: u64) -> bool {
        self.runnable.run(&mut self.tasks,tick)
    }

    pub(crate) fn any_runnable(&self) -> bool {
        !self.runnable.empty()
    }

    pub(crate) fn summarize(&self, handle: &TaskContainerHandle) -> Option<TaskSummary> {
        self.tasks.get(handle).and_then(|x| x.summarize())
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

    pub(super) fn len(&self) -> usize { self.tasks.len() }
}

#[cfg(test)]
mod test {
    use crate::corefutures::promisefuture::PromiseFuture;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;
    use crate::task::task::TaskResult;
    use super::super::executor::Executor;

    #[test]
    pub fn test_executor_block() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = PromiseFuture::new();
        let fos2 = fos.clone();
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.tick(2).await;
            fos2.await;
        };
        let tc = x.add(step,ctx);
        x.tick(10.);
        x.tick(10.);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        fos.satisfy(());
        assert_eq!(1,x.get_tasks().tasks.len());
        x.tick(10.);
        x.tick(10.);
        assert_eq!(0,x.get_tasks().tasks.len());
    }
}