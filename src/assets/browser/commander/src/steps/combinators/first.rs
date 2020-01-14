use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRun, StepRunner, StepState2, OngoingState };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;

pub struct StepFirst<X,Y,E> where Y: Send {
    steps: Arc<Mutex<Vec<Box<dyn Step2<X,Y,E>>>>>
}

struct StepFirstRun<Y,E> where Y: Send {
    steps: Arc<Mutex<Vec<Box<StepRunner<Y,E>>>>>
}

impl<Y,E> StepRun<Y,E> for StepFirstRun<Y,E> where Y: Send {
    fn more(&mut self, control: &mut StepControl) -> StepState2<Y,E> {
        let mut out = OngoingState::Dead;
        for runner in self.steps.lock().unwrap().iter_mut() {
            match runner.more() {
                StepState2::Ongoing(ref r) => {
                    out.merge(control,r);
                },
                StepState2::Done(v) => {
                    return StepState2::Done(v);
                }
            }
        }
        StepState2::Ongoing(out)
    }
}

impl<X,Y: Send,E> StepFirst<X,Y,E> {
    pub fn new(steps: Vec<Box<dyn Step2<X,Y,E> + 'static>>) -> StepFirst<X,Y,E> where Y: Send + 'static, E: 'static {
        StepFirst {
            steps: Arc::new(Mutex::new(steps))
        }
    }
}

impl<X,Y: Send,E> Step2<X,Y,E> for StepFirst<X,Y,E> where Y: 'static, E: 'static {
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
        let steps = self.steps.lock().unwrap().iter_mut().map(|step| {
            Box::new(task_control.new_step(step,input))
        }).collect();
        Box::new(StepFirstRun {
            steps: Arc::new(Mutex::new(steps))
        })
    }
}

#[allow(unused)]
mod test {
    use super::*;

    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::steps::combinators::sequence::StepSequence2;

    #[derive(Clone)]
    pub struct FakeIntegration(Arc<Mutex<(f64,Vec<SleepQuantity>)>>);
    impl CommanderIntegration2 for FakeIntegration {
        fn current_time(&mut self) -> f64 { self.0.lock().unwrap().0 }
        fn sleep(&mut self, quantity: SleepQuantity) { self.0.lock().unwrap().1.push(quantity); }
    }

    struct FakeStep2(FakeStepRun2);
    impl Step2<(),u64> for FakeStep2 {
        fn start(&mut self, input: &(), _control: &mut TaskControl) -> Box<dyn StepRun<u64,()>> {
            Box::new(self.0.clone())
        }
    }

    #[derive(Clone)]
    struct FakeStepRun2(Vec<StepState2<u64,()>>,Arc<Mutex<(f64,Vec<SleepQuantity>)>>);
    impl StepRun<u64,()> for FakeStepRun2 {
        fn more(&mut self, control: &mut StepControl) -> StepState2<u64,()> {
            self.1.lock().unwrap().0 += 1.;
            if self.0.len() > 0 {
                self.0.remove(0)
            } else {
                StepState2::Done(Ok(control.task_control().get_tick_index()))
            }
        }
    }

    #[derive(Clone)]
    struct FakeStepExtract<T>(Arc<Mutex<T>>);
    impl<T> StepRun<(),()> for FakeStepExtract<T> {
        fn more(&mut self, control: &mut StepControl) -> StepState2<(),()> {
            StepState2::Done(Ok(()))
        }
    }

    impl<T> Step2<T,(),()> for FakeStepExtract<T> where T: Send+Clone+'static {
        fn start(&mut self, input: &T, _control: &mut TaskControl) -> Box<dyn StepRun<(),()>> {
            *self.0.lock().unwrap() = input.clone();
            Box::new(self.clone())
        }
    }

    #[test]
    pub fn test_first_smoke() {
        /* setup */
        let now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = FakeStep2(FakeStepRun2(vec![
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
        ],now.clone()));
        let mut b = FakeStep2(FakeStepRun2(vec![
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Tick),
        ],now.clone()));
        let out = Arc::new(Mutex::new(0));
        let out2 = out.clone();
        let z = FakeStepExtract(out);
        let p = StepSequence2::new(StepFirst::new(vec![Box::new(a),Box::new(b)]),z);
        x.add(p,&(),&cfg,"test");
        /* simulate */
        for i in 0..1 {
            x.tick(10.);
            assert!(*out2.lock().unwrap() == 0);
        }
        x.tick(10.);
        assert_eq!(2,*out2.lock().unwrap());
    }
}