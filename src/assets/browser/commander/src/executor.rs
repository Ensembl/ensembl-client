use std::future::Future;
use hashbrown::HashMap;
use ordered_float::OrderedFloat;
use crate::block::Block;
use crate::action::{ Action, ActionLink };
use crate::integration::{ CommanderIntegration2, ReenteringIntegration, SleepQuantity };
use crate::taskcontainer::{ TaskContainer, TaskContainerHandle };
use crate::timer::TimerSet;
use crate::runnable::Runnable;
use crate::agent::Agent;
use crate::step::RunConfig;
use crate::task::{ TaskHandle, KillReason, TaskSummary };

pub struct Executor {
    integration: ReenteringIntegration,
    tasks: TaskContainer,
    runnable: Runnable,
    actions: ActionLink,
    timers: TimerSet<OrderedFloat<f64>,Option<TaskContainerHandle>>,
    ticks: TimerSet<u64,Option<TaskContainerHandle>>,
    blocked_by: HashMap<TaskContainerHandle,Block>,
    tick_index: u64,
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: CommanderIntegration2 + 'static {
        Executor {
            integration: ReenteringIntegration::new(integration),
            tasks: TaskContainer::new(),
            runnable: Runnable::new(),
            actions: ActionLink::new(),
            timers: TimerSet::new(),
            ticks: TimerSet::new(),
            blocked_by: HashMap::new(),
            tick_index: 0
        }
    }

    pub fn get_tick_index(&self) -> u64 { self.tick_index }

    pub fn make_context(&self, run_config: &RunConfig, name: &str) -> Agent {
        Agent::new(run_config,&self.actions,&self.integration,name)
    }

    pub fn add<R,T>(&mut self, run: T, mut context: Agent) -> TaskHandle<R> where R: 'static, T: Future<Output=R>+'static {
        let now = self.integration.current_time();
        let container_handle = self.tasks.allocate();
        context.register(&container_handle);
        let handle = TaskHandle::new(&mut context,Box::pin(run),container_handle.identity());
        self.tasks.set(&container_handle,handle.clone());
        if let Some(timeout) = context.get_config().get_timeout() {
            let control = context.clone();
            self.timers.add(Some(container_handle.clone()),OrderedFloat(now+timeout),move || control.finish(Some(&KillReason::Timeout)));
        }
        self.runnable.add(&self.tasks,&container_handle);
        handle
    }

    pub fn summarize_all(&self) -> Vec<TaskSummary> {
        let mut out = vec![];
        for th in self.tasks.all_handles().to_vec().iter() {
            if let Some(t) = self.tasks.get(th) {
                out.push(t.summarize());
            }
        }
        out
    }

    fn remove(&mut self, handle: &TaskContainerHandle) {
        self.runnable.remove(&self.tasks,handle);
        self.blocked_by.remove(&handle);
        self.tasks.remove(handle);
    }

    fn add_timer(&mut self, handle: &TaskContainerHandle, timeout: f64, callback: Box<dyn FnMut() + Send + 'static>) {
        let now = self.integration.current_time();
        self.timers.add(Some(handle.clone()),OrderedFloat(now+timeout),callback);
    }

    pub(crate) fn run_actions(&mut self) {
        for mut action in self.actions.drain() {
            match action {
                Action::Block(ref handle,ref block) => {
                    self.runnable.remove(&self.tasks,&handle);
                    self.blocked_by.insert(handle.clone(),block.clone());
                },
                Action::Unblock(ref handle,ref mut block) => {
                    block.unblock_real();
                    if let Some(blocked_by) = self.blocked_by.get(handle) {
                        if blocked_by == block {
                            self.blocked_by.remove(handle);
                            self.runnable.add(&self.tasks,handle);
                        }
                    }
                },
                Action::Done(handle) => {
                    self.remove(&handle);
                },
                Action::Timer(handle,timeout,callback) => {
                    self.add_timer(&handle,timeout,callback);
                },
                Action::Tick(handle,tick,callback) => {
                    self.ticks.add(Some(handle.clone()),tick,callback);
                }
            }
        }
    }

    pub(crate) fn check_timers(&mut self,now: f64) {
        let (timers,ticks,tasks) = (&mut self.timers,&mut self.ticks,&mut self.tasks);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        ticks.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        self.timers.check(OrderedFloat(now));
        self.ticks.check(self.tick_index);
    }

    fn run(&mut self) -> bool {
        let now = self.integration.current_time();
        self.check_timers(now);
        self.run_actions();
        let out = self.runnable.run(&mut self.tasks,self.tick_index);
        self.run_actions();
        out
    }

    fn calculate_sleep(&mut self, now: f64) -> SleepQuantity {
        if self.runnable.empty() {
            if let Some(timer) = self.timers.min() {
                SleepQuantity::Time(timer.0-now)
            } else {
                SleepQuantity::Forever
            }
        } else {
            SleepQuantity::None
        }
    }

    pub fn tick(&mut self, slice: f64) {
        self.integration.reentering();
        let mut now = self.integration.current_time();
        let expiry = now+slice;
        self.tick_index += 1;
        self.ticks.check(self.tick_index);        
        /* main tick loop */
        loop {
            if !self.run() { break; }
            now = self.integration.current_time();
            if now >= expiry { break; }
        }
        /* these ensure tick sleeps make it through before we calculate sleep */
        self.ticks.check(self.tick_index+1);
        self.run_actions();
        let sleep = self.calculate_sleep(now);
        self.integration.sleep(sleep);
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use std::collections::HashSet;
    use std::sync::{ Arc, Mutex };
    use crate::task::{ KillReason, TaskResult };
    use crate::integration::SleepQuantity;
    use crate::testintegration::{ TestIntegration, tick_helper };
    use crate::oneshot::OneShot;
    use futures::future;

    #[test]
    pub fn test_executor_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.make_context(&cfg,"test");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
        };
        let mut handle = x.add(step,agent);
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.run();
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.run();
        assert!(handle.get_agent().is_finished());
        assert!(!x.run());
    }

    #[test]
    pub fn test_executor_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = OneShot::new();
        let fos2 = fos.clone();
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.tick(2).await;
            fos2.await;
        };
        let mut tc = x.add(step,ctx);
        x.tick(10.);
        x.tick(10.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        fos.flag();
        assert_eq!(1,x.tasks.len());
        x.tick(10.);
        x.tick(10.);
        assert_eq!(0,x.tasks.len());
    }

    #[test]
    pub fn test_executor_doom() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(1.));
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.tick(2).await;
        };
        let mut tc = x.add(step,ctx);
        integration.set_time(10.);
        x.run();
        assert!(tc.peek_result() == TaskResult::Killed(KillReason::Timeout));
    }

    #[test]
    pub fn test_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.make_context(&cfg,"name");
        let mut tc = x.add(tick_helper(ctx.clone(),&[0,0,0]),ctx);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
    }

    async fn again_timeout(ctx: Agent, mut integration: TestIntegration) {
        ctx.tick(0).await;
        integration.set_time(1.);
        ctx.tick(0).await;
        integration.set_time(2.);
        ctx.tick(0).await;
        integration.set_time(3.); 
    }

    #[test]
    pub fn test_again_timeout() {
        let mut integration = TestIntegration::new();
        let integration2 = integration.clone();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.make_context(&cfg,"name");
        let step = again_timeout(ctx.clone(),integration.clone());
        let mut tc = x.add(step,ctx);
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Done);
    }

    #[test]
    pub fn test_tick() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.make_context(&cfg,"test");
        let mut tc = x.add(tick_helper(ctx.clone(),&[3]),ctx);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);    
    }

    #[test]
    pub fn test_sleep_forever() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let ctxa = x.make_context(&cfg,"test");
        let ctxa2 = ctxa.clone();
        let step = async move {
            ctxa2.tick(1).await;
            OneShot::new().await;
        };
        let ctxb = x.make_context(&cfg,"test2");
        let step2 = async move {
            OneShot::new().await;
        };
        let mut tc = x.add(step,ctxa);
        let mut tc2 = x.add(step2,ctxb);
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(SleepQuantity::None == integration.get_sleeps().remove(0));
        x.tick(2.);
        assert!(tc.peek_result() == TaskResult::Ongoing);
        assert!(SleepQuantity::Forever == integration.get_sleeps().remove(0));
    }

    async fn sleep_hepler(ctx: Agent, timeout: f64) {
        ctx.timer(timeout).await;
    }

    #[test]
    pub fn test_sleep_time() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(12.));
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let z = async move {
            future::join(sleep_hepler(ctx2.clone(),5.),
                         sleep_hepler(ctx2.clone(),21.)).await
        };
        /* drop success */
        let mut tc = x.add(z,ctx.clone());
        x.tick(10.);
        integration.set_time(5.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(10.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(12.);
        x.tick(10.);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::Time(5.),
            SleepQuantity::None,
            SleepQuantity::Time(7.),
            SleepQuantity::Time(2.),
            SleepQuantity::Time(2.),
            SleepQuantity::None,
            SleepQuantity::Forever,
        ],*integration.get_sleeps());
    }

    #[test]
    pub fn test_timer_death() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(10.));
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.timer(10.).await;
            ()
        };
        let mut tc = x.add(step,ctx);
        x.tick(10.); /* (Block) time_at_end = 1 => sleep 9 */
        integration.set_time(11.);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::Time(10.),
            SleepQuantity::None
        ],*integration.get_sleeps());
        x.tick(10.); /* (Done) => Expiry => Forever */
        assert_eq!(vec![
            SleepQuantity::Time(10.),
            SleepQuantity::None,
            SleepQuantity::Forever
        ],*integration.get_sleeps());

    }

    #[test]
    pub fn test_oneshot() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = OneShot::new();
        let fos2 = fos.clone();
        let ctx = x.make_context(&cfg,"test");
        let mut tx = x.add(async {
            fos2.await;
        },ctx);
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        x.tick(1.);
        fos.flag();
        assert_eq!(vec![SleepQuantity::Forever,SleepQuantity::None],*integration.get_sleeps());
    }

    #[test]
    pub fn test_sleep_algorithm() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fosa = OneShot::new();
        let fosa2 = fosa.clone();
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            fosa2.await;
            tick_helper(ctx2.clone(),&[0,1,1]).await;
            ctx2.timer(3.);
            OneShot::new().await;
        };
        let mut tc = x.add(step,ctx);
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Forever);
        /* runnable => None */
        fosa.flag();
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* next tick => None */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* timer => None, Time(3) */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Time(3.));
    }

    #[test]
    pub fn test_timeout_delta() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut integration2 = integration.clone();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(5.)); /* time=0; SleepQuantity::Time(5.) */

        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let mut os1 = OneShot::new();
        let os1b = os1.clone();
        let step = async move {
            integration2.set_time(1.);
            os1b.await;
            ctx2.timer(2.);
            OneShot::new().await;
        };
        let tx = x.add(step,ctx);
        /* simulate */
        x.tick(10.); /* (Block) time=1 on exit => task-timout=5 => delta = 4. ==>> SleepQuantity::Time(4.) */
        assert_eq!(1.,integration.get_time());
        os1.flag();
        x.tick(10.); /* (Block) time=1 on entry and exit => +2  ==>> SleepQuantity::Time(2.) */
        assert_eq!(1.,integration.get_time());
        /* verify */
        assert_eq!(vec![SleepQuantity::Time(4.),SleepQuantity::None,SleepQuantity::Time(2.)],*integration.get_sleeps());
    }

    #[test]
    pub fn test_shorting_again_tick() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let p = async move { 
            let a = async {
                tick_helper(ctx2.clone(),&[4]).await;
                Ok::<u64,()>(ctx2.get_tick_index())
            };
            let mut b = async { 
                tick_helper(ctx2.clone(),&[0,0,0,0,1]).await;
                Ok::<u64,()>(ctx2.get_tick_index())
            };
            future::join(a,b).await
        };
        let tc = x.add(p,ctx);
        /* simulate */
        for i in 0..7 {
            x.tick(10.);
            integration.set_time(integration.get_time()+1.);
        }
        assert_eq!((Ok(5),Ok(2)),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_shorting_block() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.make_context(&cfg,"test");
        let ctx2 = ctx.clone();
        let p = async move {
            let a = async {
                ctx2.timer(8.).await;
                Ok::<u64,()>(ctx2.get_tick_index())
            };
            let b = async {
                tick_helper(ctx2.clone(),&[0,0,1,0,0,1,0]).await;
                Ok::<u64,()>(ctx2.get_tick_index())
            };
            future::join(a,b).await
        };
        let mut tc = x.add(p,ctx);
        /* simulate */
        x.tick(10.);
        x.tick(10.);
        integration.set_time(3.);
        x.tick(10.);
        x.tick(10.);
        integration.set_time(7.);
        x.tick(10.);
        integration.set_time(8.);
        x.tick(10.);
        integration.set_time(9.);
        x.tick(10.);
        assert!(tc.peek_result() == TaskResult::Done);
        x.tick(10.);
        assert_eq!((Ok(6),Ok(3)),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_executor_name() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.make_context(&cfg,"first-name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
            agent2.set_name("second-name");
        };
        let mut handle = x.add(step,agent);
        assert_eq!("first-name",handle.get_name());
        x.run();
        x.run();
        assert_eq!("second-name",handle.get_name());
    }

    #[test]
    pub fn test_summary() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.make_context(&cfg,"name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(1).await;
            let agent3 = agent2.clone();
            agent2.named_wait(async move {
                agent3.tick(1).await;
            },"test").await;
            agent2.tick(1).await;
        };
        let mut handle = x.add(step,agent);
        x.tick(1.);
        x.tick(1.);
        let summary = handle.summary();
        assert_eq!(2,summary.identity());
        assert_eq!("name",summary.get_name());
        assert_eq!(&vec!["test".to_string()],summary.get_waits());
    }

    #[test]
    pub fn test_all_summaries() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut handles = vec![];
        for j in 0..3 {
            for i in 0..5 {
                let name = format!("name-{}",j*5+i);
                let agent = x.make_context(&cfg,&name);
                let agent2 = agent.clone();
                let step = async move {
                    agent2.tick(1).await;
                    let agent3 = agent2.clone();
                    agent2.named_wait(async move {
                        agent3.tick(1).await;
                    },"test").await;
                };
                handles.push(x.add(step,agent));
            }
            x.tick(1.);
        }
        print!("{:?}",x.summarize_all());
        let mut expected = HashSet::new();
        for i in 6..17 {
            expected.insert(i);
        }
        for summary in x.summarize_all() {
            let id = summary.identity();
            let match_name = format!("name-{}",id-2);
            assert_eq!(summary.get_name(),match_name);
            let waits = if id < 12 { vec!["test".to_string()] } else { vec![] };
            assert_eq!(&waits,summary.get_waits());
            assert!(expected.contains(&id));
            expected.remove(&id);
        }
    }
}
