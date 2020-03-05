use owning_ref::MutexGuardRef;
use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };
use crate::agent::agent::Agent;
use crate::corefutures::promisefuture::PromiseFuture;
use super::task::{ KillReason, TaskResult, TaskSummary };

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

pub(crate) struct TaskHandleState<R: 'static> {
    finish_flag: PromiseFuture<()>,
    identity: Option<u64>,
    future: Pin<Box<dyn Future<Output=R> + 'static>>,
    agent: Agent,
    result: Option<R>,
    done: bool
}

/// The handle on a submitted task from an executor.
/// 
/// In most simple cases an invoker will not care about the taskhandle and need not keep it.
pub struct TaskHandle<R: 'static>(Arc<Mutex<TaskHandleState<R>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<R> Clone for TaskHandle<R> where R: 'static {
    fn clone(&self) -> Self {
        TaskHandle(self.0.clone())
    }
}

impl<R> TaskHandle<R> where R: 'static {
    pub(crate) fn new(agent: &Agent, future: Pin<Box<dyn Future<Output=R> + 'static>>) -> TaskHandle<R> {
        TaskHandle(Arc::new(Mutex::new(TaskHandleState {
            finish_flag: PromiseFuture::new(),
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

    /// Returns a future which will be ready when the task is complete.
    pub fn finish_future(&self) -> impl Future<Output=()> {
        self.0.lock().unwrap().finish_flag.clone()
    }

    /// Examines the current status of this task.
    pub fn task_state(&self) -> TaskResult {
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

    /// Removes the task result for use elsewhere.
    /// 
    /// Note that future calls after a successful return will return `None`, as will Ongoing or Killed tasks. 
    /// We don't want to have to insist on a Result being clone, nor handle long-lived references to our internal,
    /// mutexed state object which a caller might forget to release. See `task_state()` for task status.
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

    /// List all currently runing named waits.
    pub fn get_waits(&self) -> Vec<String> {
        self.get_agent().name_agent().get_waits()
    }

    /// Get current task name.
    pub fn get_name(&self) -> String {
        self.get_agent().get_name()
    }

    /// Return TaskSummary for this running task, if any.
    /// 
    /// Maybe `None` if not yet running, complete, etc.
    pub fn summary(&self) -> Option<TaskSummary> {
        self.summarize()
    }

    #[allow(unused)]
    fn task_key(&self) -> String {
        format!("commander-run-{}",self.summary().map(|x| x.get_name().to_string()).unwrap_or("".to_string()))
    }
}

impl<R> ExecutorTaskHandle for TaskHandle<R> where R: 'static {
    fn get_priority(&self) -> i8 { self.get_agent().get_config().get_priority() }

    fn run(&mut self, tick_index: u64) {
        blackbox_start!("commander",&self.task_key(),"");
        let mut state = self.0.lock().unwrap();
        let agent = state.agent.clone();
        let mut r = None;
        let finished = agent.more(&mut state.future,tick_index,&mut r);
        if r.is_some() {
            state.result = r;
        }
        if finished {
            state.done = true;
            state.finish_flag.satisfy(());
        }
        drop(state);
        blackbox_end!("commander",&self.task_key(),"");
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
mod test {
    use crate::executor::action::Action;
    use crate::executor::request::Request;
    use crate::executor::executor::Executor;
    use crate::executor::link::Link;
    use crate::executor::taskcontainer::TaskContainer;
    use crate::integration::reentering::ReenteringIntegration;
    use crate::integration::testintegration::{ TestIntegration, tick_helper };
    use crate::task::runconfig::RunConfig;
    use super::*;

    #[test]
    pub fn test_handle_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let a = async move {
            tick_helper(ctx2,&[0,0,0]).await;
            42
        };
        let tc = x.add(a,ctx);
        assert!(tc.task_state() == TaskResult::Ongoing);
        assert!(tc.take_result().is_none());
        assert!(tc.get_result().is_none());
        assert!(tc.get_result_mut().is_none());
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert_eq!(Some(42),tc.get_result().map(|x| *x));
        assert_eq!(Some(42),tc.get_result_mut().map(|x| *x));
        assert_eq!(Some(42),tc.take_result());
        assert!(tc.get_result().is_none());
        assert!(tc.get_result_mut().is_none());
        assert!(tc.task_state() == TaskResult::Done);
    }

    #[test]
    pub fn test_task_smoke() {
        /* setup */
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = Link::new();
        let integration = TestIntegration::new();
        let mut cq = Link::new();
        let tc = Agent::new(&cfg,&eah,&cq,&ReenteringIntegration::new(integration.clone()),"test");
        tc.run_agent().register(&h);
        let ctx = tc.clone();
        let s1 = Box::pin(async move {
            ctx.timer(1.).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
        });
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
        let actions = cq.drain();
        assert_eq!(1,actions.len());
        if let Request::Timer(_,_) = actions[0].1 {
        } else {
            assert!(false);
        }
        let actions = eah.drain();
        assert_eq!(2,actions.len());
        if let Action::BlockTask() = actions[0].1 {
        } else {
            assert!(false);
        }
    }

    #[test]
    pub fn test_handle_finish() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test-task");
        let agent2 = agent.clone();
        let step = async move {
            let agentb = agent2.new_agent(None,"task2");
            let agentb2 = agentb.clone();
            let th = agent2.add(async move {
                agentb2.tick(4).await;
            },agentb);
            th.finish_future().await;
        };
        let h = x.add(step,agent);
        for i in 0..10 {
            x.tick(1.);
            let cmp = if i<4 { TaskResult::Ongoing } else { TaskResult::Done };
            assert_eq!(cmp,h.task_state());
        }
    }
}