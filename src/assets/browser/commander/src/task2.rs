use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRefMut;
use crate::commander::{ RunConfig, StepResult, KillReason };
use crate::executor::{ ExecutorAction, ExecutorActionHandle };
use crate::blockbooker::{ BlockBooker, BlockBooking };
use crate::taskcontainer::TaskHandle;
use crate::timer::TimerSet;

pub enum StepState2<Y,E> {
    NotDone,
    Done(Result<Y,E>),
    //Wait(f64),
}


pub trait Step2<X,Y,Error=()> : Send {
    fn execute(&mut self, input: &X, signal: &mut TaskControl) -> StepState2<Y,Error>;
    fn drop(&mut self, _: &X, _: StepResult<Y,Error>) {}
}

#[derive(Clone)]
pub struct TaskControl {
    config: RunConfig,
    killed: bool,
    block_booker: BlockBooker,
    task_handle: TaskHandle,
    action_handle: ExecutorActionHandle,
    timers: Arc<Mutex<TimerSet>>
}

impl TaskControl {
    pub fn new(config: &RunConfig, action_handle: &ExecutorActionHandle, task_handle: &TaskHandle) -> TaskControl {
        let action_handle = action_handle.clone();
        let mut action_handle2 = action_handle.clone();
        let task_handle = *task_handle;
        TaskControl {
            config: config.clone(),
            killed: false,
            block_booker: BlockBooker::new(move |block| {
                if block {
                    action_handle2.add(ExecutorAction::Block(task_handle));
                } else {
                    action_handle2.add(ExecutorAction::Unblock(task_handle));
                }
            }),
            task_handle, action_handle,
            timers: Arc::new(Mutex::new(TimerSet::new()))
        }
    }

    pub fn kill(&mut self, reason: &KillReason) {
        if !self.killed {
            self.action_handle.add(ExecutorAction::Kill(self.task_handle,reason.clone()));
            self.killed = true;
        }
    }

    pub fn is_killed(&self) -> bool { self.killed }
    pub fn run_config(&self) -> &RunConfig { &self.config }
    pub fn get_remaining(&self) -> f64 { 0. }
    pub fn dropped(&self) -> bool { false }
    pub fn block(&mut self) -> BlockBooking { self.block_booker.block() }
    pub fn timers(&mut self) -> MutexGuardRefMut<TimerSet> { 
        MutexGuardRefMut::new(self.timers.lock().unwrap())
    }
}

pub struct Task2Impl<X> {
    step: Box<dyn Step2<X,(),()>>,
    input: X,
    run_config: RunConfig,
    name: String,
    control: TaskControl
}

pub trait Task2 {
    fn run(&mut self) -> StepState2<(),()>;
    fn get_priority(&self) -> i8;
    fn get_name(&self) -> &str;
}

impl<X> Task2Impl<X> {
    pub fn new<S>(step: S, input: X, run_config:&RunConfig, control: TaskControl, name: &str) -> Task2Impl<X> where S: Step2<X,(),()> + 'static + Send, X: Send {
        Task2Impl {
            step: Box::new(step),
            input, control,
            run_config: run_config.clone(),
            name: name.to_string()
        }
    }
}

impl<X> Task2 for Task2Impl<X> where X: Send {
    fn get_priority(&self) -> i8 { self.run_config.get_priority() }
    fn get_name(&self) -> &str { &self.name }

    fn run(&mut self) -> StepState2<(),()> {
        self.step.execute(&self.input,&mut self.control)
    }
}
