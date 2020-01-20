use std::sync::{ Arc, Mutex };
use std::future::Future;
use std::pin::Pin;
use crate::block::Block;
use crate::taskcontext::TaskContext;
use crate::step::StepState2;
use std::task::Poll;
use futures::task::{ ArcWake, Context, waker_ref };

struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

pub struct StepRunner {
    control: TaskContext,
    blocked_on: Option<Block>
}

impl StepRunner {
    pub(crate) fn new(task_control: &TaskContext) -> StepRunner {
        StepRunner {
            control: task_control.clone(),
            blocked_on: None
        }
    }

    fn get_blocker(&mut self) -> &Option<Block> { 
        if let Some(ref blocker) = self.blocked_on {
            if !blocker.step_blocked() {
                self.blocked_on = None;
            }
        }
        &self.blocked_on
    }

    pub fn more<R>(&mut self, future: &mut Pin<Box<dyn Future<Output=R>+Send+Sync>>) -> StepState2<R> {
        if let Some(b) = self.get_blocker() {
            return StepState2::Block(b.clone());
        }
        let block = self.control.block();
        let waker = Arc::new(StepWaker(Mutex::new(block.clone())));
        let out = match future.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker))) {
            Poll::Pending => StepState2::Block(block),
            Poll::Ready(v) => StepState2::Done(v)
        };
        match out {
            StepState2::Block(ref b) => {
                self.blocked_on = Some(b.clone());
            },
            _ => {}
        }
        out
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::step::RunConfig;
    use crate::taskcontainer::TaskContainer;
    use crate::executoraction::ExecutorActionHandle;
    use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
    use crate::timer::TimerSet;
    use crate::testintegration::TestIntegration;
    use crate::taskcontext::TaskContext;

    #[test]
    pub fn test_block() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = TaskContext::new(&cfg,&eah,&integration);
        tc.register(&h);
        let mut sc = StepRunner::new(&tc);
        assert!(sc.get_blocker().is_none());
        let mut b1 = tc.block();
        let mut b2 = tc.block();
        b1.add(&b2);
        sc.blocked_on = Some(b1.clone());
        assert!(sc.get_blocker().is_some());
        let b3 = sc.get_blocker().as_ref().unwrap().clone();
        b2.unblock_steps();
        assert!(sc.get_blocker().is_none());
    }
}