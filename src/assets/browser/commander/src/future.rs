use std::sync::{ Arc, Mutex };
use std::future::{ Future };
use std::pin::Pin;
use std::task::Poll;
use crate::block::Block;
use crate::step::{ StepState2, OngoingState };
use crate::taskcontext::TaskContext;
use futures::task::{ ArcWake, Context, waker_ref };

struct StepWaker(Mutex<Block>);

impl ArcWake for StepWaker {
    fn wake_by_ref(arc_self: &Arc<Self>) {
        arc_self.0.lock().unwrap().unblock();
    }
}

pub struct FutureRun<R>(Pin<Box<dyn Future<Output=R> + Send+Sync>>);

impl<R> FutureRun<R> {
    pub(crate) fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
        let block = control.block();
        let waker = Arc::new(StepWaker(Mutex::new(block.clone())));
        let out = match self.0.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker))) {
            Poll::Pending => StepState2::Ongoing(OngoingState::Block(block)),
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

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use async_std::task::sleep as async_sleep;
    use std::thread::sleep;
    use std::time::Duration;
    use crate::executor::Executor;
    use crate::step::{ RunConfig, TaskResult };
    use crate::testintegration::{ TestIntegration, tick_helper };
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
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let p = async move {
            let ctx3 = ctx2.clone();
            let a = Box::pin(async move {
                ctx3.tick(2).await;
                1_u32
            });
            let b = Box::pin(async move {
                tick_helper(ctx2,&[0,0,0,0,0,1]).await;
                2_u32
            });
            let x = future::select(a,b).await;
            match x {
                future::Either::Left((x,_)) => x,
                future::Either::Right((x,_)) => x
            }
        };
        let tc = x.add(p,ctx,"test");
        /* simulate */
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert_eq!(2,tc.take_result().unwrap());
        assert_eq!(2,x.get_tick_index());
    }

    async fn future_tick(ctx: TaskContext, x: u32) -> u32 {
        ctx.tick(1).await;
        x+2
    }

    #[test]
    pub fn test_future_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let ctx = x.make_context(&cfg);
        let out = Arc::new(Mutex::new(0));
        let tc = x.add(future_tick(ctx.clone(),2),ctx,"test");
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
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let tc = x.add(again_future(ctx.clone(),2,Some(finished2.clone()),false),ctx,"test");
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let tc2 = x.add(tick_future(ctx.clone(),2,Some(finished3.clone()),true),ctx,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert!(tc2.peek_result() != TaskResult::Done);
        x.tick(10.);
        assert!(tc2.peek_result() == TaskResult::Done);
        assert_eq!(4,tc.take_result().unwrap());
    }

    async fn future_timer(ctx: TaskContext, x: u32, finished: Arc<Mutex<bool>>) -> (u32,u32) {
        future::join(
            timer_future(ctx.clone(),1.),
            tick_future(ctx,x,Some(finished.clone()),true)
        ).await
    }

    #[test]
    pub fn test_future_timer() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone(); 
        let ctx = x.make_context(&cfg);       
        let tc = x.add(future_timer(ctx.clone(),2,finished),ctx,"test");
        x.tick(10.);
        assert!(tc.peek_result() != TaskResult::Done);
        integration.set_time(2.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!((0,4),tc.take_result().unwrap());
    }

    async fn timeout_smoke_helper(ctx: TaskContext, timeout: bool) -> Result<(),()> {
        let b = Box::pin(async {
            ctx.tick(if timeout {4} else {2}).await;
            Ok(())
        });
        let timeout_step = Box::pin(async {
            ctx.timer(3.).await;
            Err(())
        });
        match future::select(b,timeout_step).await {
            future::Either::Left((x,_)) => x,
            future::Either::Right((x,_)) => x,
        }
    }

    pub fn timeout_smoke(timeout: bool) {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.make_context(&cfg);
        let mut tc = x.add(timeout_smoke_helper(ctx.clone(),timeout),ctx,"test");
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
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let c = async move {
            ctx2.tick(2).await;
            ctx2.tick(1).await;
        };
        let mut tc = x.add(c,ctx,"test");
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
        let ctx = x.make_context(&cfg);
        let mut tc_short = x.add(sequence_short(ctx.clone()),ctx,"test");
        let ctx = x.make_context(&cfg);
        let mut tc_good = x.add(sequence_good(ctx.clone()),ctx,"test");
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
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let p = async move {
            let a = async {
                ctx2.tick(1).await;
                Ok::<u32,()>(5)
            };
            let b = async {
                tick_helper(ctx2.clone(),&[0,0,0,0,1]).await;
                Ok::<u32,()>(2)
            };
            let c = async {
                ctx2.timer(50.).await;
                Ok::<u32,()>(0)
            };
            future::try_join3(a,b,c).await
        };
        let mut tc = x.add(p,ctx,"test");
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
        let ctx = x.make_context(&cfg);
        let ctx2 = ctx.clone();
        let p = async move {
            let a = async {
                ctx2.tick(1).await;
                Ok(5)
            };
            let b = async {
                tick_helper(ctx2.clone(),&[0,0,0,0,1]).await;
                Err::<u32,u32>(6)
            };
            future::try_join(a,b).await
        };
        let tc = x.add(p,ctx,"test");
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        assert_eq!(Err(6),tc.take_result().unwrap());
    }
}
