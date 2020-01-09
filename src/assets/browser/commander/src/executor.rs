// YYY unit-test oneshots and sleeps.

use hashbrown::HashSet;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::{ CommanderIntegration2, IntegrationWrapper, SleepQuantity };
use crate::taskcontainer::{ TaskContainer, TaskHandle };
use crate::timer::TimerSet;
use crate::runnable::Runnable;
use crate::control::TaskControl;
use crate::step::{ KillReason, RunConfig, Step2 };
use crate::task2::Task2Impl;

pub struct Executor {
    integration: IntegrationWrapper,
    tasks: TaskContainer,
    runnable: Runnable,
    next_tick: HashSet<TaskHandle>,
    actions: ExecutorActionHandle,
    timers: TimerSet
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: CommanderIntegration2 + 'static {
        Executor {
            integration: IntegrationWrapper::new(integration),
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            next_tick: HashSet::new(),
            actions: ExecutorActionHandle::new(),
            timers: TimerSet::new()
        }
    }

    pub fn add<S,X>(&mut self, step: S, input: X, run_config: &RunConfig, name: &str) -> TaskControl where S: Step2<X,(),()> + 'static + Send, X: Send + 'static {
        let now = self.integration.current_time();
        let handle = self.tasks.allocate();
        let control = TaskControl::new(run_config,&self.timers,&mut self.actions,&handle,&self.integration);
        let task = Task2Impl::new(step,input,run_config,control.clone(),name);
        self.tasks.set(handle,task);
        if let Some(timeout) = run_config.get_timeout() {
            let mut control = control.clone();
            self.timers.add(now+timeout,move || control.finish(Some(&KillReason::Timeout)));
        }
        self.runnable.add(&self.tasks,handle);
        control
    }

    fn remove(&mut self, handle: TaskHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.tasks.remove(handle);
    }

    fn add_timer(&mut self, timeout: f64, callback: Box<dyn FnMut()>) {
        self.timers.add(timeout,callback);
    }

    pub(crate) fn run_actions(&mut self) {
        for action in self.actions.drain() {
            match action {
                ExecutorAction::Block(handle) => {
                    self.runnable.remove(&self.tasks,handle);
                },
                ExecutorAction::Unblock(handle) => {
                    self.runnable.add(&self.tasks,handle);
                },
                ExecutorAction::Done(handle) => {
                    self.remove(handle);
                },
                ExecutorAction::Kill(handle,_) => {
                    self.remove(handle);
                },
                ExecutorAction::Timer(timeout,callback) => {
                    self.add_timer(timeout,callback);
                },
                ExecutorAction::Tick(handle) => {
                    self.runnable.remove(&self.tasks,handle);
                    self.next_tick.insert(handle);
                }
            }
        }
    }

    fn resurrect(&mut self) {
        for handle in self.next_tick.drain() {
            self.runnable.add(&self.tasks,handle);
        }
    }

    pub(crate) fn check_timers(&mut self,now: f64) {
        self.timers.check(now);
    }

    fn run(&mut self) -> bool {
        let now = self.integration.current_time();
        self.check_timers(now);
        self.run_actions();
        let out = self.runnable.run(&mut self.tasks,now);
        self.run_actions();
        out
    }

    fn calculate_sleep(&self) -> SleepQuantity {
        if self.runnable.empty() && self.next_tick.len() == 0 {
            if let Some(timer) = self.timers.min() {
                SleepQuantity::Time(timer)
            } else {
                SleepQuantity::Forever
            }
        } else {
            SleepQuantity::None
        }
    }

    pub fn tick(&mut self, slice: f64) {
        self.integration.reset_one_shot();
        self.resurrect();
        let mut now = self.integration.current_time();
        let expiry = now+slice;
        /* main tick loop */
        loop {
            if !self.run() { break; }
            now = self.integration.current_time();
            if now >= expiry { break; }
        }
        self.integration.sleep(self.calculate_sleep());
    }
}

#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use super::*;
    use crate::step::KillReason;
    use crate::step::StepState2;
    use crate::integration::SleepQuantity;

    pub struct FakeIntegration(Arc<Mutex<(f64,Option<SleepQuantity>)>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { self.0.lock().unwrap().0 }
        fn sleep(&mut self, quantity: SleepQuantity) { self.0.lock().unwrap().1 = Some(quantity); }
    }

    struct FakeStep(i32);
    impl Step2<(),()> for FakeStep {
        fn execute(&mut self, input: &(), control: &mut TaskControl) -> StepState2<(),()> {
            if self.0 < 0 {
                self.0 += 1;
                return StepState2::Block;
            }
            self.0 += 1;
            if self.0 < 2 { StepState2::Again } else { StepState2::Done(Ok(())) }
        }
    }

    #[test]
    pub fn test_executor_smoke() {
        let integration = FakeIntegration(Arc::new(Mutex::new((0.,None))));
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,None);
        let tc = x.add(FakeStep(0),(),&cfg,"test");
        assert!(!tc.is_finished());
        x.run();
        assert!(!tc.is_finished());
        x.run();
        assert!(tc.is_finished());
        assert!(!x.run());
    }

    #[test]
    pub fn test_executor_block() {
        let integration = FakeIntegration(Arc::new(Mutex::new((0.,None))));
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,None);
        let mut tc = x.add(FakeStep(-1),(),&cfg,"test");
        assert!(!tc.is_finished());
        assert!(x.run());
        assert!(!x.run());
        assert!(!tc.is_finished());
        tc.rerun_soon();
        assert!(x.run());
        assert_eq!(1,x.tasks.len());
        assert!(x.run());
        assert!(!x.run());
        assert_eq!(0,x.tasks.len());
    }

    #[test]
    pub fn test_executor_doom() {
        let now = Arc::new(Mutex::new((0.,None)));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,Some(1.));
        let mut tc = x.add(FakeStep(0),(),&cfg,"test");
        now.lock().unwrap().0 = 10.;
        x.run();
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == Some(KillReason::Timeout));
    }

    // XXX replace fakestep
    struct FakeStep2(Vec<StepState2<(),()>>,Arc<Mutex<(f64,Option<SleepQuantity>)>>);
    impl Step2<(),()> for FakeStep2 {
        fn execute(&mut self, input: &(), control: &mut TaskControl) -> StepState2<(),()> {
            self.1.lock().unwrap().0 += 1.;
            if self.0.len() > 0 {
                self.0.remove(0)
            } else {
                StepState2::Done(Ok(()))
            }
        }
    }

    #[test]
    pub fn test_again() {
        let now = Arc::new(Mutex::new((0.,None)));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(FakeStep2(vec![StepState2::Again,StepState2::Again,StepState2::Again],now.clone()),(),&cfg,"test");
        x.tick(10.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == None);    
    }

    #[test]
    pub fn test_again_timeout() {
        let now = Arc::new(Mutex::new((0.,None)));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(FakeStep2(vec![StepState2::Again,StepState2::Again,StepState2::Again],now.clone()),(),&cfg,"test");
        x.tick(2.);
        assert!(!tc.is_finished());
        x.tick(2.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == None);    
    }

    #[test]
    pub fn test_tick() {
        let now = Arc::new(Mutex::new((0.,None)));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,Some(20.));
        let mut tc = x.add(FakeStep2(vec![StepState2::Tick,StepState2::Tick,StepState2::Tick],now.clone()),(),&cfg,"test");
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
        let now = Arc::new(Mutex::new((0.,None)));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,None);
        let mut tc = x.add(FakeStep2(vec![StepState2::Tick,StepState2::Block,StepState2::Done(Ok(()))],now.clone()),(),&cfg,"test");
        let mut tc2 = x.add(FakeStep2(vec![StepState2::Block,StepState2::Done(Ok(()))],now.clone()),(),&cfg,"test2");
        x.tick(2.);
        assert!(!tc.is_finished());
        assert!(Some(SleepQuantity::None) == now.lock().unwrap().1);
        x.tick(2.);
        assert!(!tc.is_finished());
        assert!(Some(SleepQuantity::Forever) == now.lock().unwrap().1);
        tc.rerun_soon();
        tc2.rerun_soon();
    }
}
