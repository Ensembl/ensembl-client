use std::sync::{ Arc, Mutex };

use crate::step::{ Step2, StepRun, StepState2, StepRunner, OngoingState };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;

pub struct StepBranchImpl<X,Y,Z,E,F> {
    main: Box<dyn Step2<X,Y,E>>,
    success: Box<dyn Step2<Y,Z,F>>,
    failure:Box<dyn Step2<E,Z,F>>
}

#[derive(Clone)]
pub struct StepBranch<X,Y,Z,E,F>(Arc<Mutex<StepBranchImpl<X,Y,Z,E,F>>>);

impl<X,Y,Z,E,F> StepBranch<X,Y,Z,E,F> where Z: 'static, E: 'static, F: 'static, X: 'static, Y: 'static {
    pub fn new<A,B,C>(main: A, success: B, failure: C) -> StepBranch<X,Y,Z,E,F> 
            where A: Step2<X,Y,E> + 'static, B: Step2<Y,Z,F> + 'static, C: Step2<E,Z,F> + 'static {
        StepBranch(Arc::new(Mutex::new(StepBranchImpl {
            main: Box::new(main),
            success: Box::new(success),
            failure: Box::new(failure)
        })))
    }
}

struct BranchRun<X,Y,Z,E,F> {
    step: StepBranch<X,Y,Z,E,F>,
    main: StepRunner<Y,E>,
    success: Option<StepRunner<Z,F>>,
    failure: Option<StepRunner<Z,F>>
}

impl<X,Y,Z,E,F> Step2<X,Z,F> for StepBranch<X,Y,Z,E,F> where Z: 'static, E: 'static, F: 'static, X: 'static, Y: 'static {
    fn start(&mut self, input: &X, control: &mut TaskControl) -> Box<dyn StepRun<Z,F>> {
        Box::new(BranchRun {
            step: StepBranch(self.0.clone()),
            main: control.new_step(&mut self.0.lock().unwrap().main,input),
            success: None,
            failure: None
        })
    }
}

impl<X,Y,Z,E,F> StepRun<Z,F> for BranchRun<X,Y,Z,E,F> {
    fn more(&mut self, control: &mut StepControl) -> StepState2<Z,F> {
        if let Some(ref mut run) = self.success {
            run.more()
        } else if let Some(ref mut run) = self.failure {
            run.more()
        } else {
            match self.main.more() {
                StepState2::Done(Ok(v)) => {
                    self.success = Some(control.task_control().new_step(&mut self.step.0.lock().unwrap().success,&v));
                    return StepState2::Ongoing(OngoingState::Again);
                },
                StepState2::Done(Err(e)) => {
                    self.failure = Some(control.task_control().new_step(&mut self.step.0.lock().unwrap().failure,&e));
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

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::testintegration::{ TestIntegration, TestExtractorStep };
    use crate::steps::noop::BlindStep;

    fn flip<X>(init: X) -> (impl Step2<X,(),()>,Arc<Mutex<X>>) where X: Send+Clone+'static {
        let var = Arc::new(Mutex::new(init));
        (TestExtractorStep(var.clone()),var)
    }

    fn smoke_test(v: Result<u32,u32>) -> (u32,u32) {
        /* setup */
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        /* setup job to succeed */
        let mut a = BlindStep::new(v);
        let (y,y_flag) = flip(0);
        let (e,e_flag) = flip(0);
        let b = StepBranch::new(a,y,e);
        let mut tca = x.add(b,&(),&cfg,"test");
        x.tick(10.);
        let x = (*y_flag.lock().unwrap(),*e_flag.lock().unwrap());
        x
    }

    #[test]
    pub fn test_branch() {
        assert_eq!((23,0),smoke_test((Ok(23))));
        assert_eq!((0,42),smoke_test((Err(42))));
    }
}
