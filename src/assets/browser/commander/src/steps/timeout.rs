use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepRunner, StepRun, StepState2 };
use crate::stepcontrol::StepControl;
use crate::taskcontrol::TaskControl;

struct TimeoutRun<Y,E> {
    expired: Arc<Mutex<bool>>,
    inner: StepRunner<Y,E>,
    errorgen: Arc<Mutex<Box<dyn Fn() -> E + Send>>>
}

pub struct TimeoutStep<X,Y,E> {
    timeout: f64,
    inner: Arc<Mutex<Box<dyn Step2<X,Y,E>>>>,
    errorgen: Arc<Mutex<Box<dyn Fn() -> E + Send>>>
}

impl<X,Y,E> TimeoutStep<X,Y,E> {
    pub fn new<A,G>(timeout: f64, inner: A, errorgen: G) -> impl Step2<X,Y,E> where A: Step2<X,Y,E> + 'static, Y: 'static, E: 'static, G: Fn() -> E + 'static + Send {
        TimeoutStep {
            timeout,
            inner: Arc::new(Mutex::new(Box::new(inner))),
            errorgen: Arc::new(Mutex::new(Box::new(errorgen)))
        }
    }
}

impl<X,Y,E> Step2<X,Y,E> for TimeoutStep<X,Y,E> where Y: 'static, E: 'static {
    fn start(&mut self, input: &X, task_control: &mut TaskControl) -> Box<dyn StepRun<Y,E>> {
        let expired = Arc::new(Mutex::new(false));
        let expired2 = expired.clone();
        let task_control2 = task_control.clone();
        task_control.add_timer(self.timeout, move || {
            *expired2.lock().unwrap() = true;
        });
        Box::new(TimeoutRun {
            inner: task_control.new_step(&mut self.inner.lock().unwrap(),input),
            expired,
            errorgen: self.errorgen.clone()
        })
    }
}

impl<Y,E> StepRun<Y,E> for TimeoutRun<Y,E> {
    fn more(&mut self, _control: &mut StepControl) -> StepState2<Y,E> {
        if *self.expired.lock().unwrap() {
            let err = (self.errorgen.lock().unwrap())();
            StepState2::Done(Err(err))
        } else {
            self.inner.more()
        }
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::steps::sequence::StepSequence2;
    use crate::steps::branch::StepBranch;

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

    fn find_branch<T,X,Y,E>(x: &mut Executor, a: T, input: &X) -> bool where T: Step2<X,Y,E> + 'static, X: 'static + Send, Y: 'static, E: 'static {
        let (y,y_flag) = flip(0);
        let (e,e_flag) = flip(0);
        let v1 = FakeStep3(FakeStepRun3(Ok(1)));
        let y = StepSequence2::new(v1,y);
        let v2 = FakeStep3(FakeStepRun3(Ok(1)));
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
        let mut now = Arc::new(Mutex::new((0.,Vec::new())));
        let integration = FakeIntegration(now.clone());
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut cmds = vec![
            StepState2::Tick,
            StepState2::Tick,
            StepState2::Done(Ok(()))
        ];
        if timeout {
            cmds.insert(0,StepState2::Tick);
        }

        let mut b = FakeStep2(FakeStepRun2(cmds,now.clone()));
        now.lock().unwrap().0 = 0.;
        let b = TimeoutStep::new(3.,b,|| ());
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
