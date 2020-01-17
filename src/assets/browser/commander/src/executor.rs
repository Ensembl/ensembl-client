use hashbrown::HashSet;
use ordered_float::OrderedFloat;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
use crate::taskcontainer::{ TaskContainer, TaskContainerHandle };
use crate::timer::TimerSet;
use crate::runnable::Runnable;
use crate::taskcontext::TaskContext;
use crate::step::{ KillReason, RunConfig, Step2 };
use crate::task2::Task2Impl;
use crate::taskhandle::TaskHandle;
use crate::block::Block;

pub struct Executor {
    integration: ReenteringIntegration,
    tasks: TaskContainer,
    runnable: Runnable,
    next_tick: HashSet<TaskContainerHandle>,
    actions: ExecutorActionHandle,
    timers: TimerSet<OrderedFloat<f64>,Option<TaskContainerHandle>>,
    ticks: TimerSet<u64,Block>,
    immediate: Vec<Block>,
    tick_index: u64,
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: CommanderIntegration2 + 'static {
        Executor {
            integration: ReenteringIntegration::new(integration),
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            next_tick: HashSet::new(),
            actions: ExecutorActionHandle::new(),
            timers: TimerSet::new(),
            ticks: TimerSet::new(),
            immediate: Vec::new(),
            tick_index: 0
        }
    }

    pub fn get_tick_index(&self) -> u64 { self.tick_index }

    // XXX only add from main thread (via action)
    pub fn add<S,X,R>(&mut self, step: S, input: X, run_config: &RunConfig, name: &str) -> TaskHandle<R> where S:Step2<X,Output=R> + 'static + Send, X: Send + 'static, R: 'static {
        let now = self.integration.current_time();
        let container_handle = self.tasks.allocate();
        let mut control = TaskContext::new(run_config,&mut self.actions,&container_handle,&self.integration);
        let task = Task2Impl::new(&mut (Box::new(step) as Box<dyn Step2<X,Output=R>>),input,run_config,&mut control,name);
        let handle = task.get_handle().clone();
        self.tasks.set(&container_handle,task);
        if let Some(timeout) = run_config.get_timeout() {
            let mut control = control.clone();
            self.timers.add(Some(container_handle.clone()),OrderedFloat(now+timeout),move || control.finish(Some(&KillReason::Timeout)));
        }
        self.runnable.add(&self.tasks,&container_handle);
        handle
    }

    fn remove(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.tasks.remove(handle);
    }

    fn add_timer(&mut self, handle: &TaskContainerHandle, timeout: f64, callback: Box<dyn FnMut() + Send + 'static>) {
        let now = self.integration.current_time();
        self.timers.add(Some(handle.clone()),OrderedFloat(now+timeout),callback);
    }

    pub(crate) fn run_actions(&mut self) {
        for mut action in self.actions.drain() {
            match action {
                ExecutorAction::Block(ref handle,ref mut blocker) => {
                    blocker.set_blocking_task(handle.clone());
                    self.runnable.remove(&self.tasks,&handle);
                },
                ExecutorAction::Unblock(ref mut blocker) => {
                    if let Some(ref handle) = blocker.unblock_steps() {
                        self.runnable.add(&self.tasks,handle);
                    }
                },
                ExecutorAction::Done(handle) => {
                    self.remove(&handle);
                },
                ExecutorAction::Kill(handle,_) => {
                    self.remove(&handle);
                },
                ExecutorAction::Timer(handle,timeout,callback) => {
                    self.add_timer(&handle,timeout,callback);
                },
                ExecutorAction::Tick(handle) => {
                    self.runnable.remove(&self.tasks,&handle);
                    self.next_tick.insert(handle);
                },
                ExecutorAction::UnblockOnTick(block,tick) => {
                    let block = block.clone();
                    if tick > self.tick_index {
                        self.ticks.add(block.clone(),tick,move || {
                            block.unblock();
                        });
                    } else {
                        print!("immediate push\n");
                        self.immediate.push(block);
                    }
                }
            }
        }
    }

    fn resurrect_tick_carryover(&mut self) {
        for handle in self.next_tick.drain() {
            self.runnable.add(&self.tasks,&handle);
        }
        self.ticks.check(self.tick_index);
    }

    fn resurrect_immediate(&mut self) {
        for block in self.immediate.drain(..) {
            print!("immediate pop\n");
            block.unblock();
        }
    }

    pub(crate) fn check_timers(&mut self,now: f64) {
        let (timers,tasks) = (&mut self.timers,&mut self.tasks);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        self.timers.check(OrderedFloat(now));
    }

    fn run(&mut self) -> bool {
        print!("run\n");
        let now = self.integration.current_time();
        self.check_timers(now);
        self.run_actions();
        let out = self.runnable.run(&mut self.tasks,self.tick_index);
        self.run_actions();
        self.resurrect_immediate();
        self.run_actions();
        out
    }

    fn calculate_sleep(&mut self, now: f64) -> SleepQuantity {
        if self.runnable.empty() && self.next_tick.len() == 0 {
            if let Some(timer) = self.timers.min() {
                SleepQuantity::Time(timer.0-now)
            } else {
                SleepQuantity::Forever
            }
        } else {
            SleepQuantity::None
        }
    }

    pub fn tick(&mut self, slice: f64) {
        print!("tick\n");
        self.integration.reentering();
        self.tick_index += 1;
        self.resurrect_tick_carryover();
        let mut now = self.integration.current_time();
        let expiry = now+slice;
        /* main tick loop */
        loop {
            if !self.run() { break; }
            now = self.integration.current_time();
            if now >= expiry { break; }
        }
        let (timers,tasks) = (&mut self.timers,&mut self.tasks);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        let sleep = self.calculate_sleep(now);
        self.integration.sleep(sleep);
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use std::sync::{ Arc, Mutex };
    use crate::step::{ KillReason, StepState2, OngoingState, TaskResult };
    use crate::integration::SleepQuantity;
    use crate::testintegration::{ TestStep, TestState, TestIntegration, TestExtract };
    use crate::steps::combinators::parallel::StepParallel;
    use crate::steps::future::FutureStep;
    use crate::steprunner::StepRun;

    #[test]
    pub fn test_executor_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Done(()),
        ]),&(),&cfg,"test");
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.run();
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.run();
        assert!(tc.get_context().is_finished());
        assert!(!x.run());
    }

    #[test]
    pub fn test_executor_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut step = integration.new_step(vec![TestState::Tick,TestState::Tick,TestState::Done(())]);
        let mut tc = x.add(step.clone(),&(),&cfg,"test");
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        step.forever_block();
        assert!(x.run());
        assert!(!x.run());
        assert!(tc.peek_result() == TaskResult::Ongoing);
        step.forever_unblock(&mut tc.get_context());
        x.tick(10.);
        assert_eq!(1,x.tasks.len());
        x.tick(10.);
        x.tick(10.);
        assert_eq!(0,x.tasks.len());
    }

    #[test]
    pub fn test_executor_doom() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(1.));
        let mut step = integration.new_step(vec![TestState::Tick,TestState::Tick,TestState::Done(())]);
        let mut tc = x.add(step,&(),&cfg,"test");
        integration.set_time(10.);
        x.run();
        assert!(tc.peek_result() == TaskResult::Killed(KillReason::Timeout));
    }

    #[test]
    pub fn test_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Done(())
        ]),&(),&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
    }

    #[test]
    pub fn test_again_timeout() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Done(())
        ]),&(),&cfg,"test");
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Done);
    }

    #[test]
    pub fn test_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(())
        ]),&(),&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);    
    }

    #[test]
    pub fn test_sleep_forever() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut tc = x.add(integration.new_step(vec![
            TestState::Tick,
            TestState::Block,
            TestState::Done(())
        ]),&(),&cfg,"test");
        let mut tc2 = x.add(integration.new_step(vec![
            TestState::Block,
            TestState::Done(())
        ]),&(),&cfg,"test2");
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(SleepQuantity::None == integration.get_sleeps().remove(0));
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(SleepQuantity::Forever == integration.get_sleeps().remove(0));
    }

    #[test]
    pub fn test_sleep_time() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(12.));

        let t1 : FutureStep<(),Result<(),()>> = FutureStep::new(|_,fc,()| Box::pin(async move {
            fc.timer(5.).await;
            Ok(())
        }));
        let t2 = FutureStep::new(|_,fc,()| Box::pin(async move {
            fc.timer(21.).await;
            Ok(())
        }));
        /* collect timers */
        let z = StepParallel::new(vec![Box::new(t1),Box::new(t2)]);
        /* drop success */
        let mut tc = x.add(z,(),&cfg,"test");
        x.tick(10.);
        integration.set_time(5.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(10.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(12.);
        x.tick(10.);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::Time(5.),
            SleepQuantity::None,
            SleepQuantity::Time(7.),
            SleepQuantity::Time(2.),
            SleepQuantity::Time(2.),
            SleepQuantity::None,
            SleepQuantity::Forever,
        ],*integration.get_sleeps());
    }

    #[test]
    pub fn test_timer_death() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(10.));
        let mut ts = integration.new_step(vec![
            TestState::Done(())
        ]);
        ts.block_for(100.);
        let mut tc = x.add(ts.clone(),&(),&cfg,"test");
        x.tick(10.); /* (Block) time_at_end = 1 => sleep 9 */
        ts.block_for(10.);
        integration.set_time(11.);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::Time(10.),
            SleepQuantity::None
        ],*integration.get_sleeps());
        x.tick(10.); /* (Done) => Expiry => Forever */
        assert_eq!(vec![
            SleepQuantity::Time(10.),
            SleepQuantity::None,
            SleepQuantity::Forever
        ],*integration.get_sleeps());

    }

    #[test]
    pub fn test_oneshot() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut step = integration.new_step(vec![
            TestState::Done(())
        ]);
        let mut tc = x.add(step.clone(),&(),&cfg,"test");
        step.forever_block();
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        x.tick(1.);
        step.forever_unblock(&mut tc.get_context());
        assert_eq!(vec![SleepQuantity::Forever,SleepQuantity::None],*integration.get_sleeps());
    }

    #[test]
    pub fn test_sleep_algorithm() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut step = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(())
        ]);
        let mut tc = x.add(step.clone(),&(),&cfg,"test");
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        step.forever_block();
        x.tick(1.); /* (StepState::Block) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Forever);
        /* runnable => None */
        step.forever_unblock(&mut tc.get_context());
        x.tick(1.); /* (StepState::Again) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* next tick => None */
        x.tick(1.); /* (StepState::Tick) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* timer => None */
        tc.get_context().add_timer(3.,|| {});
        step.forever_block();
        x.tick(1.); /* (StepState::Block) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Time(5.));
    }

    #[test]
    pub fn test_timeout_delta() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(5.)); /* time=0; SleepQuantity::Time(5.) */
        let mut ts = integration.new_step(vec![
            TestState::Block,
            TestState::Block,
            TestState::Done(())
        ]);
        let mut tc = x.add(ts.clone(),&(),&cfg,"test");
        /* simulate */
        x.tick(10.); /* (Block) time=1 on exit => task-timout=5 => delta = 4. ==>> SleepQuantity::Time(4.) */
        assert_eq!(1.,ts.get_time());
        tc.get_context().add_timer(2.,|| {});
        x.tick(10.); /* (Block) time=1 on entry and exit => +2  ==>> SleepQuantity::Time(2.) */
        assert_eq!(1.,ts.get_time());
        /* verify */
        assert_eq!(vec![SleepQuantity::Time(4.),SleepQuantity::Time(2.)],*integration.get_sleeps());
    }

    #[test]
    pub fn test_shorting_again_tick() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let a : FutureStep<_,Result<u64,()>> = FutureStep::new(|_,ctx,()| Box::pin(async move { 
            ctx.tick(4).await;
            Ok(ctx.get_tick_index())
        }));
        let mut b = FutureStep::new(|_,ctx,()| Box::pin(async move { 
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(1).await;
            Ok(ctx.get_tick_index())
        }));
        let p = StepParallel::new(vec![Box::new(a),Box::new(b)]);
        let tc = x.add(p,(),&cfg,"test");
        /* simulate */
        for i in 0..7 {
            x.tick(10.);
            integration.set_time(integration.get_time()+1.);
        }
        assert_eq!(Ok(vec![5,2]),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_shorting_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let a : FutureStep<_,Result<u64,()>> = FutureStep::new(|_,ctx,()| Box::pin(async move { 
            ctx.timer(8.).await;
            Ok(ctx.get_tick_index())
        }));
        let mut b : FutureStep<_,Result<u64,()>> = FutureStep::new(|_,ctx,()| Box::pin(async move { 
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(1).await;
            ctx.tick(0).await;
            ctx.tick(0).await;
            ctx.tick(1).await;
            ctx.tick(0).await;
            Ok(ctx.get_tick_index())
        }));
        let p = StepParallel::new(vec![Box::new(a),Box::new(b)]);
        let mut tc = x.add(p,(),&cfg,"test");
        /* simulate */
        x.tick(10.);
        x.tick(10.);
        integration.set_time(3.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(7.);
        x.tick(10.);
        integration.set_time(8.);
        x.tick(10.);
        integration.set_time(9.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        x.tick(10.);
        assert_eq!(Ok(vec![6,3]),tc.take_result().unwrap());
    }
}
