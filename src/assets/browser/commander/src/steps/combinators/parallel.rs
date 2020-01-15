use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontrol::TaskControl;

pub struct StepParallel<X,Y,E>  {
    steps: Arc<Mutex<Vec<Box<dyn Step2<X,Result<Y,E>>>>>>
}

struct StepParallelRun<Y,E> where Y: Send {
    steps: Arc<Mutex<Vec<(Box<StepRunner<Result<Y,E>>>,Option<Y>)>>>
}

impl<Y,E> StepRun<Result<Vec<Y>,E>> for StepParallelRun<Y,E> where Y: Send {
    fn more(&mut self, control: &mut TaskControl) -> StepState2<Result<Vec<Y>,E>> {
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
    pub fn new(steps: Vec<Box<dyn Step2<X,Result<Y,E>> + 'static>>) -> StepParallel<X,Y,E> where Y: Send + 'static, E: 'static {
        StepParallel {
            steps: Arc::new(Mutex::new(steps))
        }
    }
}

impl<X,Y,E> Step2<X,Result<Vec<Y>,E>> for StepParallel<X,Y,E> where Y: 'static + Send, E: 'static {
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Result<Vec<Y>,E>>> {
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
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;
    use crate::steps::timeout::TimeoutStep2;
    use crate::steps::noop::{ BlindStep, NoopStep };
    use crate::testintegration::{ TestIntegration, TestStep, TestState, TestExtractorStep };

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
        let c = StepSequenceSimple::new(c,BlindStep::new(Ok(0)));
        let out : Arc<Mutex<Vec<u32>>> = Arc::new(Mutex::new(vec![]));
        let out2 = out.clone();
        let z = TestExtractorStep(out);
        let p = StepParallel::new(vec![Box::new(a),Box::new(b),Box::new(c)]);
        let p = StepBranch::new(p,NoopStep::new(),NoopStep::new());
        let p = StepSequenceSimple::new(p,z);
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
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(Ok(42))
        ]);
        let mut b = integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Done(Err(6))
        ]);
        let out : Arc<Mutex<u32>> = Arc::new(Mutex::new(12));
        let out2 = out.clone();
        let z = TestExtractorStep(out);
        let p : StepParallel<(),_,_> = StepParallel::new(vec![Box::new(a),Box::new(b)]);
        let p = StepBranch::new(p,BlindStep::new(23),NoopStep::new());
        let p = StepSequenceSimple::new(p,z);
        let tc = x.add(p,&(),&cfg,"test");
        x.tick(10.);
        assert!(!tc.is_finished());
        x.tick(10.);
        assert!(tc.is_finished());
        assert_eq!(6,*out2.lock().unwrap());
    }
}