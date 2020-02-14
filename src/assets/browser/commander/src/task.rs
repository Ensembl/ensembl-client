use std::pin::Pin;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use owning_ref::{ MutexGuardRef, MutexGuardRefMut };
use crate::agent::Agent;

#[cfg_attr(test,derive(Debug))]
#[derive(Clone)]
pub struct TaskSummary {
    identity: u64,
    name: String,
    waits: Vec<String>
}

impl TaskSummary {
    pub(crate) fn new(identity: u64, name: &str, waits: &Vec<String>) -> TaskSummary {
        TaskSummary {
            identity,
            name: name.to_string(),
            waits: waits.to_vec()
        }
    }

    pub fn identity(&self) -> u64 { self.identity }
    pub fn get_name(&self) -> &str { &self.name }
    pub fn get_waits(&self) -> &Vec<String> { &self.waits }
}

pub(crate) trait Task {
    fn run(&mut self, tick_index: u64);
    fn evict(&self);
    fn get_priority(&self) -> i8;
    fn summarize(&self) -> TaskSummary;
}

#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum KillReason { // XXX test it
    Timeout,
    Cancelled,
    NotNeeded
}

#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum TaskResult {
    Ongoing,
    Done,
    Killed(KillReason)
}

pub struct TaskHandleState<R> {
    identity: u64,
    future: Pin<Box<dyn Future<Output=R>>>,
    agent: Agent,
    result: Option<R>,
    done: bool
}

pub struct TaskHandle<R>(Arc<Mutex<TaskHandleState<R>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<R> Clone for TaskHandle<R> {
    fn clone(&self) -> Self {
        TaskHandle(self.0.clone())
    }
}

impl<R> TaskHandle<R> {
    pub(crate) fn new(agent: &Agent, future: Pin<Box<dyn Future<Output=R>>>, identity: u64) -> TaskHandle<R> {
        TaskHandle(Arc::new(Mutex::new(TaskHandleState {
            identity,
            future,
            agent: agent.clone(),
            result: None,
            done: false
        })))
    }

    pub(crate) fn get_agent(&self) -> MutexGuardRef<TaskHandleState<R>,Agent> {
        MutexGuardRef::new(self.0.lock().unwrap()).map(|x| &x.agent)
    }

    pub fn peek_result(&self) -> TaskResult {
        let state = self.0.lock().unwrap();
        if let Some(kill) = state.agent.kill_reason() {
            TaskResult::Killed(kill)
        } else if state.done {
            TaskResult::Done
        } else {
            TaskResult::Ongoing
        }
    }

    pub fn kill(&self, reason: KillReason) {
        self.get_agent().finish(reason);
    }

    pub fn take_result(&self) -> Option<R> {
        let mut state = self.0.lock().unwrap();
        if !state.done { return None; }
        state.result.take()
    }

    pub fn get_result(&self) -> Option<MutexGuardRef<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.done && state.result.is_some() {
            Some(MutexGuardRef::new(state).map(|x| x.result.as_ref().unwrap()))
        } else {
            None
        }
    }

    pub fn get_result_mut(&self) -> Option<MutexGuardRefMut<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.done && state.result.is_some() {
            Some(MutexGuardRefMut::new(state).map_mut(|x| x.result.as_mut().unwrap()))
        } else {
            None
        }
    }

    pub fn get_waits(&self) -> Vec<String> {
        self.get_agent().get_waits()
    }

    pub fn get_name(&self) -> String {
        self.get_agent().get_name()
    }

    pub fn summary(&self) -> TaskSummary {
        self.summarize()
    }
}

impl<R> Task for TaskHandle<R> {
    fn get_priority(&self) -> i8 { self.get_agent().get_config().get_priority() }

    fn run(&mut self, tick_index: u64) {
        let mut state = self.0.lock().unwrap();
        let agent = state.agent.clone();
        let mut r = None;
        let finished = agent.more(&mut state.future, tick_index,&mut r);
        if r.is_some() {
            state.result = r;
        }
        if finished {
            state.done = true;
        }
    }

    fn summarize(&self) -> TaskSummary {
        let state = self.0.lock().unwrap();
        TaskSummary::new(state.identity,&state.agent.get_name(),&state.agent.get_waits())
    }

    fn evict(&self) {
        self.get_agent().finish(KillReason::NotNeeded);
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::testintegration::{ TestIntegration, tick_helper };
    use crate::runconfig::RunConfig;
    use crate::executor::Executor;
    use crate::integration::ReenteringIntegration;
    use crate::taskcontainer::TaskContainer;
    use crate::action::{ Action, ActionLink };

    #[test]
    pub fn test_handle_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let a = async move {
            tick_helper(ctx2,&[0,0,0]).await;
            42
        };
        let mut tc = x.add(a,ctx);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(tc.take_result().is_none());
        assert!(tc.get_result().is_none());
        assert!(tc.get_result_mut().is_none());
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(Some(42),tc.get_result().map(|x| *x));
        assert_eq!(Some(42),tc.get_result_mut().map(|x| *x));
        assert_eq!(Some(42),tc.take_result());
        assert!(tc.get_result().is_none());
        assert!(tc.get_result_mut().is_none());
        assert!(tc.peek_result() == TaskResult::Done);
    }

    #[test]
    pub fn test_task_smoke() {
        /* setup */
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let mut integration = TestIntegration::new();
        let mut tc = Agent::new(&cfg,&eah,&ReenteringIntegration::new(integration.clone()),"test");
        tc.register(&h);
        let ctx = tc.clone();
        let s1 = Box::pin(async move {
            ctx.timer(1.).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
        });
        let mut tc2 = tc.clone();
        let mut t = TaskHandle::new(&tc,s1,42);
        /* simple accessors */
        assert_eq!(3,t.get_priority());
        /* simple running to completion */
        assert!(!tc.is_finished());
        t.run(0);
        assert!(!tc.is_finished());
        t.run(0);
        assert!(!tc.is_finished());
        /* check for tick action in one of those two runs */
        let actions = eah.drain();
        assert_eq!(3,actions.len());
        if let Action::Timer(_,_,_) = actions[0] {
        } else {
            assert!(false);
        }
        if let Action::Block(_,_) = actions[1] {
        } else {
            assert!(false);
        }
    }
}