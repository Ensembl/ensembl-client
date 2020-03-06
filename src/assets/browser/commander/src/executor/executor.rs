use std::future::Future;
use crate::agent::agent::Agent;
use crate::integration::integration::{ Integration, SleepQuantity };
use crate::integration::reentering::ReenteringIntegration;
use crate::task::runconfig::RunConfig;
use crate::task::slot::RunSlot;
use crate::task::task::{ KillReason, TaskSummary };
use crate::task::taskhandle::{ ExecutorTaskHandle, TaskHandle };
use super::action::Action;
use super::link::Link;
use super::request::Request;
use super::exetasks::ExecutorTasks;
use super::taskcontainer::TaskContainerHandle;
use super::timings::ExecutorTimings;

/// The main top-level object for commander, responsible for running tasks to completion.
pub struct Executor {
    timings: ExecutorTimings,
    tasks: ExecutorTasks,
    integration: ReenteringIntegration,
    actions: Link<Action>,
    requests: Link<Request>
}

impl Executor {
    /// Create new integration.
    /// 
    /// Requires an implementation of `Integration` which you supply.
    pub fn new<T>(integration: T) -> Executor where T: Integration + 'static {
        blackbox_log!("commander","Commander Executor starting");
        let integration = ReenteringIntegration::new(integration);
        Executor {
            timings: ExecutorTimings::new(&integration),
            requests: Link::new(),
            tasks: ExecutorTasks::new(),
            integration,
            actions: Link::new()
        }
    }

    pub(crate) fn get_timings(&self) -> &ExecutorTimings { &self.timings }
    pub(crate) fn get_timings_mut(&mut self) -> &mut ExecutorTimings { &mut self.timings }

    pub(crate) fn get_tasks(&self) -> &ExecutorTasks { &self.tasks }
    pub(crate) fn get_tasks_mut(&mut self) -> &mut ExecutorTasks { &mut self.tasks }

    /// Create new `RunSlot`.
    /// 
    /// A `RunSlot` can only be occupied by one task at once. If `push` is true, submission of a new
    /// task evicts the old. If `push` is false, the new submission fails.
    pub fn new_slot(&self, push: bool) -> RunSlot { RunSlot::new(push) }

    /// Return `TaskSummary` objects for all tasks currently running on this executor.
    pub fn summarize_all(&self) -> Vec<TaskSummary> {
        self.get_tasks().summarize_all()
    }

    /// Create a new `Agent` to pass to add and, if you wish, pass into your future for access to executor
    /// functionality.
    pub fn new_agent(&self, run_config: &RunConfig, name: &str) -> Agent {
        Agent::new(run_config,&self.actions,&self.requests,&self.integration,name)
    }

    /// Add given future and agent to the executor for running.
    pub fn add<R,T>(&mut self, run: T, mut agent: Agent) -> TaskHandle<R> where R: 'static, T: Future<Output=R>+'static {
        let handle = TaskHandle::new(&mut agent,Box::pin(run));
        self.try_add_task(Box::new(handle.clone()),agent);
        handle
    }

    fn try_add_task(&mut self, task: Box<dyn ExecutorTaskHandle>, agent: Agent) {
        blackbox_log!("commander","Adding task '{}' to executor",agent.get_name());
        let tasks = self.get_tasks_mut(); // shared to avoid race to slot
        if tasks.check_slot(&agent) {
            let container_handle = tasks.create_handle(&agent,task);
            tasks.use_slot(&agent,&container_handle);
            if !agent.finish_agent().finished() {
                tasks.start_task(&container_handle);
                self.integration.cause_reentry();
                blackbox_start!("commander",&self.task_key(&container_handle.clone()),"");
                if let Some(timeout) = agent.get_config().get_timeout() {
                    let agent2 = agent.clone();
                    self.get_timings_mut().add_timer(&container_handle,timeout,Box::new(move || agent2.finish(KillReason::Timeout)));
                }
            }
        } else {
            task.kill(KillReason::NotNeeded);
        }
    }

    #[allow(unused)]
    fn task_name(&self, handle: &TaskContainerHandle) -> String {
        self.get_tasks().summarize(handle).map(|x| x.make_line()).unwrap_or("".to_string())
    }

    #[allow(unused)]
    fn task_key(&self, handle: &TaskContainerHandle) -> String {
        format!("commander-elapsed-{}",self.get_tasks().summarize(handle).map(|x| x.get_name().to_string()).unwrap_or("".to_string()))
    }

    pub(crate) fn service(&mut self) {
        loop {
            let actions = self.actions.drain();
            let requests = self.requests.drain();
            if actions.len() == 0 && requests.len() == 0 { break; }
            for mut action in actions {
                match action {
                    (ref handle,Action::BlockTask()) => {
                        self.get_tasks_mut().block_task(&handle);
                    },
                    (ref _handle,Action::Unblock(ref mut block)) => {
                        block.run_unblock();
                    },
                    (ref handle,Action::UnblockTask()) => {
                        self.get_tasks_mut().unblock_task(&handle);
                    },
                    (ref handle,Action::Done()) => {
                        blackbox_log!("commander","Task '{}' finished",self.task_name(handle));
                        blackbox_end!("commander",&self.task_key(handle),"");
                        self.get_tasks_mut().remove_task(&handle);
                    }
                }
            }
            for request in requests {
                match request {
                    (_handle,Request::Create(task,agent)) => {
                        self.try_add_task(task,agent);
                    },
                    (handle,Request::Timer(timeout,callback)) => {
                        self.get_timings_mut().add_timer(&handle,timeout,callback);
                    },
                    (handle,Request::Tick(tick,callback)) => {
                        self.get_timings_mut().add_tick(&handle,tick,callback);
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

    /// Callback for executing tasks in future, called each periodic tick.
    /// 
    /// `slice` is a time which, when exceeded, causes no more tasks to run in this tick. Note that because our
    /// environment is non-preemptive, this relies on co-operation from the tasks (yielding regularly).
    pub fn tick(&mut self, slice: f64) {
        self.integration.reentering();
        self.get_timings_mut().advance_tick();
        self.get_timings().check_ticks(0);
        let now = self.run_one_tick(slice);
        blackbox_value!("commander","num-running",self.tasks.len() as f64);
        self.make_next_tick_runnable();
        self.integration.sleep(self.calculate_sleep(now));
    }
}

#[cfg(test)]
mod test {
    use blackbox::*;
    use futures::future;
    use std::collections::HashSet;
    use crate::corefutures::promisefuture::PromiseFuture;
    use crate::integration::integration::SleepQuantity;
    use crate::integration::testintegration::{ TestIntegration, tick_helper };
    use crate::task::task::{ KillReason, TaskResult };
    use super::*;

    #[test]
    pub fn test_executor_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
        };
        let handle = x.add(step,agent);
        assert!(handle.task_state() == TaskResult::Ongoing);
        x.main_step();
        assert!(handle.task_state() == TaskResult::Ongoing);
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
        let tc = x.add(step,ctx);
        integration.set_time(10.);
        x.main_step();
        assert!(tc.task_state() == TaskResult::Killed(KillReason::Timeout));
    }

    #[test]
    pub fn test_again() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.new_agent(&cfg,"name");
        let tc = x.add(tick_helper(ctx.clone(),&[0,0,0]),ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);
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
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.new_agent(&cfg,"name");
        let step = again_timeout(ctx.clone(),integration.clone());
        let tc = x.add(step,ctx);
        x.tick(2.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(2.);
        assert!(tc.task_state() == TaskResult::Done);
    }

    #[test]
    pub fn test_tick() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(20.));
        let ctx = x.new_agent(&cfg,"test");
        let tc = x.add(tick_helper(ctx.clone(),&[3]),ctx);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        x.tick(10.);
        assert!(tc.task_state() == TaskResult::Done);    
    }

    #[test]
    pub fn test_sleep_forever() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);

        let ctxa = x.new_agent(&cfg,"test");
        let ctxa2 = ctxa.clone();
        let step = async move {
            ctxa2.tick(1).await;
            PromiseFuture::<()>::new().await;
        };
        let ctxb = x.new_agent(&cfg,"test2");
        let step2 = async move {
            PromiseFuture::<()>::new().await;
        };
        let tc = x.add(step,ctxa);
        x.add(step2,ctxb);
        x.tick(2.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        assert!(SleepQuantity::None == integration.get_sleeps().remove(0));
        x.tick(2.);
        assert!(tc.task_state() == TaskResult::Ongoing);
        assert!(SleepQuantity::Forever == integration.get_sleeps().remove(0));
    }

    async fn sleep_hepler(ctx: Agent, timeout: f64) {
        ctx.timer(timeout).await;
    }

    #[test]
    pub fn test_sleep_tick() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(12.));
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let z = async move {
            ctx2.tick(3).await;
        };
        x.add(z,ctx);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::None,
        ],*integration.get_sleeps());
    }

    #[test]
    pub fn test_reenter_on_add() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(12.));
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let z = async move {
            ctx2.tick(3).await;
        };
        x.tick(10.);
        x.add(z,ctx);
        assert_eq!(vec![
            SleepQuantity::Forever,
            SleepQuantity::None,
        ],*integration.get_sleeps());

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
        x.add(z,ctx.clone());
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
            SleepQuantity::None,
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
        x.add(step,ctx);
        x.tick(10.); /* (Block) time_at_end = 1 => sleep 9 */
        integration.set_time(11.);
        x.tick(10.);
        assert_eq!(vec![
            SleepQuantity::None,
            SleepQuantity::Time(10.),
            SleepQuantity::None
        ],*integration.get_sleeps());
        x.tick(10.); /* (Done) => Expiry => Forever */
        assert_eq!(vec![
            SleepQuantity::None,
            SleepQuantity::Time(10.),
            SleepQuantity::None,
            SleepQuantity::Forever
        ],*integration.get_sleeps());

    }

    #[test]
    pub fn test_forever() {
        /* setup */
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fos = PromiseFuture::new();
        let fos2 = fos.clone();
        let ctx = x.new_agent(&cfg,"test");
        x.add(async {
            fos2.await;
        },ctx);
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        x.tick(1.);
        fos.satisfy(());
        assert_eq!(vec![SleepQuantity::None,SleepQuantity::Forever,SleepQuantity::None],*integration.get_sleeps());
    }

    #[allow(unused_must_use)]
    #[test]
    pub fn test_sleep_algorithm() {
        /* setup */
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let fosa = PromiseFuture::new();
        let fosa2 = fosa.clone();
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let step = async move {
            fosa2.await;
            tick_helper(ctx2.clone(),&[0,1,1]).await;
            ctx2.timer(3.);
            PromiseFuture::<()>::new().await;
        };
        x.add(step,ctx);
        /* simulate */
        /* none runnable, none next-tick, no timers => Forever */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Forever);
        /* runnable => None */
        fosa.satisfy(());
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* next tick => None */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::None);
        /* timer => None, Time(3) */
        x.tick(1.);
        assert_eq!(x.calculate_sleep(0.),SleepQuantity::Time(3.));
    }

    #[allow(unused_must_use)]
    #[test]
    pub fn test_timeout_delta() {
        /* setup */
        let integration = TestIntegration::new();
        let mut integration2 = integration.clone();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,Some(5.)); /* time=0; SleepQuantity::Time(5.) */

        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let os1 = PromiseFuture::new();
        let os1b = os1.clone();
        let step = async move {
            integration2.set_time(1.);
            os1b.await;
            ctx2.timer(2.);
            PromiseFuture::<()>::new().await;
        };
        x.add(step,ctx);
        /* simulate */
        x.tick(10.); /* (Block) time=1 on exit => task-timout=5 => delta = 4. ==>> SleepQuantity::Time(4.) */
        assert_eq!(1.,integration.get_time());
        os1.satisfy(());
        x.tick(10.); /* (Block) time=1 on entry and exit => +2  ==>> SleepQuantity::Time(2.) */
        assert_eq!(1.,integration.get_time());
        /* verify */
        assert_eq!(vec![
            SleepQuantity::None,
            SleepQuantity::Time(4.),
            SleepQuantity::None,
            SleepQuantity::Time(2.)],
            *integration.get_sleeps());
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
            let b = async { 
                tick_helper(ctx2.clone(),&[0,0,0,0,1]).await;
                Ok::<u64,()>(ctx2.get_tick_index())
            };
            future::join(a,b).await
        };
        let tc = x.add(p,ctx);
        /* simulate */
        for _ in 0..7 {
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
        let tc = x.add(p,ctx);
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
        assert!(tc.task_state() == TaskResult::Done);
        x.tick(10.);
        assert_eq!((Ok(6),Ok(3)),tc.take_result().unwrap());
    }

    #[test]
    pub fn test_executor_name() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"first-name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(0).await;
            agent2.set_name("second-name");
        };
        let handle = x.add(step,agent);
        assert_eq!("first-name",handle.get_name());
        x.main_step();
        x.main_step();
        assert_eq!("second-name",handle.get_name());
    }

    #[test]
    pub fn test_summary() {
        let integration = TestIntegration::new();
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
        let handle = x.add(step,agent);
        x.tick(1.);
        x.tick(1.);
        let summary = handle.summary().unwrap();
        assert_eq!(2,summary.identity());
        assert_eq!("name",summary.get_name());
        assert_eq!(&vec!["test".to_string()],summary.get_waits());
    }

    #[test]
    pub fn test_all_summaries() {
        let integration = TestIntegration::new();
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
        let integration = TestIntegration::new();
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
        assert_eq!(TaskResult::Killed(KillReason::Cancelled),handles[1].task_state());
        assert_eq!(1,x.summarize_all().iter().map(|x| x.identity()).filter(|x| *x==3).count());
        assert_eq!(2,handles[0].summarize().unwrap().identity());
        x.tick(1.);
        assert_eq!(0,x.summarize_all().iter().map(|x| x.identity()).filter(|x| *x==3).count());
    }

    #[test]
    pub fn test_blackbox() {
        /* configure blackbox */
        if !blackbox_enabled!() { return; }
        let mut ign = SimpleIntegration::new("commander");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("commander");
        /* on with the test */
        let integration = TestIntegration::new();
        let mut ign2 = ign.clone();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test-task");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(1).await;
            let agent3 = agent2.clone();
            agent2.named_wait(async move {
                ign2.tick();
                agent3.tick(1).await;
            },"test").await;
            let agentb = agent2.new_agent(None,"task2");
            let agentb2 = agentb.clone();
            agent2.add(async move {
                agentb2.tick(1).await;
            },agentb);
            agent2.tick(3).await;
        };
        x.add(step,agent);
        for _ in 0..10 {
            x.tick(1.);
            ign.tick();
        }
        let all_lines = blackbox_take_lines().join("\n");
        assert!(all_lines.contains("Commander Executor starting"));
        assert!(all_lines.contains("Adding task 'test-task' to executor"));
        assert!(all_lines.contains("commander-run-task2: num=2"));

        assert!(all_lines.contains("commander-elapsed-test-task: num=1"));
        assert!(all_lines.contains("commander-elapsed-task2: num=1"));
        assert!(all_lines.contains("commander-run-test-task: num=4"));
        assert!(all_lines.contains("num=4 total=1.00units"));
        assert!(all_lines.contains("num=1 total=6.00units"));
        assert!(all_lines.contains("[11][commander] commander-run-test-task"));
    }
}
