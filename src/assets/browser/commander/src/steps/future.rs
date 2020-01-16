use std::sync::{ Arc, Mutex };
use std::future::Future;
use std::pin::Pin;
use std::task::Poll;
use crate::block::Block;
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::StepRun;
use crate::taskcontext::TaskContext;
use futures::task::{ ArcWake, Context, waker_ref };

struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

struct FutureRun<R>(Pin<Box<Future<Output=R> + Send+Sync>>);

impl<R> StepRun for FutureRun<R> where R: Clone {
    type Output = R;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
        let block = control.block();
        let waker = Arc::new(StepWaker(Mutex::new(block.clone())));
        match self.0.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker))) {
            Poll::Pending => {
                StepState2::Ongoing(OngoingState::Block(block))
            },
            Poll::Ready(v) => StepState2::Done(v)
        }
    }
}

pub struct FutureStep<X,R> {
    generator: Box<FnMut(X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send>
}

impl<X,R> FutureStep<X,R> {
    pub fn new<T>(generator: T) -> FutureStep<X,R> where R: 'static + Send + Clone, T: FnMut(X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send + 'static {
        FutureStep {
            generator: Box::new(generator)
        }
    }
}

impl<X,R> Step2<X> for FutureStep<X,R> where R: 'static + Send + Clone {
    type Output = R;

    fn start(&mut self, input: X, _task_control: &mut TaskContext) -> Box<dyn StepRun<Output=R>> {
        let future = (self.generator)(input);
        Box::new(FutureRun(future))
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use async_std::task::sleep as async_sleep;
    use std::thread::sleep;
    use std::time::Duration;
    use crate::executor::Executor;
    use crate::step::RunConfig;
    use crate::testintegration::{ TestIntegration, TestExtractorStep };
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;

    #[test]
    pub fn test_future_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let f = FutureStep::new(|x: u32| { Box::pin(async move { 
            async_sleep(Duration::from_millis(100)).await;
            (2+x) as u32 }) 
        });
        let out = Arc::new(Mutex::new(0));
        let z = TestExtractorStep(out.clone());
        let f = StepSequenceSimple::new(f,z);
        let tc = x.add(f,2,&cfg,"test");
        x.tick(10.);
        assert!(!tc.is_finished());
        sleep(Duration::from_millis(200));
        x.tick(10.);
        assert!(tc.is_finished());
        assert_eq!(4,*out.lock().unwrap());
    }
}
