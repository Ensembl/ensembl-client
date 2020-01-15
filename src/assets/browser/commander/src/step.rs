use std::sync::Arc;
use crate::block::Block;
use crate::taskcontrol::TaskControl;
use crate::steprunner::StepRun;

#[derive(Clone)] // XXX test only
pub enum OngoingState {
    Again,
    Tick,
    Block(Block),
    Dead
}

#[derive(Clone)] // XXX test only
pub enum StepState2<R> {
    Ongoing(OngoingState),
    Done(R),
}

impl OngoingState {
    pub(crate) fn priority(&self) -> u8 {
        match self {
            OngoingState::Again => 0,
            OngoingState::Tick => 1,
            OngoingState::Block(_) => 2,
            OngoingState::Dead => 3
        }
    }

    pub(crate) fn merge(&mut self, stepcontrol: &mut TaskControl, other: &OngoingState) {
        if let OngoingState::Block(in_b) = other {
            if let OngoingState::Dead = self {
                *self = OngoingState::Block(stepcontrol.block());
            }
            if let OngoingState::Block(our_b) = self {
                our_b.add(in_b);
            }
        } else {
            if other.priority() < self.priority() {
                *self = other.clone();
            }
        }
    }
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

pub trait Step2<Input> : Send {
    type Output;

    fn start(&mut self, input: Input, control: &mut TaskControl) -> Box<dyn StepRun<Output=Self::Output>>;
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
