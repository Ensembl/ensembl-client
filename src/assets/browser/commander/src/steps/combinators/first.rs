use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontext::TaskContext;

pub struct StepFirst<X,R> where R: Send {
    steps: Arc<Mutex<Vec<Box<dyn Step2<X,Output=R>>>>>
}

struct StepFirstRun<R> where R: Send {
    steps: Arc<Mutex<Vec<Box<StepRunner<R>>>>>
}

impl<R> StepRun for StepFirstRun<R> where R: Send {
    type Output = R;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
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

impl<X,R> StepFirst<X,R> where R: Send {
    pub fn new(steps: Vec<Box<dyn Step2<X,Output=R> + 'static>>) -> StepFirst<X,R> where R: Send + 'static {
        StepFirst {
            steps: Arc::new(Mutex::new(steps))
        }
    }
}

// XXX use references
impl<X,R> Step2<X> for StepFirst<X,R> where R: Send + 'static, X: Clone {
    type Output = R;

    fn start(&mut self, input: X, task_control: &mut TaskContext) -> Box<dyn StepRun<Output=R>> {
        let steps = self.steps.lock().unwrap().iter_mut().map(|step| {
            Box::new(task_control.new_step(step,input.clone()))
        }).collect();
        Box::new(StepFirstRun {
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
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;
    use crate::testintegration::{ TestIntegration, TestState, TestExtractorStep };

    #[test]
    pub fn test_first_smoke() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut a = integration.new_step(vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Tick,
            TestState::Done(1)
        ]);
        let mut b = integration.new_step(vec![
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Again,
            TestState::Tick,
            TestState::Done(2)
        ]);
        let out = Arc::new(Mutex::new(0));
        let out2 = out.clone();
        let z = TestExtractorStep(out);
        let p = StepSequenceSimple::new(StepFirst::new(vec![Box::new(a),Box::new(b)]),z);
        x.add(p,&(),&cfg,"test");
        /* simulate */
        for i in 0..1 {
            x.tick(10.);
            assert!(*out2.lock().unwrap() == 0);
        }
        x.tick(10.);
        assert_eq!(2,*out2.lock().unwrap());
        assert_eq!(2,x.get_tick_index());
    }
}