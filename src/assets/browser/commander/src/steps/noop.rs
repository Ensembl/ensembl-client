use std::marker::PhantomData;
use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRunner, StepRun, StepState2 };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;
use crate::steps::combinators::first::StepFirst;

struct NoopRun<Y>(Y);

impl<Y,E> StepRun<Y,E> for NoopRun<Y> where Y: Clone {
    fn more(&mut self, _control: &mut StepControl) -> StepState2<Y,E> {
        StepState2::Done(Ok(self.0.clone()))
    }
}

pub struct NoopStep<Y>(PhantomData<Y>);

impl<Y> NoopStep<Y> {
    pub fn new<E>() -> impl Step2<Y,Y,E> where Y: 'static + Send + Clone {
        NoopStep(PhantomData)
    }
}

impl<Y,E> Step2<Y,Y,E> for NoopStep<Y> where Y: 'static + Send + Clone {
    fn start(&mut self, input: &Y, _task_control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
        Box::new(NoopRun(input.clone())) // XXX noclone
    }
}

struct BlindRun<Y,E>(Result<Y,E>);

impl<Y,E> StepRun<Y,E> for BlindRun<Y,E> where Y: Clone, E: Clone {
    fn more(&mut self, _control: &mut StepControl) -> StepState2<Y,E> {
        StepState2::Done(self.0.clone())
    }
}

pub struct BlindStep<Y,E>(Result<Y,E>);

impl<Y,E> BlindStep<Y,E> {
    pub fn new<X>(out: Result<Y,E>) -> impl Step2<X,Y,E> where Y: 'static + Send + Clone, E: 'static + Send + Clone {
        BlindStep(out)
    }
}

impl<X,Y,E> Step2<X,Y,E> for BlindStep<Y,E> where Y: 'static + Send + Clone, E: 'static + Send + Clone {
    fn start(&mut self, _input: &X, _task_control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
        Box::new(BlindRun(self.0.clone())) // XXX noclone
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

    fn flip<X>(init: X) -> (impl Step2<X,(),()>,Arc<Mutex<X>>) where X: Send+Clone+'static {
        let var = Arc::new(Mutex::new(init));
        (FakeStepExtract(var.clone()),var)
    }

    struct FakeStep3<Y,E>(FakeStepRun3<Y,E>) where Y: Clone, E: Clone;
    impl<X,Y,E> Step2<X,Y,E> for FakeStep3<Y,E> where Y: Send+Clone+'static, E: Send+Clone+'static {
        fn start(&mut self, input: &X, _control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
            Box::new(self.0.clone())
        }
    }

    #[derive(Clone)]
    struct FakeStepRun3<Y: Clone, E: Clone>(Result<Y,E>);

    impl<Y,E> StepRun<Y,E> for FakeStepRun3<Y,E> where Y: Clone, E: Clone {
        fn more(&mut self, control: &mut StepControl) -> StepState2<Y,E> {
            StepState2::Done(self.0.clone())
        }
    }

    #[test]
    pub fn test_noop() {
        let mut now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32,()>> = vec![
            StepState2::Done(Ok(19))
        ];
        let mut b = FakeStep3(FakeStepRun3(Ok(19)));
        let noop = NoopStep::new();
        
        let val = Arc::new(Mutex::new(0));
        let out = FakeStepExtract(val.clone());
        let seq = StepSequence2::new(StepSequence2::new(b,noop),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(19,*val.lock().unwrap());
    }

    #[test]
    pub fn test_blind() {
        let mut now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32,()>> = vec![
            StepState2::Done(Ok(19))
        ];
        let mut b = FakeStep3(FakeStepRun3(Ok(19)));
        let blind = BlindStep::new(Ok(17));
        let val = Arc::new(Mutex::new(0));
        let out = FakeStepExtract(val.clone());
        let seq = StepSequence2::new(StepSequence2::new(b,blind),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(17,*val.lock().unwrap());
    }
}
