use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::CommanderIntegration2;
use crate::taskcontainer::{ TaskContainer, TaskHandle };
use crate::timer::TimerSet;
use crate::runnable::Runnable;
use crate::control::TaskControl;
use crate::step::{ KillReason, RunConfig, Step2 };
use crate::task2::Task2Impl;

pub struct Executor {
    integration: Box<dyn CommanderIntegration2>,
    tasks: TaskContainer,
    runnable: Runnable,
    actions: ExecutorActionHandle,
    timers: TimerSet
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: CommanderIntegration2 + 'static {
        Executor {
            integration: Box::new(integration),
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            actions: ExecutorActionHandle::new(),
            timers: TimerSet::new()
        }
    }

    pub fn add<S,X>(&mut self, step: S, input: X, run_config: &RunConfig, name: &str) -> TaskControl where S: Step2<X,(),()> + 'static + Send, X: Send + 'static {
        let now = self.integration.current_time();
        let handle = self.tasks.allocate();
        let control = TaskControl::new(run_config,&self.timers,&mut self.actions,&handle);
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

    pub(crate) fn run_actions(&mut self) {
        for action in self.actions.drain() {
            match action {
                ExecutorAction::Block(handle) => {
                    self.runnable.remove(&self.tasks,handle)
                },
                ExecutorAction::Unblock(handle) => {
                    self.runnable.add(&self.tasks,handle)
                },
                ExecutorAction::Done(handle) => {
                    self.remove(handle);
                },
                ExecutorAction::Kill(handle,_) => {
                    self.remove(handle);
                },
                ExecutorAction::Timer(timeout,callback) => {
                    self.timers.add(timeout,callback);
                }
            }
        }
    }

    pub(crate) fn check_timers(&mut self,now: f64) {
        self.timers.check(now);
    }

    // XXX when ticks turned off need to check timers
    pub fn run(&mut self, now: f64) -> bool {
        self.check_timers(now);
        self.run_actions();
        // XXX loop!
        let out = self.runnable.run(&mut self.tasks,now);
        self.run_actions();
        out
    }
}

#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use super::*;
    use crate::step::KillReason;
    use crate::step::StepState2;

    pub struct FakeIntegration(Arc<Mutex<f64>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { *self.0.lock().unwrap() }
    }

    struct FakeStep(i32);
    impl Step2<(),()> for FakeStep {
        fn execute(&mut self, input: &(), control: &mut TaskControl) -> StepState2<(),()> {
            if self.0 < 0 {
                self.0 += 1;
                return StepState2::Block;
            }
            self.0 += 1;
            if self.0 < 2 { StepState2::NotDone } else { StepState2::Done(Ok(())) }
        }
    }

    #[test]
    pub fn test_executor_smoke() {
        let integration = FakeIntegration(Arc::new(Mutex::new(0.)));
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,None);
        let tc = x.add(FakeStep(0),(),&cfg,"test");
        assert!(!tc.is_finished());
        x.run(0.);
        assert!(!tc.is_finished());
        x.run(1.);
        assert!(tc.is_finished());
        assert!(!x.run(2.));
    }

    #[test]
    pub fn test_executor_block() {
        let integration = FakeIntegration(Arc::new(Mutex::new(0.)));
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,None);
        let mut tc = x.add(FakeStep(-1),(),&cfg,"test");
        assert!(!tc.is_finished());
        assert!(x.run(0.));
        assert!(!x.run(1.));
        assert!(!tc.is_finished());
        tc.rerun_soon();
        assert!(x.run(2.));
        assert_eq!(1,x.tasks.len());
        assert!(x.run(3.));
        assert!(!x.run(4.));
        assert_eq!(0,x.tasks.len());
    }

    #[test]
    pub fn test_executor_doom() {
        let integration = FakeIntegration(Arc::new(Mutex::new(0.)));
        let mut x = Executor::new(integration);
        let cfg = RunConfig::new(None,3,Some(1.));
        let mut tc = x.add(FakeStep(0),(),&cfg,"test");
        x.run(10.);
        assert!(tc.is_finished());
        assert!(tc.kill_reason() == Some(KillReason::Timeout));
    }
}
