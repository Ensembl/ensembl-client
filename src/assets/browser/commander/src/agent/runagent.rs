use std::future::Future;

use crate::executor::action::Action;
use crate::executor::link::TaskLink;
use crate::executor::request::Request;
use crate::executor::taskcontainer::TaskContainerHandle;
use crate::integration::reentering::ReenteringIntegration;
use crate::task::runconfig::RunConfig;
use crate::task::taskhandle::TaskHandle;
use super::agent::Agent;

/* RunAgent is the Agent mixin responsible for various odds and ends around step execution */

pub(crate) struct RunAgent {
    tick_index: u64,
    config: RunConfig,
    integration: ReenteringIntegration,
    task_action_link: TaskLink<Action>,
    task_request_link: TaskLink<Request>
}

impl RunAgent {
    pub(super) fn new(integration: &ReenteringIntegration, task_action_link: &TaskLink<Action>, 
                        task_request_link: &TaskLink<Request>, config: &RunConfig) -> RunAgent {
        RunAgent {
            tick_index: 0,
            config: config.clone(),
            integration: integration.clone(),
            task_action_link: task_action_link.clone(),
            task_request_link: task_request_link.clone()
        }
    }

    pub(super) fn set_tick_index(&mut self, tick: u64) {
        self.tick_index = tick;
    }

    pub(super) fn get_tick_index(&self) -> u64 { self.tick_index }

    pub(super) fn get_config(&self) -> &RunConfig { &self.config }

    pub(super) fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        let rc = rc.unwrap_or(self.config.clone());
        Agent::new(&rc,&self.task_action_link.get_link(),&self.task_request_link.get_link(),&self.integration,name)
    }

    pub(super) fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static, R: 'static {
        let handle2 = TaskHandle::new(&mut agent2,Box::pin(future));
        self.task_request_link.add(Request::Create(Box::new(handle2.clone()),agent2.clone()));
        handle2
    }

    pub(super) fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static {
        self.task_request_link.add(Request::Timer(timeout,Box::new(callback)));
    }

    pub(super) fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static {
        self.task_request_link.add(Request::Tick(self.tick_index+ticks,Box::new(callback)));
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.task_action_link.register(task_handle);
        self.task_request_link.register(task_handle);
    }
}

#[cfg(test)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::task::KillReason;
    use super::*;

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
            let agentb = agent2.new_agent(None,"task2");
            let agentb2 = agentb.clone();
            agent2.add(async move {
                agentb2.tick(1).await;
                *tidied2.lock().unwrap() = true;
                agentb2.tick(1).await;
            },agentb);
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
            let agentb = agent2.new_agent(None,"task2");
            agentb.finish(KillReason::Cancelled);
            let agentb2 = agentb.clone();
            agent2.add(async move {
                agentb2.tick(1).await;
                *tidied2.lock().unwrap() = true;
                agentb2.tick(1).await;
            },agentb);
            42
        };
        x.add(step,agent);
        assert_eq!(1,x.get_tasks().summarize_all().len());
    }
}
