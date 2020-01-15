use std::marker::PhantomData;
use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRun, StepState2, OngoingState };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;
use crate::steps::combinators::first::StepFirst;

struct Timeout2Run<E> {
    timeout: f64,
    expired: Arc<Mutex<bool>>,
    errorgen: Arc<Mutex<Box<dyn Fn() -> E + Send>>>
}

impl<Y,E> StepRun<Y,E> for Timeout2Run<E> {
    fn more(&mut self, control: &mut StepControl) -> StepState2<Y,E> {
        if *self.expired.lock().unwrap() {
            let err = (self.errorgen.lock().unwrap())();
            StepState2::Done(Err(err))
        } else {
            let b = control.block();
            let mut b2 = b.clone();
            control.task_control().add_timer(self.timeout,move || {
                print!("TIMED OUT\n");
                b2.unblock();
            });
            *self.expired.lock().unwrap() = true;
            StepState2::Ongoing(OngoingState::Block(b))
        }
    }
}

#[derive(Clone)]
pub struct TimeoutStep2<X,E> {
    input: PhantomData<X>,
    timeout: f64,
    errorgen: Arc<Mutex<Box<dyn Fn() -> E + Send>>>
}

impl<X,E> TimeoutStep2<X,E> where X: Send {
    pub fn new<G>(timeout: f64, errorgen: G) -> TimeoutStep2<X,E> where E: 'static, G: Fn() -> E + 'static + Send {
        TimeoutStep2 {
            input: PhantomData,
            timeout,
            errorgen: Arc::new(Mutex::new(Box::new(errorgen)))
        }
    }

    /* convenience method */
    pub fn new_wrapped<Y,G>(timeout: f64, inner: Box<dyn Step2<X,Y,E>>, errorgen: G) -> StepFirst<X,Y,E> where X: 'static, Y: Send + 'static, E: 'static, G: Fn() -> E + 'static + Send {
        let timeout = TimeoutStep2::new(timeout,errorgen);        
        StepFirst::new(vec![Box::new(timeout),inner])
    }
}

impl<X,Y,E> Step2<X,Y,E> for TimeoutStep2<X,E> where X: Send, E: 'static {
    fn start(&mut self, _input: &X, _control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
        Box::new(Timeout2Run {
            timeout: self.timeout,
            expired: Arc::new(Mutex::new(false)),
            errorgen: self.errorgen.clone()
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
    use crate::steps::combinators::sequence::StepSequence2;
    use crate::steps::combinators::branch::StepBranch;
    use crate::steps::noop::BlindStep;
    use crate::testintegration::{ TestIntegration, TestState, TestExtractorStep };

    fn flip<X>(init: X) -> (impl Step2<X,(),()>,Arc<Mutex<X>>) where X: Send+Clone+'static {
        let var = Arc::new(Mutex::new(init));
        (TestExtractorStep(var.clone()),var)
    }

    fn find_branch<T,X,Y,E>(x: &mut Executor, a: T, input: &X) -> bool where T: Step2<X,Y,E> + 'static, X: 'static + Send, Y: 'static, E: 'static {
        let (y,y_flag) = flip(0);
        let (e,e_flag) = flip(0);
        let v1 = BlindStep::new(Ok(1));
        let y = StepSequence2::new(v1,y);
        let v2 = BlindStep::new(Ok(1));
        let e = StepSequence2::new(v2,e);
        let b = StepBranch::new(a,y,e);
        let cfg = RunConfig::new(None,3,None);
        let mut tcb = x.add(b,input,&cfg,"test");        
        for _ in 0..10 {
            x.tick(10.);
        }
        if *y_flag.lock().unwrap() > 0 {
            true
        } else if *e_flag.lock().unwrap() > 0 {
            false
        } else {
            assert!(false);
            true
        }
    }

    pub fn timeout_smoke(timeout: bool) {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds = vec![
            TestState::Tick,
            TestState::Tick,
            TestState::Done(Ok(()))
        ];
        if timeout {
            cmds.insert(0,TestState::Tick);
        }

        let mut b = integration.new_step(cmds);
        let b = TimeoutStep2::new_wrapped(3.,Box::new(b),|| ());
        assert!(find_branch(&mut x, b,&()) || timeout);
    }

    #[test]
    pub fn test_timer_notimeout() {
        timeout_smoke(false);
    }

    #[test]
    pub fn test_timer_timeout() {
        timeout_smoke(true);
    }
}
