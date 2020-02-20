use std::future::Future;

use super::agent::Agent;
use crate::executor::action::{ Action, TaskActionLink };
use crate::integration::reentering::ReenteringIntegration;
use crate::task::runconfig::RunConfig;
use crate::executor::taskcontainer::TaskContainerHandle;

use crate::task::taskhandle::TaskHandle;

/* RunAgent is the Agent mixin responsible for various odds and ends around step execution */

pub(crate) struct RunAgent {
    tick_index: u64,
    config: RunConfig,
    integration: ReenteringIntegration,
    task_action_link: TaskActionLink
}

impl RunAgent {
    pub(super) fn new(integration: &ReenteringIntegration, task_action_link: &TaskActionLink, config: &RunConfig) -> RunAgent {
        RunAgent {
            tick_index: 0,
            config: config.clone(),
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(super) fn set_tick_index(&mut self, tick: u64) {
        self.tick_index = tick;
    }

    pub(super) fn get_tick_index(&self) -> u64 { self.tick_index }

    pub(super) fn get_config(&self) -> &RunConfig { &self.config }

    pub(super) fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        let rc = rc.unwrap_or(self.config.clone());
        Agent::new(&rc,&self.task_action_link.get_action_link(),&self.integration,name)
    }

    pub(super) fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        let handle2 = TaskHandle::new(&mut agent2,Box::pin(future));
        self.task_action_link.add(Action::Create(Box::new(handle2.clone()),agent2.clone()));
        handle2
    }

    pub(super) fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.task_action_link.add(Action::Timer(timeout,Box::new(callback)));
    }

    pub(super) fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        self.task_action_link.add(Action::Tick(self.tick_index+ticks,Box::new(callback)));
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.task_action_link.register(task_handle);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::task::KillReason;

    #[test]
    pub fn test_create_subtask() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(false));
        let tidied2 = tidied.clone();
        let step = async move {
            let agentb = agent2.new_agent("task2",None);
            let agentb2 = agentb.clone();
            agent2.submit(agentb,async move {
                agentb2.tick(1).await;
                *tidied2.lock().unwrap() = true;
                agentb2.tick(1).await;
            });
            42
        };
        let handle = x.add(step,agent);
        x.tick(1.);
        assert!(!*tidied.lock().unwrap());
        assert_eq!(Some(42),handle.take_result());
        x.tick(1.);
        assert!(*tidied.lock().unwrap());
        let all = x.summarize_all();
        assert_eq!(1,all.len());
        assert_eq!("task2",all[0].get_name());
    }

    #[test]
    pub fn test_kill_before_run() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(false));
        let tidied2 = tidied.clone();
        let step = async move {
            let agentb = agent2.new_agent("task2",None);
            agentb.finish(KillReason::Cancelled);
            let agentb2 = agentb.clone();
            agent2.submit(agentb,async move {
                agentb2.tick(1).await;
                *tidied2.lock().unwrap() = true;
                agentb2.tick(1).await;
            });
            42
        };
        x.add(step,agent);
        assert_eq!(1,x.get_tasks().summarize_all().len());
    }
}
