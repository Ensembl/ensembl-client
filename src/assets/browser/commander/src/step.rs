use std::sync::Arc;
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;

#[derive(Clone)] // XXX test only
pub enum StepState2<Y,E> {
    Again,
    Tick,
    Done(Result<Y,E>),
    Block
}

#[derive(Clone,PartialEq)]
pub enum KillReason { // XXX test it
    Timeout,
    Cancelled,
    NotNeeded
}

pub enum StepResult<Y,E> {
    Done(Result<Y,E>),
    Killed(KillReason)
}

pub trait StepRun<Y,E> {
    fn more(&mut self, signal: &mut StepControl) -> StepState2<Y,E>;
}

pub struct StepRunner<Y,E> {
    run: Box<dyn StepRun<Y,E>>,
    control: StepControl
}

impl<Y,E> StepRunner<Y,E> {
    pub(crate) fn new(run: Box<dyn StepRun<Y,E>>, task_control: &TaskControl) -> StepRunner<Y,E> {
        let step_control = StepControl::new(&task_control);
        StepRunner { run, control: step_control }
    }

    pub fn more(&mut self) -> StepState2<Y,E> {
        let tick = self.control.task_control().get_tick_index();
        if !self.control.check_tick(tick) {
            /* no, is waiting for next tick! */
            return StepState2::Tick;
        }
        let out = self.run.more(&mut self.control);
        match out {
            StepState2::Tick => {
                self.control.block_on_tick(tick);
            },
            _ => {}
        }
        out
    }
}

pub trait Step2<X,Y,Error=()> : Send {
    fn start(&mut self, input: &X, control: &mut TaskControl) -> Box<dyn StepRun<Y,Error>>;
    //fn drop(&mut self, _: &X, _: StepResult<Y,Error>) {} // XXX
}

#[derive(Clone)]
pub struct RunConfig {
    slot: Arc<Option<RunSlot>>,
    priority: i8,
    timeout: Option<f64>
}

pub struct RunSlot {}

impl RunConfig {
    pub fn new(slot: Option<RunSlot>, priority: i8, timeout: Option<f64>) -> RunConfig {
        RunConfig {
            slot: Arc::new(slot),
            priority,
            timeout
        }
    }

    pub fn get_slot(&self) -> &Option<RunSlot> { &self.slot }
    pub fn get_priority(&self) -> i8 { self.priority }
    pub fn get_timeout(&self) -> Option<f64> { self.timeout }
}

#[allow(unused)]
mod test {
    use super::*;

    #[test]
    pub fn test_runconfig() {
        let rc = RunConfig::new(None,-2,Some(10.));
        assert!(rc.get_slot().is_none());
        assert_eq!(-2,rc.get_priority());
        assert_eq!(Some(10.),rc.get_timeout());
    }
}
