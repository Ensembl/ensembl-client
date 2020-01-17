use std::sync::{ Arc, Mutex };
use std::future::{ Future };
use std::pin::Pin;
use std::task::Poll;
use crate::block::Block;
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::StepRun;
use crate::taskcontext::TaskContext;
use futures::task::{ ArcWake, Context, Waker, waker_ref };

struct FutureOneShotState {
    flag: bool,
    waker: Option<Waker>
}

#[derive(Clone)]
pub struct FutureOneShot(Arc<Mutex<FutureOneShotState>>);

impl FutureOneShot {
    pub(crate) fn new() -> FutureOneShot {
        FutureOneShot(Arc::new(Mutex::new(FutureOneShotState {
            flag: false,
            waker: None
        })))
    }

    pub(crate) fn flag(&self) {
        let mut state = self.0.lock().unwrap();
        if !state.flag {
            state.flag = true;
            if let Some(waker) = state.waker.take() {
                waker.wake();
            }
        }
    }
}

impl Future for FutureOneShot {
    type Output = ();

    fn poll(self: Pin<&mut Self>, ctx: &mut Context) -> Poll<()> {
        let mut state = self.0.lock().unwrap();
        if state.flag {
            Poll::Ready(())
        } else {
            state.waker = Some(ctx.waker().clone());
            Poll::Pending
        }
    }
}

struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

pub struct FutureRun<R>(Pin<Box<Future<Output=R> + Send+Sync>>);

impl<R> StepRun for FutureRun<R> {
    type Output = R;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
        let block = control.block();
        let waker = Arc::new(StepWaker(Mutex::new(block.clone())));
        let out = match self.0.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker))) {
            Poll::Pending => {
                StepState2::Ongoing(OngoingState::Block(block))
            },
            Poll::Ready(v) => StepState2::Done(v)
        };
        out
    }
}

impl<R> FutureRun<R> {
    pub fn new(future: Pin<Box<dyn Future<Output=R>+Send+Sync>>) -> FutureRun<R> {
        FutureRun(future)
    }
}

pub struct FutureStep<X,R> {
    generator: Box<Fn(&mut TaskContext,X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send>
}

impl<X,R> FutureStep<X,R> {
    pub fn new<T>(generator: T) -> FutureStep<X,R> where R: 'static + Send + Clone, T: Fn(&mut TaskContext,X) -> Pin<Box<Future<Output=R> + Send+Sync>> + Send + 'static {
        FutureStep {
            generator: Box::new(generator)
        }
    }
}

impl<X,R> Step2<X> for FutureStep<X,R> where R: 'static + Send + Clone {
    type Output = R;

    fn start(&mut self, input: X, task_control: &mut TaskContext) -> Box<dyn StepRun<Output=R>> {
        let future = (self.generator)(task_control,input);
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
    use crate::step::{ RunConfig, TaskResult };
    use crate::testintegration::{ TestIntegration };
    use futures::future;

    async fn tick_future(ctx: TaskContext,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
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

    async fn again_future(ctx: TaskContext,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
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

    async fn timer_future(ctx: TaskContext, timeout: f64) -> u32 {
        ctx.timer(timeout).await;
        0
    }

    #[test]
    pub fn test_first_smoke() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let p = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                let fc2 = fc.clone();
                let a = Box::pin(async move {
                    fc2.tick(2).await;
                    1_u32
                });
                let b = Box::pin(async move {
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(1).await;
                    2_u32
                });
                let x = future::select(a,b).await;
                match x {
                    future::Either::Left((x,_)) => x,
                    future::Either::Right((x,_)) => x
                }
            })
        });
        let tc = x.add(p,(),x.make_context(&cfg),"test");
        /* simulate */
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert_eq!(2,tc.take_result().unwrap());
        assert_eq!(2,x.get_tick_index());
    }

    #[test]
    pub fn test_future_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let f = FutureStep::new(move |ctx,x: u32| { 
            let mut ctx = ctx.clone();
            Box::pin(async move {
                ctx.tick(1).await;
                x+2
            })
        });
        let out = Arc::new(Mutex::new(0));
        let tc = x.add(f,2,x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(4,tc.take_result().unwrap());
    }

    #[test]
    pub fn test_future_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone();
        let finished3 = finished.clone();
        let f = FutureStep::new(move |ctx,x: u32| {
            let ctx = ctx.clone();
            Box::pin(again_future(ctx,x,Some(finished2.clone()),false))
        });
        let f2 = FutureStep::new(move |ctx,x: u32| { 
            let ctx = ctx.clone();
            Box::pin(tick_future(ctx,x,Some(finished3.clone()),true))
        });
        let out = Arc::new(Mutex::new(0));
        let tc = x.add(f,2,x.make_context(&cfg),"test");
        let tc2 = x.add(f2,2,x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert!(tc2.peek_result() != TaskResult::Done);
        x.tick(10.);
        assert!(tc2.peek_result() == TaskResult::Done);
        assert_eq!(4,tc.take_result().unwrap());
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
        let tc = x.add(f,2,&cfg,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        x.tick(10.);
        assert_eq!((4,4),tc.take_result().unwrap());
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
        let f = FutureStep::new(move |ctx,x: u32| {
            let ctx = ctx.clone();
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
        let tc = x.add(f,2,x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc.peek_result() != TaskResult::Done);
        integration.set_time(2.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!((0,4),tc.take_result().unwrap());
    }

    pub fn timeout_smoke(timeout: bool) {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let b = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                let b = Box::pin(async {
                    fc.tick(if timeout {4} else {2}).await;
                    Ok(())
                });
                let timeout_step = Box::pin(async {
                    fc.timer(3.).await;
                    Err(())
                });
                match future::select(b,timeout_step).await {
                    future::Either::Left((x,_)) => x,
                    future::Either::Right((x,_)) => x,
                }
            })
        });

        let mut tc = x.add(b,(),x.make_context(&cfg),"test");
        for i in 0..10 {
            integration.set_time(i.into());
            x.tick(10.);
        }
        assert!(tc.take_result().unwrap().is_ok() != timeout);
    }

    #[test]
    pub fn test_timer_notimeout() {
        timeout_smoke(false);
    }

    #[test]
    pub fn test_timer_timeout() {
        timeout_smoke(true);
    }

    #[test]
    pub fn test_sequencesimple_smoke() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let a : FutureStep<(),()> = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                fc.tick(2).await;
            })
        });
        let b : FutureStep<(),()> = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                fc.tick(1).await;
            })
        });

        let c = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                fc.tick(2).await;
                fc.tick(1).await;
            })
        });
        let mut tc = x.add(c,(),x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
    }

    async fn future_result<X,Y>(ctx: &TaskContext, r: Result<X,Y>) -> Result<X,Y> {
        ctx.tick(1).await;
        r
    }

    async fn sequence_short(ctx: TaskContext) -> Result<u32,()> {
        let x = future_result(&ctx,Err(())).await?;
        future_result(&ctx,Ok(2)).await
    }

    async fn sequence_good(ctx: TaskContext) -> Result<u32,()> {
        let x = future_result(&ctx,Ok(1)).await?;
        future_result(&ctx,Ok(x+2)).await
    }

    #[test]
    pub fn test_sequence() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let short = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                sequence_short(fc).await
            })
        });
        let good = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                sequence_good(fc).await
            })
        });
        let mut tc_short = x.add(short,(),x.make_context(&cfg),"test");
        let mut tc_good = x.add(good,(),x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc_short.peek_result() == TaskResult::Ongoing);
        assert!(tc_good.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc_short.peek_result() != TaskResult::Ongoing);
        assert!(tc_good.peek_result() == TaskResult::Ongoing);
        assert!(tc_short.take_result().unwrap().is_err());
        x.tick(10.);
        assert!(tc_good.peek_result() != TaskResult::Ongoing);
        assert!(tc_good.take_result().unwrap().is_ok());
    }

    #[test]
    pub fn test_parallel_smoke() {
        /* NOTE: also verifies that Again/Tick/Block trumping */
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let p = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                let a = async {
                    fc.tick(1).await;
                    Ok::<u32,()>(5)
                };
                let b = async {
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(1).await;
                    Ok::<u32,()>(2)
                };
                let c = async {
                    fc.timer(50.).await;
                    Ok::<u32,()>(0)
                };
                future::try_join3(a,b,c).await
            })
        });
        let mut tc = x.add(p,(),x.make_context(&cfg),"test");
        /* simulate */
        for i in 0..7 {
            x.tick(10.);
            assert!(tc.peek_result() == TaskResult::Ongoing);
        }
        integration.set_time(100.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(Ok((5,2,0)),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_parallel_error() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let p = FutureStep::new(move |fc,()| {
            let fc = fc.clone();
            Box::pin(async move {
                let a = async {
                    fc.tick(1).await;
                    Ok(5)
                };
                let b = async {
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(0).await;
                    fc.tick(1).await;
                    Err::<u32,u32>(6)
                };
                future::try_join(a,b).await
            })
        });
        let tc = x.add(p,(),x.make_context(&cfg),"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(Err(6),tc.take_result().unwrap());
    }
}
