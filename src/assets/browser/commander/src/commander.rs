use std::future::Future;
use std::hash::Hash;
use std::marker::PhantomData;
use std::sync::{ Arc, Mutex };

pub enum StepResult<Y,E> {
    Sleep(f64),
    Ok(Y),
    Err(E),
    Timeout,
    Cancelled,
    NotNeeded
}

pub struct RunSlot {}

pub struct RunConfig {
}

impl RunConfig {
    pub fn new(slot: Option<RunSlot>, priority: i8, timeout: Option<f64>) -> RunConfig {
        RunConfig {
        }
    }
}

pub struct StepControl {
    config: RunConfig
}

impl StepControl {
    pub fn run_config(&self) -> &RunConfig { &self.config }
    pub fn get_remaining(&self) -> f64 { 0. }
    pub fn dropped(&self) -> bool { false }
    pub fn wake(&mut self) {}
}

pub trait Step<X,Y,Error=()> {
    fn execute(&mut self, input: X, signal: &mut StepControl) -> Result<Y,Error>;
    fn drop(&mut self, input: X, result: StepResult<Y,Error>) {}
}

impl<Y> Step<(),Y> for Future<Output=Y> {
    fn execute(&mut self, input: (), signal: &mut StepControl) -> Result<Y,()> {
        Err(())
    }
}

pub trait CommanderIntegration {
    fn enable_ticks(&mut self, cmdr: &mut Commander);
    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>);
}

pub struct CommanderShared {
}

impl CommanderShared {
    pub fn new() -> CommanderShared {
        CommanderShared {
        }
    }
}

#[derive(Clone)]
pub struct Commander {
    shared: Arc<Mutex<CommanderShared>>
}

impl PartialEq for Commander {
    fn eq(&self, other: &Self) -> bool {
        Arc::ptr_eq(&self.shared,&other.shared)
    }
}

impl Commander {
    pub fn new<T>(itgn: T) -> Commander where T: CommanderIntegration {
        Commander {
            shared: Arc::new(Mutex::new(CommanderShared::new()))
        }
    }

    pub fn new_slot(&mut self) -> RunSlot {
        RunSlot {}
    }

    pub fn add<T,X>(&mut self, step: T, input: X, run_config: RunConfig) where T: Step<X,()> {

    }

    pub fn tick(&mut self, slice: f64) {

    }
}
