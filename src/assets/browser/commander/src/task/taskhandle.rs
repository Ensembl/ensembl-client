use std::pin::Pin;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use crate::agent::Agent;
use owning_ref::MutexGuardRef;
use super::task::{ TaskSummary, KillReason, TaskResult };

#[cfg(test)]
use owning_ref::MutexGuardRefMut;

/* A TaskHandle is the principal data-structure by which code OUTSIDE the task itself
 * interacts with it, prinicpally being examining its status, name, etc, whether or
 * not it is complete and its final result. A TaskHandle is visible outside the crate.
 * 
 * To avoid polymorphism in the executor, methods required by the executor use a trait
 * of a full TaskHandle, ExecutorTaskHandle, which is not polymorphic.
 * 
 * The state of a TaskHandle is actually stored in a TaskHandleState to allow clone to
 * be implemented via Arc. Not only is this a nice-to-have, we need at least two copies
 * of state: one in the executor and one given to the user, so some sharing would have
 * been needed in any case.
 */

pub(crate) trait ExecutorTaskHandle {
    fn run(&mut self, tick_index: u64);
    fn evict(&self);
    fn get_priority(&self) -> i8;
    fn summarize(&self) -> Option<TaskSummary>;
    fn kill(&self, reason: KillReason);
    fn set_identity(&self, identity: u64);
}

pub struct TaskHandleState<R: 'static + Send> {
    identity: Option<u64>,
    future: Pin<Box<dyn Future<Output=R> + 'static + Send>>,
    agent: Agent,
    result: Option<R>,
    done: bool
}

pub struct TaskHandle<R: 'static + Send>(Arc<Mutex<TaskHandleState<R>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<R> Clone for TaskHandle<R> where R: 'static + Send {
    fn clone(&self) -> Self {
        TaskHandle(self.0.clone())
    }
}

impl<R> TaskHandle<R> where R: 'static + Send {
    pub(crate) fn new(agent: &Agent, future: Pin<Box<dyn Future<Output=R> + 'static + Send>>) -> TaskHandle<R> {
        TaskHandle(Arc::new(Mutex::new(TaskHandleState {
            identity: None,
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
        let kill = state.agent.finish_agent().kill_reason();
        if let Some(kill) = kill.clone() {
            TaskResult::Killed(kill)
        } else if state.done {
            TaskResult::Done
        } else {
            TaskResult::Ongoing
        }
    }

    pub fn take_result(&self) -> Option<R> {
        let mut state = self.0.lock().unwrap();
        if !state.done { return None; }
        state.result.take()
    }

    #[cfg(test)]
    fn get_result(&self) -> Option<MutexGuardRef<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.done && state.result.is_some() {
            Some(MutexGuardRef::new(state).map(|x| x.result.as_ref().unwrap()))
        } else {
            None
        }
    }

    #[cfg(test)]
    fn get_result_mut(&self) -> Option<MutexGuardRefMut<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.done && state.result.is_some() {
            Some(MutexGuardRefMut::new(state).map_mut(|x| x.result.as_mut().unwrap()))
        } else {
            None
        }
    }

    pub fn get_waits(&self) -> Vec<String> {
        self.get_agent().name_agent().get_waits()
    }

    pub fn get_name(&self) -> String {
        self.get_agent().get_name()
    }

    pub fn summary(&self) -> Option<TaskSummary> {
        self.summarize()
    }
}

impl<R> ExecutorTaskHandle for TaskHandle<R> where R: 'static + Send {
    fn get_priority(&self) -> i8 { self.get_agent().get_config().get_priority() }

    fn run(&mut self, tick_index: u64) {
        let mut state = self.0.lock().unwrap();
        let agent = state.agent.clone();
        let mut r = None;
        let finished = agent.more(&mut state.future,tick_index,&mut r);
        if r.is_some() {
            state.result = r;
        }
        if finished {
            state.done = true;
        }
    }

    fn summarize(&self) -> Option<TaskSummary> {
        let state = self.0.lock().unwrap();
        if let Some(identity) = state.identity {
            Some(TaskSummary::new(identity,&state.agent.get_name(),&state.agent.name_agent().get_waits()))
        } else {
            None
        }
    }

    fn evict(&self) {
        self.get_agent().finish(KillReason::NotNeeded);
    }

    fn kill(&self, reason: KillReason) {
        self.get_agent().finish(reason);
    }

    fn set_identity(&self, identity: u64) {
        self.0.lock().unwrap().identity = Some(identity);
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::integration::testintegration::{ TestIntegration, tick_helper };
    use crate::task::runconfig::RunConfig;
    use crate::executor::executor::Executor;
    use crate::integration::reentering::ReenteringIntegration;
    use crate::executor::taskcontainer::TaskContainer;
    use crate::executor::action::{ Action, ActionLink };

    #[test]
    pub fn test_handle_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let ctx = x.new_agent(&cfg,"test");
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
        let mut t = TaskHandle::new(&tc,s1);
        /* simple accessors */
        assert_eq!(3,t.get_priority());
        /* simple running to completion */
        assert!(!tc.finish_agent().finishing());
        t.run(0);
        assert!(!tc.finish_agent().finishing());
        t.run(0);
        assert!(!tc.finish_agent().finishing());
        /* check for tick action in one of those two runs */
        let actions = eah.drain_actions();
        assert_eq!(3,actions.len());
        if let Action::Timer(_,_) = actions[0].1 {
        } else {
            assert!(false);
        }
        if let Action::BlockTask() = actions[1].1 {
        } else {
            assert!(false);
        }
    }
}