use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRun, StepRunner, StepState2, OngoingState };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;

pub struct StepParallel<X,Y,E> where Y: Send {
    steps: Arc<Mutex<Vec<Box<dyn Step2<X,Y,E>>>>>
}

struct StepParallelRun<Y,E> where Y: Send {
    steps: Arc<Mutex<Vec<(Box<StepRunner<Y,E>>,Option<Y>)>>>
}

impl<Y,E> StepRun<Vec<Y>,E> for StepParallelRun<Y,E> where Y: Send {
    fn more(&mut self, control: &mut StepControl) -> StepState2<Vec<Y>,E> {
        /* Advance */
        let mut done = true;
        let mut out = OngoingState::Dead;
        for runner in self.steps.lock().unwrap().iter_mut() {
            match runner.0.more() {
                StepState2::Done(Err(e)) => {
                    return StepState2::Done(Err(e));
                },
                StepState2::Done(Ok(v)) => {
                    runner.1 = Some(v);
                },
                StepState2::Ongoing(ref r) => {
                    out.merge(control,r);
                }
            }
            if runner.1.is_none() {
                done = false;
            }
        }
        /* What do we do? */
        if done {
            let r : Vec<Y> = self.steps.lock().unwrap().iter_mut().map(|x| x.1.take().unwrap()).collect();
            return StepState2::Done(Ok(r));
        }
        StepState2::Ongoing(out)
    }
}

impl<X,Y: Send,E> StepParallel<X,Y,E> {
    pub fn new(steps: Vec<Box<dyn Step2<X,Y,E> + 'static>>) -> StepParallel<X,Y,E> where Y: Send + 'static, E: 'static {
        StepParallel {
            steps: Arc::new(Mutex::new(steps))
        }
    }
}

impl<X,Y,E> Step2<X,Vec<Y>,E> for StepParallel<X,Y,E> where Y: 'static + Send, E: 'static {
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Vec<Y>,E>> {
        let steps = self.steps.lock().unwrap().iter_mut().map(|step| {
            (Box::new(task_control.new_step(step,input)),None)
        }).collect();
        Box::new(StepParallelRun {
            steps: Arc::new(Mutex::new(steps))
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
    use crate::steps::combinators::branch::StepBranch;
    use crate::steps::combinators::sequence::StepSequence2;
    use crate::steps::timeout::TimeoutStep2;
    use crate::steps::noop::BlindStep;
    use crate::testintegration::{ TestIntegration, TestStep, TestState };

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
    pub fn test_parallel_smoke() {
        /* NOTE: also verifies that Again/Tick/Block trumping */
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(Ok(5))
        ]);
        let mut b = integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Done(Ok(2))
        ]);
        let c : TimeoutStep2<(),()> = TimeoutStep2::new(50.,|| ());
        let v: Result<u64,()> = Ok(0);
        let c : StepBranch<(),(),u64,(),()> = StepBranch::new(c,BlindStep::new(v),BlindStep::new(v));
        let out = Arc::new(Mutex::new(vec![]));
        let out2 = out.clone();
        let z = FakeStepExtract(out);
        let p = StepSequence2::new(StepParallel::new(vec![Box::new(a),Box::new(b),Box::new(c)]),z);
        let mut tc = x.add(p,&(),&cfg,"test");
        /* simulate */
        for i in 0..7 {
            x.tick(10.);
            assert!(out2.lock().unwrap().len() == 0);
            assert!(!tc.is_finished());
        }
        integration.set_time(100.);
        x.tick(10.);
        assert!(tc.is_finished());
        assert!(out2.lock().unwrap().len() != 0);
        assert_eq!(vec![5,2,0],*out2.lock().unwrap());
    }

    #[test]
    pub fn test_parallel_error() {
        let now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = FakeStep2(FakeStepRun2(vec![
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Done(Ok(42))
        ],now.clone()));
        let mut b = FakeStep2(FakeStepRun2(vec![
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Again),
            StepState2::Ongoing(OngoingState::Tick),
            StepState2::Done(Err(()))
        ],now.clone()));
        let out = Arc::new(Mutex::new(vec![]));
        let out2 = out.clone();
        let z = FakeStepExtract(out);
        let p = StepSequence2::new(StepParallel::new(vec![Box::new(a),Box::new(b)]),z);
        let tc = x.add(p,&(),&cfg,"test");
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(tc.is_finished());
        // XXX and eheck error when we can
    }
}