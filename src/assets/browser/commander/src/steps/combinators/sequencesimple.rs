use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontrol::TaskControl;

struct StepSequenceSimpleRun<Y,Z> {
    task_control: TaskControl,
    one: StepRunner<Y>,
    two_step: Arc<Mutex<Box<dyn Step2<Y,Output=Z>>>>,
    two: Option<StepRunner<Z>>
}

impl<Y,Z> StepRun for StepSequenceSimpleRun<Y,Z> {
    type Output = Z;

    fn more(&mut self, _control: &mut TaskControl) -> StepState2<Z> {
        if let Some(two) = &mut self.two {
            two.more()
        } else {
            match self.one.more() {
                StepState2::Done(v) => {
                    let mut step = self.two_step.lock().unwrap();
                    self.two = Some(self.task_control.new_step(&mut step,&v));
                    return StepState2::Ongoing(OngoingState::Again);
                },
                StepState2::Ongoing(OngoingState::Again) => StepState2::Ongoing(OngoingState::Again),
                StepState2::Ongoing(OngoingState::Block(b)) => StepState2::Ongoing(OngoingState::Block(b)),
                StepState2::Ongoing(OngoingState::Tick) => StepState2::Ongoing(OngoingState::Tick),
                StepState2::Ongoing(OngoingState::Dead) => StepState2::Ongoing(OngoingState::Dead)
            }
        }
    }
}

#[derive(Clone)]
pub struct StepSequenceSimple<X,Y,Z> where Y: Send {
    one: Arc<Mutex<Box<dyn Step2<X,Output=Y>>>>,
    two: Arc<Mutex<Box<dyn Step2<Y,Output=Z>>>>
}

impl<X,Y: Send,Z> StepSequenceSimple<X,Y,Z> {
    pub fn new<A,B>(one: A, two: B) -> StepSequenceSimple<X,Y,Z> where A: Step2<X,Output=Y> + 'static, B: Step2<Y,Output=Z> + 'static, Y: Send + 'static, Z: 'static {
        StepSequenceSimple {
            one: Arc::new(Mutex::new(Box::new(one))),
            two: Arc::new(Mutex::new(Box::new(two)))
        }
    }
}

impl<X,Y: Send,Z> Step2<X> for StepSequenceSimple<X,Y,Z> where Y: 'static, Z: 'static {
    type Output = Z;
    
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Output=Z>> {
        Box::new(StepSequenceSimpleRun {
            task_control: task_control.clone(),
            one: task_control.new_step(&mut self.one.lock().unwrap(),input),
            two_step: self.two.clone(),
            two: None
        })
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::testintegration::{ TestIntegration, TestState };

    #[test]
    pub fn test_sequencesimple_smoke() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Done(())
        ]);
        let mut b = integration.new_step(vec![
            TestState::Tick,
            TestState::Done(())
        ]);
        let mut tc = x.add(StepSequenceSimple::new(a,b),&(),&cfg,"test");
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(tc.is_finished());
    }
}