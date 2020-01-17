use std::sync::{ Arc, Mutex };
use std::future::{ Future };
use std::pin::Pin;
use std::task::Poll;
use crate::block::Block;
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::StepRun;
use crate::taskcontext::TaskContext;
use futures::future;
use futures::task::{ ArcWake, Context, waker_ref };

struct FutureContextOnce {
    again: bool,
    timeout: Option<f64>,
    block: Option<Block>
}

impl FutureContextOnce {
    fn new() -> FutureContextOnce {
        FutureContextOnce {
            again: false,
            timeout: None,
            block: None
        }
    }
}

pub struct StepFuture<X>(Arc<Mutex<(FutureContext,Box<Fn(&FutureContext) -> X + Send>,Option<X>)>>);

impl<X> Future for StepFuture<X> {
    type Output = X;

    fn poll(self: Pin<&mut Self>, _ctx: &mut Context) -> Poll<X> {
        let mut state = self.0.lock().unwrap();
        match state.2.take() {
            Some(out) => Poll::Ready(out),
            None => {
                let v = state.0.clone();
                state.2 = Some((&state.1)(&v));
                Poll::Pending
            }
        }
    }
}

pub struct BlockFuture(Block);

impl Future for BlockFuture {
    type Output = ();

    fn poll(self: Pin<&mut Self>, _ctx: &mut Context) -> Poll<()> {
        match self.0.step_blocked() {
            true => Poll::Pending,
            false => Poll::Ready(())
        }
    }
}

#[derive(Clone)]
pub struct FutureContext(TaskContext,Arc<Mutex<FutureContextOnce>>);

impl FutureContext {
    pub fn tick(&self,ticks: u64) -> impl Future<Output=()> {
        let block = self.0.block();
        self.0.block_for_ticks(block.clone(),ticks);
        self.1.lock().unwrap().block = Some(block.clone());
        BlockFuture(block)
    }

    pub fn timer(&self, timeout: f64) -> impl Future<Output=()> {
        StepFuture(Arc::new(Mutex::new((self.clone(),Box::new(move |ctx| {
            ctx.1.lock().unwrap().timeout = Some(timeout);
        }),None))))
    }
}

struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

struct FutureRun<R>(Pin<Box<Future<Output=R> + Send+Sync>>,FutureContext);

impl<R> StepRun for FutureRun<R> where R: Clone {
    type Output = R;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
        let block = control.block();
        let waker = Arc::new(StepWaker(Mutex::new(block.clone())));
        let out = match self.0.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker))) {
            Poll::Pending => {
                let mut context = (self.1).1.lock().unwrap();
                if let Some(block) = context.block.take() {
                    StepState2::Ongoing(OngoingState::Block(block))
                } else if context.again {
                    waker.wake();
                    StepState2::Ongoing(OngoingState::Again)
                } else if let Some(timeout) = context.timeout {
                    // XXX can probably be implemented as a future
                    let mut block2 = block.clone();
                    control.add_timer(timeout,move || {
                        block2.unblock();
                    });
                    StepState2::Ongoing(OngoingState::Block(block))
                } else {
                    StepState2::Ongoing(OngoingState::Block(block))
                }
            },
            Poll::Ready(v) => StepState2::Done(v)
        };
        *(self.1).1.lock().unwrap() = FutureContextOnce::new();
        out
    }
}

pub struct FutureStep<X,R> {
    generator: Box<Fn(&mut TaskContext,FutureContext,X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send>
}

impl<X,R> FutureStep<X,R> {
    pub fn new<T>(generator: T) -> FutureStep<X,R> where R: 'static + Send + Clone, T: Fn(&mut TaskContext,FutureContext,X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send + 'static {
        FutureStep {
            generator: Box::new(generator)
        }
    }
}

impl<X,R> Step2<X> for FutureStep<X,R> where R: 'static + Send + Clone {
    type Output = R;

    fn start(&mut self, input: X, task_control: &mut TaskContext) -> Box<dyn StepRun<Output=R>> {
        let context = FutureContext(task_control.clone(),Arc::new(Mutex::new(FutureContextOnce::new())));
        let future = (self.generator)(task_control,context.clone(),input);
        Box::new(FutureRun(future,context))
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
    use crate::step::{ RunConfig, TaskResult };
    use crate::testintegration::{ TestIntegration, TestExtractorStep };
    use crate::steps::combinators::sequencesimple::StepSequenceSimple;

    async fn tick_future(ctx: FutureContext,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
        ctx.tick(1).await;
        if let Some(finished) = finished {
            if set {
                *finished.lock().unwrap() = true;
            } else {
                assert!(!*finished.lock().unwrap());
            }
        }
        (2+x) as u32
    }

    async fn again_future(ctx: FutureContext,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
        ctx.tick(0).await;
        ctx.tick(0).await;
        if let Some(finished) = finished {
            if set {
                *finished.lock().unwrap() = true;
            } else {
                assert!(!*finished.lock().unwrap());
            }
        }
        (2+x) as u32
    }

    async fn timer_future(ctx: FutureContext, timeout: f64) -> u32 {
        ctx.timer(timeout).await;
        0
    }

    #[test]
    pub fn test_future_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let f = FutureStep::new(move |tc,ctx,x: u32| { 
            let mut tc = tc.clone();
            Box::pin(async move {
                ctx.tick(1).await;
                x+2
            })
        });
        let out = Arc::new(Mutex::new(0));
        let z = TestExtractorStep(out.clone());
        let f = StepSequenceSimple::new(f,z);
        let tc = x.add(f,2,&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(4,*out.lock().unwrap());
    }

    #[test]
    pub fn test_future_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone();
        let finished3 = finished.clone();
        let f = FutureStep::new(move |_,ctx,x: u32| {
            Box::pin(again_future(ctx,x,Some(finished2.clone()),false))
        });
        let f2 = FutureStep::new(move |_,ctx,x: u32| { 
            Box::pin(tick_future(ctx,x,Some(finished3.clone()),true))
        });
        let out = Arc::new(Mutex::new(0));
        let z = TestExtractorStep(out.clone());
        let f = StepSequenceSimple::new(f,z);
        let tc = x.add(f,2,&cfg,"test");
        let tc2 = x.add(f2,2,&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert!(tc2.peek_result() != TaskResult::Done);
        x.tick(10.);
        assert!(tc2.peek_result() == TaskResult::Done);
        assert_eq!(4,*out.lock().unwrap());
    }

    /*
    #[test]
    pub fn test_future_join() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone();
        let finished3 = finished.clone();
        let f = FutureStep::new(move |ctx,x: u32| {
            let finished2 = finished2.clone();
            Box::pin(
                async move {
                    future::join(
                        again_future(ctx.clone(),x,Some(finished2.clone()),false),
                        tick_future(ctx,x,Some(finished2.clone()),true)
                    ).await
                }
            )
        });
        let out = Arc::new(Mutex::new((0,0)));
        let z = TestExtractorStep(out.clone());
        let f = StepSequenceSimple::new(f,z);
        let tc = x.add(f,2,&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        x.tick(10.);
        assert_eq!((4,4),*out.lock().unwrap());
    }
    */

    #[test]
    pub fn test_future_timer() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone();
        let finished3 = finished.clone();
        let f = FutureStep::new(move |_,ctx,x: u32| {
            let finished2 = finished2.clone();
            Box::pin(
                async move {
                    future::join(
                        timer_future(ctx.clone(),1.),
                        tick_future(ctx,x,Some(finished2.clone()),true)
                    ).await
                }
            )
        });
        let out = Arc::new(Mutex::new((0,0)));
        let z = TestExtractorStep(out.clone());
        let f = StepSequenceSimple::new(f,z);
        let tc = x.add(f,2,&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() != TaskResult::Done);
        integration.set_time(2.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!((0,4),*out.lock().unwrap());
    }
}
