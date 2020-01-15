use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRun, StepRunner, StepState2 };
use crate::steprunner::StepControl;
use crate::taskcontrol::TaskControl;

struct StepSequenceRun<Y,Z,E> {
    task_control: TaskControl,
    one: StepRunner<Y,E>,
    two_step: Arc<Mutex<Box<dyn Step2<Y,Z,E>>>>,
    two: Option<StepRunner<Z,E>>
}

impl<Y,Z,E> StepRun<Z,E> for StepSequenceRun<Y,Z,E> {
    fn more(&mut self, _control: &mut StepControl) -> StepState2<Z,E> {
        if let Some(two) = &mut self.two {
            two.more()
        } else {
            match self.one.more() {
                StepState2::Done(Ok(v)) => {
                    let mut step = self.two_step.lock().unwrap();
                    self.two = Some(self.task_control.new_step(&mut step,&v));
                    return StepState2::Again;
                },
                StepState2::Done(Err(v)) => StepState2::Done(Err(v)),
                StepState2::Again => StepState2::Again,
                StepState2::Block => StepState2::Block,
                StepState2::Tick => StepState2::Tick
            }
        }
    }
}

#[derive(Clone)]
pub struct StepSequence2<X,Y,Z,E> where Y: Send {
    one: Arc<Mutex<Box<dyn Step2<X,Y,E>>>>,
    two: Arc<Mutex<Box<dyn Step2<Y,Z,E>>>>
}

impl<X,Y: Send,Z,E> StepSequence2<X,Y,Z,E> {
    pub fn new<A,B>(one: A, two: B) -> impl Step2<X,Z,E> where A: Step2<X,Y,E> + 'static, B: Step2<Y,Z,E> + 'static, Y: Send + 'static, Z: 'static, E: 'static {
        StepSequence2 {
            one: Arc::new(Mutex::new(Box::new(one))),
            two: Arc::new(Mutex::new(Box::new(two)))
        }
    }
}

impl<X,Y: Send,Z,E> Step2<X,Z,E> for StepSequence2<X,Y,Z,E> where Y: 'static, Z: 'static, E: 'static {
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Z,E>> {
        Box::new(StepSequenceRun {
            task_control: task_control.clone(),
            one: task_control.new_step(&mut self.one.lock().unwrap(),input),
            two_step: self.two.clone(),
            two: None
        })
    }
}


#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };

    #[derive(Clone)]
    pub struct FakeIntegration(Arc<Mutex<(f64,Vec<SleepQuantity>)>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { self.0.lock().unwrap().0 }
        fn sleep(&mut self, quantity: SleepQuantity) { self.0.lock().unwrap().1.push(quantity); }
    }

    struct FakeStep2(FakeStepRun2);
    impl Step2<(),()> for FakeStep2 {
        fn start(&mut self, input: &(), _control: &mut TaskControl) -> Box<dyn StepRun<(),()>> {
            Box::new(self.0.clone())
        }
    }

    // XXX replace fakestep
    #[derive(Clone)]
    struct FakeStepRun2(Vec<StepState2<(),()>>,Arc<Mutex<(f64,Vec<SleepQuantity>)>>);
    impl StepRun<(),()> for FakeStepRun2 {
        fn more(&mut self, control: &mut StepControl) -> StepState2<(),()> {
            self.1.lock().unwrap().0 += 1.;
            if self.0.len() > 0 {
                self.0.remove(0)
            } else {
                StepState2::Done(Ok(()))
            }
        }
    }

    #[test]
    pub fn test_sequence_smoke() {
        /* setup */
        let now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = FakeStep2(FakeStepRun2(vec![
            StepState2::Tick,
            StepState2::Tick,
            StepState2::Done(Ok(()))
        ],now.clone()));
        let mut b = FakeStep2(FakeStepRun2(vec![
            StepState2::Tick,
            StepState2::Done(Ok(()))
        ],now.clone()));
        let mut tc = x.add(StepSequence2::new(a,b),&(),&cfg,"test");
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