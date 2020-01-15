use crate::block::Block;
use crate::taskcontrol::TaskControl;
use crate::step::{ StepState2, OngoingState };

pub trait StepRun<Y,E> {
    fn more(&mut self, control: &mut TaskControl) -> StepState2<Y,E>;
}

pub struct StepRunner<Y,E> {
    run: Box<dyn StepRun<Y,E>>,
    control: TaskControl,
    blocked_on: Option<Block>,
    blocked_on_tick: Option<u64>,
    is_dead: bool
 
}

impl<Y,E> StepRunner<Y,E> {
    pub(crate) fn new(run: Box<dyn StepRun<Y,E>>, task_control: &TaskControl) -> StepRunner<Y,E> {
        StepRunner {
            run,
            control: task_control.clone(),
            blocked_on_tick: None,
            blocked_on: None,
            is_dead: false
        }
    }

    fn check_tick(&mut self, tick: u64) -> bool {
        let blocked = self.blocked_on_tick.map(|b| b==tick).unwrap_or(false);
        if !blocked {
            self.blocked_on_tick = None;
        }
        !blocked
    }

    fn get_blocker(&mut self) -> &Option<Block> { 
        if let Some(ref blocker) = self.blocked_on {
            if !blocker.step_blocked() {
                self.blocked_on = None;
            }
        }
        &self.blocked_on
    }

    pub fn more(&mut self) -> StepState2<Y,E> {
        if self.is_dead {
            return StepState2::Ongoing(OngoingState::Dead);
        }
        if let Some(b) = self.get_blocker() {
            return StepState2::Ongoing(OngoingState::Block(b.clone()));
        }
        let tick = self.control.get_tick_index();
        if !self.check_tick(tick) {
            return StepState2::Ongoing(OngoingState::Tick);
        }
        let out = self.run.more(&mut self.control);
        match out {
            StepState2::Ongoing(OngoingState::Tick) => {
                self.blocked_on_tick = Some(tick);
            },
            StepState2::Ongoing(OngoingState::Block(ref b)) => {
                self.blocked_on = Some(b.clone());
            },
            StepState2::Done(_) => {
                self.is_dead = true;
            },
            _ => {}
        }
        out
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::step::{ RunConfig, Step2 };
    use crate::taskcontainer::TaskContainer;
    use crate::executoraction::ExecutorActionHandle;
    use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
    use crate::timer::TimerSet;
    use crate::testintegration::TestIntegration;
    use crate::taskcontrol::TaskControl;
    use crate::steps::noop::BlindStep;

    #[test]
    pub fn test_block_on_tick() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration);
        let mut step  = BlindStep::<(),()>::new(Ok(()));
        let run = step.start(&(),&mut tc);
        let mut sc = StepRunner::new(run,&tc);
        assert!(sc.check_tick(0));
        sc.blocked_on_tick = Some(0);
        assert!(!sc.check_tick(0));
        assert!(sc.check_tick(1));
        assert!(sc.check_tick(0));
    }

    #[test]
    pub fn test_block() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration);
        let mut step  = BlindStep::<(),()>::new(Ok(()));
        let run = step.start(&(),&mut tc);
        let mut sc = StepRunner::new(run,&tc);
        assert!(sc.get_blocker().is_none());
        let mut b1 = Block::new(tc.get_blocker());
        let mut b2 = Block::new(tc.get_blocker());
        b1.add(&b2);
        sc.blocked_on = Some(b1.clone());
        assert!(sc.get_blocker().is_some());
        let b3 = sc.get_blocker().as_ref().unwrap().clone();
        b2.unblock_steps();
        assert!(sc.get_blocker().is_none());
    }
}