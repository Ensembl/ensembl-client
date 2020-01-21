use std::pin::Pin;
use std::future::Future;
use crate::taskcontext::TaskContext;
use crate::taskhandle::TaskHandle;

/* The trait serves to scrub the task of its polymorphism from the PoV of the executor.
 * The whole struct exists only to encapsulate that polymorphism here by holding the
 * future and taskhandle: the heavy-lifting is all done in the TaskContext.
 */

pub(crate) struct TaskImpl<R> {
    future: Pin<Box<dyn Future<Output=R>>>,
    handle: TaskHandle<R>,
    task_context: TaskContext
}

pub(crate) trait Task {
    fn run(&mut self, tick_index: u64);
    fn get_priority(&self) -> i8;
}

impl<R> TaskImpl<R> {
    pub(crate) fn new(future: Pin<Box<dyn Future<Output=R>>>, task_context: &mut TaskContext) -> TaskImpl<R> {
        TaskImpl {
            future,
            handle: TaskHandle::new(task_context),
            task_context: task_context.clone()
        }
    }

    pub(crate) fn get_handle(&self) -> &TaskHandle<R> {
        &self.handle
    }
}

impl<R> Task for TaskImpl<R> {
    fn get_priority(&self) -> i8 { self.task_context.get_config().get_priority() }

    fn run(&mut self, tick_index: u64) {
        let ret = self.task_context.more(&mut self.future, tick_index);
        if let Some(r) = ret {
            self.handle.done(r);
        }
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
    use crate::integration::{ SleepQuantity, CommanderIntegration2, ReenteringIntegration };
    use crate::taskcontainer::TaskContainer;
    use crate::timer::TimerSet;
    use crate::step::RunConfig;
    use crate::oneshot::OneShot;
    use crate::testintegration::TestIntegration;

    #[test]
    pub fn test_task_smoke() {
        /* setup */
        let cfg = RunConfig::new(None,3,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let mut integration = TestIntegration::new();
        let mut tc = TaskContext::new(&cfg,&eah,&ReenteringIntegration::new(integration.clone()),"test");
        tc.register(&h);
        let ctx = tc.clone();
        let s1 = Box::pin(async move {
            ctx.timer(1.).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
        });
        let mut tc2 = tc.clone();
        let mut t = TaskImpl::new(s1,&mut tc2);
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
        if let ExecutorAction::Timer(_,_,_) = actions[0] {
        } else {
            assert!(false);
        }
        if let ExecutorAction::BlockTask(_,_) = actions[1] {
        } else {
            assert!(false);
        }
    }
}
