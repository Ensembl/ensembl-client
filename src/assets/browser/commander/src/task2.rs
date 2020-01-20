use std::pin::Pin;
use std::future::Future;
use crate::taskcontext::TaskContext;
use crate::step::StepState2;
use crate::steprunner::StepRunner;
use crate::taskhandle::TaskHandle;

pub(crate) struct Task2Impl<R> {
    runner: StepRunner<R>,
    handle: TaskHandle<R>,
    task_context: TaskContext,
    name: String
}

pub(crate) trait Task2 {
    fn run(&mut self, tick_index: u64);
    fn get_priority(&self) -> i8;
    fn get_name(&self) -> String;
}

impl<R> Task2Impl<R> {
    pub(crate) fn new(future: Pin<Box<dyn Future<Output=R>+Send+Sync>>, task_context: &mut TaskContext, name: &str) -> Task2Impl<R> {
        let runner = StepRunner::new(future,task_context);
        Task2Impl {
            runner,
            handle: TaskHandle::new(task_context),
            task_context: task_context.clone(),
            name: name.to_string()
        }
    }

    pub(crate) fn get_handle(&self) -> &TaskHandle<R> {
        &self.handle
    }
}

impl<R> Task2 for Task2Impl<R> {
    fn get_priority(&self) -> i8 { self.task_context.get_config().get_priority() }
    fn get_name(&self) -> String { self.name.clone() }

    fn run(&mut self, tick_index: u64) {
        /* We use this racey is_finished method because we only really care about the 
         * single-threaded case (this method is non-rentrant). If a task completes with Done 
         * in a previous call (and this is the only call which handles this case), don't call 
         * execute again. Other terminations (via kill) are never guaranteed synchronous and
         * so one more call of the step may occur if the signal is delivered between
         * is_finished and the call to execute. But this is just an extension of the
         * inevitable asynchrony of a signal being delivered at the start of an execute call
         * as we are non pre-emptive.
         */
        if self.task_context.is_finished() { 
            return;
        }
        self.task_context.about_to_run(tick_index);
        match self.runner.more() {
            StepState2::Done(r) => {
                self.handle.done(r);
                self.task_context.finish_internal(None);
            },
            StepState2::Block(b) => {
                self.task_context.block_task(&b);
            },
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
        let mut tc = TaskContext::new(&cfg,&eah,&ReenteringIntegration::new(integration.clone()));
        tc.register(&h);
        let ctx = tc.clone();
        let s1 = Box::pin(async move {
            ctx.timer(1.).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
        });
        let mut tc2 = tc.clone();
        let mut t = Task2Impl::new(s1,&mut tc2,"test");
        /* simple accessors */
        assert_eq!("test",t.get_name());
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
    }
}
