use crate::block::Block;
use crate::taskcontext::TaskContext;
use crate::step::{ StepState2, OngoingState };

pub trait StepRun {
    type Output;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<Self::Output>;
}

pub struct StepRunner<R> {
    run: Box<dyn StepRun<Output=R>>,
    control: TaskContext,
    blocked_on: Option<Block>,
    is_dead: bool
 
}

impl<R> StepRunner<R> {
    pub(crate) fn new(run: Box<dyn StepRun<Output=R>>, task_control: &TaskContext) -> StepRunner<R> {
        StepRunner {
            run,
            control: task_control.clone(),
            blocked_on: None,
            is_dead: false
        }
    }

    fn get_blocker(&mut self) -> &Option<Block> { 
        if let Some(ref blocker) = self.blocked_on {
            if !blocker.step_blocked() {
                self.blocked_on = None;
            }
        }
        &self.blocked_on
    }

    pub fn more(&mut self) -> StepState2<R> {
        if self.is_dead {
            return StepState2::Ongoing(OngoingState::Dead);
        }
        if let Some(b) = self.get_blocker() {
            return StepState2::Ongoing(OngoingState::Block(b.clone()));
        }
        let out = self.run.more(&mut self.control);
        match out {
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
    use crate::step::RunConfig;
    use crate::taskcontainer::TaskContainer;
    use crate::executoraction::ExecutorActionHandle;
    use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
    use crate::timer::TimerSet;
    use crate::testintegration::TestIntegration;
    use crate::taskcontext::TaskContext;
    use crate::future::FutureRun;

    #[test]
    pub fn test_block() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = TaskContext::new(&cfg,&eah,&integration);
        tc.register(&h);
        let run = FutureRun::new(Box::pin(async{ }));
        let mut sc = StepRunner::new(Box::new(run),&tc);
        assert!(sc.get_blocker().is_none());
        let mut b1 = tc.block();
        let mut b2 = tc.block();
        b1.add(&b2);
        sc.blocked_on = Some(b1.clone());
        assert!(sc.get_blocker().is_some());
        let b3 = sc.get_blocker().as_ref().unwrap().clone();
        b2.unblock_steps();
        assert!(sc.get_blocker().is_none());
    }
}