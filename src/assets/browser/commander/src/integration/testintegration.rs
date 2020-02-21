use std::sync::{ Arc, Mutex, MutexGuard };
use crate::agent::agent::Agent;
use crate::integration::integration::{ Integration, SleepQuantity };

/* TestIntegration is the integration used in unit tests. The time can be set
 * and retrieved, and the current sleep setting retrieved.
 * 
 * Additional odds-and-ends are also here such as a method to schedule a
 * range of ticks.
 */

#[derive(Clone)]
pub struct TestIntegration {
    timer: Arc<Mutex<f64>>,
    sleeps: Arc<Mutex<Vec<SleepQuantity>>>
}

impl TestIntegration {
    pub(crate) fn new() -> TestIntegration {
        TestIntegration {
            timer: Arc::new(Mutex::new(0.)),
            sleeps: Arc::new(Mutex::new(vec![]))
        }
    }

    pub(crate) fn get_time(&self) -> f64 { *self.timer.lock().unwrap() }
    pub(crate) fn set_time(&mut self, t: f64) { *self.timer.lock().unwrap() = t; }

    pub(crate) fn get_sleeps(&self) -> MutexGuard<Vec<SleepQuantity>> { self.sleeps.lock().unwrap() }
}

impl Integration for TestIntegration {
    fn current_time(&self) -> f64 {*self.timer.lock().unwrap() }
    fn sleep(&self, quantity: SleepQuantity) { self.sleeps.lock().unwrap().push(quantity); }
}

pub async fn tick_helper(ctx: Agent, ticks: &[u64]) {
    for tick in ticks {
        ctx.tick(*tick).await;
    }
}

#[cfg(test)]
mod test {
    use futures::future;
    use crate::executor::executor::Executor;
    use crate::task::runconfig::RunConfig;
    use crate::task::task::TaskResult;
    use super::*;

    async fn tick_future(ctx: Agent,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
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

    async fn again_future(ctx: Agent,x: u32, finished: Option<Arc<Mutex<bool>>>, set: bool) -> u32 {
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

    async fn timer_future(ctx: Agent, timeout: f64) -> u32 {
        ctx.timer(timeout).await;
        0
    }

    #[test]
    pub fn test_first_smoke() {
        /* setup */
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
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
        let tc = x.add(p,ctx);
        /* simulate */
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert_eq!(2,tc.take_result().unwrap());
        assert_eq!(2,x.get_timings_mut().get_tick_index());
    }

    async fn future_tick(ctx: Agent, x: u32) -> u32 {
        ctx.tick(1).await;
        x+2
    }

    #[test]
    pub fn test_future_tick() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
        let tc = x.add(future_tick(ctx.clone(),2),ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert_eq!(4,tc.take_result().unwrap());
    }


    #[test]
    pub fn test_future_again() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let finished = Arc::new(Mutex::new(false));
        let finished2 = finished.clone();
        let finished3 = finished.clone();
        let ctx = x.new_agent(&cfg,"test");
        let tc = x.add(again_future(ctx.clone(),2,Some(finished2.clone()),false),ctx);
        let ctx = x.new_agent(&cfg,"test");
        let tc2 = x.add(tick_future(ctx.clone(),2,Some(finished3.clone()),true),ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert!(tc2.task_state() != TaskResult::Done);
        x.tick(10.);
        assert!(tc2.task_state() == TaskResult::Done);
        assert_eq!(4,tc.take_result().unwrap());
    }

    async fn future_timer(ctx: Agent, x: u32, finished: Arc<Mutex<bool>>) -> (u32,u32) {
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
        let ctx = x.new_agent(&cfg,"test");       
        let tc = x.add(future_timer(ctx.clone(),2,finished),ctx);
        x.tick(10.);
        assert!(tc.task_state() != TaskResult::Done);
        integration.set_time(2.);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert_eq!((0,4),tc.take_result().unwrap());
    }

    async fn timeout_smoke_helper(ctx: Agent, timeout: bool) -> Result<(),()> {
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
        let ctx = x.new_agent(&cfg,"test");
        let tc = x.add(timeout_smoke_helper(ctx.clone(),timeout),ctx);
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
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let c = async move {
            ctx2.tick(2).await;
            ctx2.tick(1).await;
        };
        let tc = x.add(c,ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
    }

    async fn future_result<X,Y>(ctx: &Agent, r: Result<X,Y>) -> Result<X,Y> {
        ctx.tick(1).await;
        r
    }

    async fn sequence_short(ctx: Agent) -> Result<u32,()> {
        future_result(&ctx,Err(())).await?;
        future_result(&ctx,Ok(2)).await
    }

    async fn sequence_good(ctx: Agent) -> Result<u32,()> {
        let x = future_result(&ctx,Ok(1)).await?;
        future_result(&ctx,Ok(x+2)).await
    }

    #[test]
    pub fn test_sequence() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
        let tc_short = x.add(sequence_short(ctx.clone()),ctx);
        let ctx = x.new_agent(&cfg,"test");
        let tc_good = x.add(sequence_good(ctx.clone()),ctx);
        x.tick(10.);
        assert!(tc_short.task_state() == TaskResult::Ongoing);
        assert!(tc_good.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc_short.task_state() != TaskResult::Ongoing);
        assert!(tc_good.task_state() == TaskResult::Ongoing);
        assert!(tc_short.take_result().unwrap().is_err());
        x.tick(10.);
        assert!(tc_good.task_state() != TaskResult::Ongoing);
        assert!(tc_good.take_result().unwrap().is_ok());
    }

    #[test]
    pub fn test_parallel_smoke() {
        /* NOTE: also verifies that Again/Tick/Block trumping */
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
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
        let tc = x.add(p,ctx);
        /* simulate */
        for _ in 0..7 {
            x.tick(10.);
            assert!(tc.task_state() == TaskResult::Ongoing);
        }
        integration.set_time(100.);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert_eq!(Ok((5,2,0)),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_parallel_error() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let p = async move {
            let a = async {
                ctx2.tick(1).await;
                Ok::<u32,u32>(5)
            };
            let b = async {
                tick_helper(ctx2.clone(),&[0,0,0,0,1]).await;
                Err::<u32,u32>(6)
            };
            future::try_join(a,b).await
        };
        let tc = x.add(p,ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
        assert_eq!(Err(6),tc.take_result().unwrap());
    }
}