use std::marker::PhantomData;
use crate::step::{ Step2, StepState2 };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontrol::TaskControl;

struct NoopRun<Y>(Y);

impl<R> StepRun<R> for NoopRun<R> where R: Clone {
    fn more(&mut self, _control: &mut TaskControl) -> StepState2<R> {
        StepState2::Done(self.0.clone())
    }
}

pub struct NoopStep<R>(PhantomData<R>);

impl<R> NoopStep<R> {
    pub fn new() -> impl Step2<R,R> where R: 'static + Send + Clone {
        NoopStep(PhantomData)
    }
}

impl<R> Step2<R,R> for NoopStep<R> where R: 'static + Send + Clone {
    fn start(&mut self, input: &R, _task_control: &mut TaskControl) -> Box<dyn StepRun<R>> {
        Box::new(NoopRun(input.clone()))
    }
}

struct BlindRun<R>(R);

impl<R> StepRun<R> for BlindRun<R> where R: Clone {
    fn more(&mut self, _control: &mut TaskControl) -> StepState2<R> {
        StepState2::Done(self.0.clone())
    }
}

pub struct BlindStep<R>(R);

impl<R> BlindStep<R> {
    pub fn new<X>(out: R) -> impl Step2<X,R> where R: 'static + Send + Clone {
        BlindStep(out)
    }
}

impl<X,R> Step2<X,R> for BlindStep<R> where R: 'static + Send + Clone {
    fn start(&mut self, _input: &X, _task_control: &mut TaskControl) -> Box<dyn StepRun<R>> {
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
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;
    use crate::testintegration::{ TestIntegration, TestExtractorStep };

    #[test]
    pub fn test_noop() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32>> = vec![
            StepState2::Done(12)
        ];
        let mut b = BlindStep::new(19);
        let noop = NoopStep::new();
        
        let val = Arc::new(Mutex::new(0));
        let out = TestExtractorStep(val.clone());
        let seq = StepSequenceSimple::new(StepSequenceSimple::new(b,noop),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(19,*val.lock().unwrap());
    }

    #[test]
    pub fn test_blind() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds : Vec<StepState2<i32>> = vec![
            StepState2::Done(12)
        ];
        let mut b = BlindStep::new(19);
        let blind = BlindStep::new(17);
        let val = Arc::new(Mutex::new(0));
        let out = TestExtractorStep(val.clone());
        let seq = StepSequenceSimple::new(StepSequenceSimple::new(b,blind),out);
        let mut tcb = x.add(seq,&(),&cfg,"test");        
        x.tick(10.);
        assert_eq!(17,*val.lock().unwrap());
    }
}
