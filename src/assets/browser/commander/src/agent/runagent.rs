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
    action_handle: TaskActionLink
}

impl RunAgent {
    pub(super) fn new(integration: &ReenteringIntegration, action_handle: &TaskActionLink, config: &RunConfig) -> RunAgent {
        RunAgent {
            tick_index: 0,
            config: config.clone(),
            integration: integration.clone(),
            action_handle: action_handle.clone()
        }
    }

    pub(super) fn set_tick_index(&mut self, tick: u64) {
        self.tick_index = tick;
    }

    pub(super) fn get_tick_index(&self) -> u64 { self.tick_index }

    pub(super) fn get_config(&self) -> &RunConfig { &self.config }

    pub(super) fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        let rc = rc.unwrap_or(self.config.clone());
        Agent::new(&rc,&self.action_handle.get_action_link(),&self.integration,name)
    }

    pub(super) fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        let handle2 = TaskHandle::new(&mut agent2,Box::pin(future));
        self.action_handle.add(Action::Create(Box::new(handle2.clone()),agent2.clone()));
        handle2
    }

    pub(super) fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(Action::Timer(timeout,Box::new(callback)));
    }

    pub(super) fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(Action::Tick(self.tick_index+ticks,Box::new(callback)));
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.action_handle.register(task_handle);
    }
}
