use std::future::Future;
use super::exetasks::ExecutorTasks;
use super::timings::ExecutorTimings;
use super::action::{ Action, ActionLink };
use crate::integration::integration::{ Integration, SleepQuantity };
use crate::integration::reentering::ReenteringIntegration;
use crate::agent::agent::Agent;
use crate::task::slot::RunSlot;
use crate::task::runconfig::RunConfig;
use crate::task::task::{ KillReason, TaskSummary };
use crate::task::taskhandle::{ ExecutorTaskHandle, TaskHandle };

pub struct Executor {
    timings: ExecutorTimings,
    tasks: ExecutorTasks,
    integration: ReenteringIntegration,
    actions: ActionLink
}

impl Executor {
    pub fn new<T>(integration: T) -> Executor where T: Integration + 'static {
        let integration = ReenteringIntegration::new(integration);
        Executor {
            timings: ExecutorTimings::new(&integration),
            tasks: ExecutorTasks::new(),
            integration,
            actions: ActionLink::new()
        }
    }

    pub(crate) fn get_timings(&self) -> &ExecutorTimings { &self.timings }
    pub(crate) fn get_timings_mut(&mut self) -> &mut ExecutorTimings { &mut self.timings }

    pub(crate) fn get_tasks(&self) -> &ExecutorTasks { &self.tasks }
    pub(crate) fn get_tasks_mut(&mut self) -> &mut ExecutorTasks { &mut self.tasks }


    pub fn new_slot(&self, push: bool) -> RunSlot { RunSlot::new(push) }

    pub fn new_agent(&self, run_config: &RunConfig, name: &str) -> Agent {
        Agent::new(run_config,&self.actions,&self.integration,name)
    }

    pub fn summarize_all(&self) -> Vec<TaskSummary> {
        self.get_tasks().summarize_all()
    }

    pub fn add<R,T>(&mut self, run: T, mut agent: Agent) -> TaskHandle<R> where R: 'static+Send, T: Future<Output=R>+'static+Send {
        let handle = TaskHandle::new(&mut agent,Box::pin(run));
        self.try_add_task(Box::new(handle.clone()),agent);
        handle
    }

    // XXX if not already killed
    fn try_add_task(&mut self, handle: Box<dyn ExecutorTaskHandle>, agent: Agent) {
        if self.get_tasks_mut().check_slot(&agent) {
            let container_handle = self.get_tasks_mut().create_handle(&agent,handle);
            self.get_tasks_mut().use_slot(&agent,&container_handle);
            if let Some(timeout) = agent.get_config().get_timeout() {
                let agent2 = agent.clone();
                self.get_timings_mut().add_timer(&container_handle,timeout,Box::new(move || agent2.finish(KillReason::Timeout)));
            }
            self.get_tasks_mut().unblock_task(&container_handle);
        } else {
            handle.kill(KillReason::NotNeeded);
        }
    }

    pub(crate) fn service(&mut self) {
        loop {
            let actions = self.actions.drain_actions();
            if actions.len() == 0 { break; }
            for mut action in actions {
                match action {
                    (ref handle,Action::BlockTask()) => {
                        self.get_tasks_mut().block_task(&handle);
                    },
                    (ref _handle,Action::Unblock(ref mut block)) => {
                        block.run_unblock();
                    },
                    (handle,Action::UnblockTask()) => {
                        self.get_tasks_mut().unblock_task(&handle);
                    },
                    (handle,Action::Done()) => {
                        self.get_tasks_mut().remove_task(&handle);
                    },
                    (handle,Action::Timer(timeout,callback)) => {
                        self.get_timings_mut().add_timer(&handle,timeout,callback);
                    },
                    (handle,Action::Tick(tick,callback)) => {
                        self.get_timings_mut().add_tick(&handle,tick,callback);
                    },
                    (_handle,Action::Create(task,agent)) => {
                        self.try_add_task(task,agent);
                    }
                }
            }
        }
    }

    fn main_step(&mut self) -> bool {
        self.get_tasks().check_timers(self.get_timings());
        self.service();
        let tick = self.get_timings().get_tick_index();
        let out = self.get_tasks_mut().execute(tick);
        self.service();
        out
    }

    fn run_one_tick(&mut self, slice: f64) -> f64 {
        let mut now = self.integration.current_time();
        let expiry = now+slice;
        loop {
            if !self.main_step() { break; }
            now = self.integration.current_time();
            if now >= expiry { break; }
        }
        now
    }

    fn calculate_sleep(&self, now: f64) -> SleepQuantity {
        if self.get_tasks().any_runnable() {
            SleepQuantity::None            
        } else {
            self.get_timings().calculate_sleep(now)
        }
    }

    fn make_next_tick_runnable(&mut self) {
        /* advance to next tick and service, to make sure runnable are marked as such */
        self.get_timings().check_ticks(1);
        self.service();
    }

    pub fn tick(&mut self, slice: f64) {
        self.integration.reentering();
        self.get_timings_mut().advance_tick();
        self.get_timings().check_ticks(0);
        let now = self.run_one_tick(slice);
        self.make_next_tick_runnable();
        self.integration.sleep(self.calculate_sleep(now));
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use std::collections::HashSet;
    use std::sync::{ Arc, Mutex };
    use crate::task::task::{ KillReason, TaskResult };
    use crate::integration::integration::SleepQuantity;
    use crate::integration::testintegration::{ TestIntegration, tick_helper };
    use crate::helper::flagfuture::FlagFuture;
    use futures::future;

    #[test]
    pub fn test_executor_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
        };
        let mut handle = x.add(step,agent);
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.main_step();
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.main_step();
        assert!(handle.get_agent().finish_agent().finishing());
        assert!(!x.main_step());
    }

    #[test]
    pub fn test_executor_doom() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(1.));
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            ctx2.tick(2).await;
        };
        let mut tc = x.add(step,ctx);
        integration.set_time(10.);
        x.main_step();
        assert!(tc.peek_result() == TaskResult::Killed(KillReason::Timeout));
    }

    #[test]
    pub fn test_again() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.new_agent(&cfg,"name");
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
        let ctx = x.new_agent(&cfg,"name");
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
        let ctx = x.new_agent(&cfg,"test");
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

        let ctxa = x.new_agent(&cfg,"test");
        let ctxa2 = ctxa.clone();
        let step = async move {
            ctxa2.tick(1).await;
            FlagFuture::new().await;
        };
        let ctxb = x.new_agent(&cfg,"test2");
        let step2 = async move {
            FlagFuture::new().await;
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
        let ctx = x.new_agent(&cfg,"test");
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
        let ctx = x.new_agent(&cfg,"test");
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
    pub fn test_forever() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = FlagFuture::new();
        let fos2 = fos.clone();
        let ctx = x.new_agent(&cfg,"test");
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
        let fosa = FlagFuture::new();
        let fosa2 = fosa.clone();
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            fosa2.await;
            tick_helper(ctx2.clone(),&[0,1,1]).await;
            ctx2.timer(3.);
            FlagFuture::new().await;
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

        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let mut os1 = FlagFuture::new();
        let os1b = os1.clone();
        let step = async move {
            integration2.set_time(1.);
            os1b.await;
            ctx2.timer(2.);
            FlagFuture::new().await;
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
        let ctx = x.new_agent(&cfg,"test");
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
        let ctx = x.new_agent(&cfg,"test");
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
        let agent = x.new_agent(&cfg,"first-name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
            agent2.set_name("second-name");
        };
        let mut handle = x.add(step,agent);
        assert_eq!("first-name",handle.get_name());
        x.main_step();
        x.main_step();
        assert_eq!("second-name",handle.get_name());
    }

    #[test]
    pub fn test_summary() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"name");
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
        let summary = handle.summary().unwrap();
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
                let agent = x.new_agent(&cfg,&name);
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

    #[test]
    pub fn test_kill() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut handles = vec![];
        for i in 0..3 {
            let name = format!("name-{}",i);
            let agent = x.new_agent(&cfg,&name);
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
        handles[1].kill(KillReason::Cancelled);
        assert_eq!(TaskResult::Killed(KillReason::Cancelled),handles[1].peek_result());
        assert_eq!(1,x.summarize_all().iter().map(|x| x.identity()).filter(|x| *x==3).count());
        x.tick(1.);
        assert_eq!(0,x.summarize_all().iter().map(|x| x.identity()).filter(|x| *x==3).count());
    }
}
