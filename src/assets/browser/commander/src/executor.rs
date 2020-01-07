use std::sync::{ Arc, Mutex };
use crate::commander::{ RunConfig, KillReason, CommanderIntegration };
use crate::taskcontainer::{ TaskContainer, TaskHandle };
use crate::runnable::Runnable;
use crate::task2::{ Task2, Step2, TaskControl, Task2Impl };
use crate::taskdoomer::TaskDoomer;

pub enum ExecutorAction {
    Block(TaskHandle),
    Unblock(TaskHandle),
    Kill(TaskHandle,KillReason)
}

#[derive(Clone)]
pub struct ExecutorActionHandle(Arc<Mutex<Option<Vec<ExecutorAction>>>>);

impl ExecutorActionHandle {
    pub fn new() -> ExecutorActionHandle {
        ExecutorActionHandle(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub fn add(&mut self, action: ExecutorAction) {
        self.0.lock().unwrap().as_mut().unwrap().push(action);
    }

    pub fn drain(&mut self) -> Vec<ExecutorAction> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }
}

pub struct Executor {
    integration: Box<dyn CommanderIntegration>,
    tasks: TaskContainer,
    runnable: Runnable,
    actions: ExecutorActionHandle,
    doomer: TaskDoomer
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: CommanderIntegration + 'static {
        Executor {
            integration: Box::new(integration),
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            actions: ExecutorActionHandle::new(),
            doomer: TaskDoomer::new()
        }
    }

    pub fn add<S,X>(&mut self, step: S, input: X, timeout: Option<f64>, run_config: &RunConfig, name: &str) -> TaskControl where S: Step2<X,(),()> + 'static + Send, X: Send + 'static {
        let now = self.integration.current_time();
        let handle = self.tasks.allocate();
        let control = TaskControl::new(run_config,&mut self.actions,&handle);
        let task = Task2Impl::new(step,input,run_config,control.clone(),name);
        self.tasks.set(&handle,task);
        if let Some(timeout) = timeout {
            self.doomer.add(&control,now+timeout);
        }
        self.runnable.add(&self.tasks,&handle);
        control
    }

    fn run_actions(&mut self) {
        for action in self.actions.drain() {
            match action {
                ExecutorAction::Block(handle) => {
                    self.runnable.remove(&self.tasks,&handle)
                },
                ExecutorAction::Unblock(handle) => {
                    self.runnable.add(&self.tasks,&handle)
                },
                ExecutorAction::Kill(handle,reason) => {
                    self.runnable.remove(&self.tasks,&handle)
                }
            }
        }
    }

    pub fn tick(&mut self) -> bool {
        self.run_actions();
        let out = self.runnable.run(&mut self.tasks);
        self.run_actions();
        out
    }
}