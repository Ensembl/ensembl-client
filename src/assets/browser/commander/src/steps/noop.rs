use std::marker::PhantomData;
use crate::step::{ Step2, StepState2 };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontrol::TaskControl;

struct NoopRun<Y>(Y);

impl<Y,E> StepRun<Y,E> for NoopRun<Y> where Y: Clone {
    fn more(&mut self, _control: &mut TaskControl) -> StepState2<Y,E> {
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
    fn more(&mut self, _control: &mut TaskControl) -> StepState2<Y,E> {
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

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::steps::combinators::sequence::StepSequence2;
    use crate::testintegration::{ TestIntegration, TestExtractorStep };

    #[test]
    pub fn test_noop() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32,()>> = vec![
            StepState2::Done(Ok(19))
        ];
        let mut b = BlindStep::new(Ok(19));
        let noop = NoopStep::new();
        
        let val = Arc::new(Mutex::new(0));
        let out = TestExtractorStep(val.clone());
        let seq = StepSequence2::new(StepSequence2::new(b,noop),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(19,*val.lock().unwrap());
    }

    #[test]
    pub fn test_blind() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32,()>> = vec![
            StepState2::Done(Ok(19))
        ];
        let mut b = BlindStep::new(Ok(19));
        let blind = BlindStep::new(Ok(17));
        let val = Arc::new(Mutex::new(0));
        let out = TestExtractorStep(val.clone());
        let seq = StepSequence2::new(StepSequence2::new(b,blind),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(17,*val.lock().unwrap());
    }
}
