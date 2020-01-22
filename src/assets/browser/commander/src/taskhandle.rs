use std::sync::{ Arc, Mutex };
use owning_ref::{ MutexGuardRef, MutexGuardRefMut };
use crate::agent::Agent;

#[derive(Clone,PartialEq,Eq)]
pub enum KillReason { // XXX test it
    Timeout,
    Cancelled,
    NotNeeded
}

#[derive(Clone,PartialEq,Eq)]
pub enum TaskResult {
    Ongoing,
    Done,
    Killed(KillReason)
}

pub struct TaskHandleState<R> {
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
    pub(crate) fn new(agent: &Agent) -> TaskHandle<R> {
        TaskHandle(Arc::new(Mutex::new(TaskHandleState{
            agent: agent.clone(),
            result: None,
            done: false
        })))
    }

    pub(crate) fn get_agent(&self) -> MutexGuardRef<TaskHandleState<R>,Agent> {
        MutexGuardRef::new(self.0.lock().unwrap()).map(|x| &x.agent)
    }

    pub(crate) fn done(&mut self, result: R) {
        let mut state = self.0.lock().unwrap();
        state.result = Some(result);
        state.done = true;
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

    pub fn take_result(&self) -> Option<R> {
        self.0.lock().unwrap().result.take()
    }

    pub fn get_result(&self) -> Option<MutexGuardRef<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.result.is_some() {
            Some(MutexGuardRef::new(state).map(|x| x.result.as_ref().unwrap()))
        } else {
            None
        }
    }

    pub fn get_result_mut(&self) -> Option<MutexGuardRefMut<TaskHandleState<R>,R>> {
        let state = self.0.lock().unwrap();
        if state.result.is_some() {
            Some(MutexGuardRefMut::new(state).map_mut(|x| x.result.as_mut().unwrap()))
        } else {
            None
        }
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::testintegration::{ TestIntegration, tick_helper };
    use crate::step::RunConfig;
    use crate::executor::Executor;

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
}