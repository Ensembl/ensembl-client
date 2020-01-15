use hashbrown::HashSet;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
use crate::taskcontainer::{ TaskContainer, TaskHandle };
use crate::timer::TimerSet;
use crate::runnable::Runnable;
use crate::taskcontrol::TaskControl;
use crate::step::{ KillReason, RunConfig, Step2 };
use crate::task2::Task2Impl;

pub struct Executor {
    integration: ReenteringIntegration,
    tasks: TaskContainer,
    runnable: Runnable,
    next_tick: HashSet<TaskHandle>,
    actions: ExecutorActionHandle,
    timers: TimerSet,
    tick_index: u64
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
            tick_index: 0
        }
    }

    pub fn get_tick_index(&self) -> u64 { self.tick_index }

    // XXX only add from main thread (via action)
    pub fn add<S,X>(&mut self, step: S, input: X, run_config: &RunConfig, name: &str) -> TaskControl where S:Step2<X,Output=()> + 'static + Send, X: Send + 'static {
        let now = self.integration.current_time();
        let handle = self.tasks.allocate();
        let mut control = TaskControl::new(run_config,&mut self.actions,&handle,&self.integration);
        let task = Task2Impl::new(&mut (Box::new(step) as Box<dyn Step2<X,Output=()>>),input,run_config,&mut control,name);
        self.tasks.set(&handle,task);
        if let Some(timeout) = run_config.get_timeout() {
            let mut control = control.clone();
            self.timers.add(Some(&handle),now+timeout,move || control.finish(Some(&KillReason::Timeout)));
        }
        self.runnable.add(&self.tasks,&handle);
        control
    }

    fn remove(&mut self, handle: &TaskHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.tasks.remove(handle);
    }

    fn add_timer(&mut self, handle: &TaskHandle, timeout: f64, callback: Box<dyn FnMut() + Send + 'static>) {
        let now = self.integration.current_time();
        self.timers.add(Some(handle),now+timeout,callback);
    }

    pub(crate) fn run_actions(&mut self) {
        for mut action in self.actions.drain() {
            match action {
                ExecutorAction::Block(ref handle,ref mut blocker) => {
                    blocker.set_blocking_task(Some(handle.clone()));
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
                }
            }
        }
    }

    fn resurrect_tick_carryover(&mut self) {
        for handle in self.next_tick.drain() {
            self.runnable.add(&self.tasks,&handle);
        }
    }

    pub(crate) fn check_timers(&mut self,now: f64) {
        self.timers.tidy_handles(&self.tasks);
        self.timers.check(now);
    }

    fn run(&mut self) -> bool {
        let now = self.integration.current_time();
        self.check_timers(now);
        self.run_actions();
        let out = self.runnable.run(&mut self.tasks,self.tick_index);
        self.run_actions();
        out
    }

    fn calculate_sleep(&mut self, now: f64) -> SleepQuantity {
        if self.runnable.empty() && self.next_tick.len() == 0 {
            if let Some(timer) = self.timers.min() {
                SleepQuantity::Time(timer-now)
            } else {
                SleepQuantity::Forever
            }
        } else {
            SleepQuantity::None
        }
    }

    pub fn tick(&mut self, slice: f64) {
        self.integration.reentering();
        self.resurrect_tick_carryover();
        let mut now = self.integration.current_time();
        let expiry = now+slice;
        self.tick_index += 1;
        /* main tick loop */
        loop {
            if !self.run() { break; }
            now = self.integration.current_time();
            if now >= expiry { break; }
        }
        self.timers.tidy_handles(&self.tasks);
        let sleep = self.calculate_sleep(now);
        self.integration.sleep(sleep);
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use std::sync::{ Arc, Mutex };
    use crate::step::{ KillReason, StepState2, OngoingState };
    use crate::integration::SleepQuantity;
    use crate::testintegration::{ TestStep, TestState, TestIntegration, TestExtract };
    use crate::steps::combinators::sequence::StepSequence2;
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;
    use crate::steps::combinators::parallel::StepParallel;
    use crate::steps::timeout::TimeoutStep2;
    use crate::steps::noop::BlindStep;
    use crate::steps::combinators::branch::StepBranch;
    use crate::steprunner::StepRun;

    #[test]
    pub fn test_executor_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Done(()),
        ]),&(),&cfg,"test");
        assert!(!tc.is_finished());
        x.run();
        assert!(!tc.is_finished());
        x.run();
        assert!(tc.is_finished());
        assert!(!x.run());
    }

    #[test]
    pub fn test_executor_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut step = integration.new_step(vec![TestState::Tick,TestState::Tick,TestState::Done(())]);
        let mut tc = x.add(step.clone(),&(),&cfg,"test");
        assert!(!tc.is_finished());
        step.forever_block();
        assert!(x.run());
        assert!(!x.run());
        assert!(!tc.is_finished());
        step.forever_unblock(&mut tc);
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
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == Some(KillReason::Timeout));
    }

    #[test]
    pub fn test_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again
        ]),&(),&cfg,"test");
        x.tick(10.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == None);    
    }

    #[test]
    pub fn test_again_timeout() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again
        ]),&(),&cfg,"test");
        x.tick(2.);
        assert!(!tc.is_finished());
        x.tick(2.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == None);    
    }

    #[test]
    pub fn test_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick
        ]),&(),&cfg,"test");
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == None);
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
        assert!(!tc.is_finished());
        assert!(SleepQuantity::None == integration.get_sleeps().remove(0));
        x.tick(2.);
        assert!(!tc.is_finished());
        assert!(SleepQuantity::Forever == integration.get_sleeps().remove(0));
    }

    #[test]
    pub fn test_sleep_time() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(12.));

        let t1 : TimeoutStep2<(),()> = TimeoutStep2::new(5.,|| {});
        let t2 : TimeoutStep2<(),()> = TimeoutStep2::new(21.,|| {});

        let t1 : StepSequenceSimple<(),(),Result<(),()>> = StepSequenceSimple::new(t1,BlindStep::new(Ok(())));
        let t2 : StepSequenceSimple<(),(),Result<(),()>> = StepSequenceSimple::new(t2,BlindStep::new(Ok(())));

        /* collect timers */

        let z = StepParallel::new(vec![Box::new(t1),Box::new(t2)]);
        /* drop success */
        let z = StepBranch::new(z,BlindStep::new(()),BlindStep::new(()));
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
        step.forever_unblock(&mut tc);
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
        print!("STARTING UNBOLCK\n");
        step.forever_unblock(&mut tc);
        x.tick(1.); /* (StepState::Again) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* next tick => None */
        x.tick(1.); /* (StepState::Tick) */
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* timer => None */
        tc.add_timer(3.,|| {});
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
        tc.add_timer(2.,|| {});
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
        let mut a : TestStep<Result<(),()>> = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(Ok(()))
        ]);
        let mut b : TestStep<Result<(),()>> = integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Done(Ok(()))
        ]);
        a.no_auto();
        b.no_auto();
        let p = StepSequenceSimple::new(StepParallel::new(vec![Box::new(a.clone()),Box::new(b.clone())]),BlindStep::new(()));
        x.add(p,&(),&cfg,"test");
        /* simulate */
        for i in 0..7 {
            x.tick(10.);
            integration.set_time(integration.get_time()+1.);
        }
        assert_eq!(4.,a.finish_time());
        assert_eq!(1.,b.finish_time());
    }

    #[test]
    pub fn test_shorting_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let a : TimeoutStep2<(),()> = TimeoutStep2::new(8.,|| ());
        let mut b : TestStep<Result<(),()>> = integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Again,
            TestState::Done(Ok(()))
        ]);
        let a = StepSequenceSimple::new(a,BlindStep::new(Ok(())));
        let p = StepParallel::new(vec![Box::new(a.clone()),Box::new(b.clone())]);
        let p = StepSequenceSimple::new(p,BlindStep::new(()));
        b.no_auto();
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
        assert!(tc.is_finished());
        x.tick(10.);
        assert_eq!(3.,b.finish_time());
    }
}
