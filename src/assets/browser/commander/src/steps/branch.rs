use std::sync::{ Arc, Mutex };

use crate::step::{ Step2, StepRun, StepState2, StepRunner };
use crate::steprunner::StepControl;
use crate::taskcontext::TaskContext;

pub struct StepBranchImpl<X,Y,Z,E,F> {
    main: Box<dyn Step2<X,Y,E>>,
    success: Box<dyn Step2<Y,Z,F>>,
    failure:Box<dyn Step2<E,Z,F>>
}

#[derive(Clone)]
pub struct StepBranch<X,Y,Z,E,F>(Arc<Mutex<StepBranchImpl<X,Y,Z,E,F>>>);

impl<X,Y,Z,E,F> StepBranch<X,Y,Z,E,F> where Z: 'static, E: 'static, F: 'static, X: 'static, Y: 'static {
    pub fn new<A,B,C>(main: A, success: B, failure: C) -> impl Step2<X,Z,F> 
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
    fn start(&mut self, input: &X, control: &mut TaskContext) -> Box<dyn StepRun<Z,F>> {
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
                    return StepState2::Again;
                },
                StepState2::Done(Err(e)) => {
                    self.failure = Some(control.task_control().new_step(&mut self.step.0.lock().unwrap().failure,&e));
                    return StepState2::Again;
                },
                StepState2::Again => StepState2::Again,
                StepState2::Block => StepState2::Block,
                StepState2::Tick => StepState2::Tick
            }
        }
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

    struct FakeStep3<Y,E>(FakeStepRun3<Y,E>) where Y: Clone, E: Clone;
    impl<Y,E> Step2<(),Y,E> for FakeStep3<Y,E> where Y: Send+Clone+'static, E: Send+Clone+'static {
        fn start(&mut self, input: &(), _control: &mut TaskContext) -> Box<dyn StepRun<Y,E>> {
            Box::new(self.0.clone())
        }
    }

    // XXX replace fakestep
    #[derive(Clone)]
    struct FakeStepRun3<Y: Clone, E: Clone>(Result<Y,E>);

    impl<Y,E> StepRun<Y,E> for FakeStepRun3<Y,E> where Y: Clone, E: Clone {
        fn more(&mut self, control: &mut StepControl) -> StepState2<Y,E> {
            StepState2::Done(self.0.clone())
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
        fn start(&mut self, input: &T, _control: &mut TaskContext) -> Box<dyn StepRun<(),()>> {
            *self.0.lock().unwrap() = input.clone();
            Box::new(self.clone())
        }
    }

    fn flip<X>(init: X) -> (impl Step2<X,(),()>,Arc<Mutex<X>>) where X: Send+Clone+'static {
        let var = Arc::new(Mutex::new(init));
        (FakeStepExtract(var.clone()),var)
    }

    fn smoke_test(v: Result<u32,u32>) -> (u32,u32) {
        /* setup */
        let mut now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        /* setup job to succeed */
        let mut a = FakeStep3(FakeStepRun3(v));
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
