/* An agent provides methods on behalf of an Executor within a future. */

use hashbrown::HashSet;
use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };

use crate::task::block::Block;
use crate::executor::action::{ Action, ActionLink, TaskActionLink };
use crate::integration::reentering::ReenteringIntegration;
use crate::helper::named::{ NamedWait, NamedFuture };
use crate::task::runconfig::RunConfig;
use crate::executor::taskcontainer::TaskContainerHandle;
use crate::helper::turnstile::TurnstileFuture;
use crate::task::task::KillReason;
use crate::task::taskhandle::TaskHandle;
use crate::helper::tidier::Tidier;
use crate::helper::flagfuture::FlagFuture;
use std::task::Poll;
use futures::task::{ Context, waker_ref };
use owning_ref::MutexGuardRefMut;

// BlockAgent
// FinishAgent
// NameAgent
// Run

pub(crate) struct BlockAgent {
    blocks: Vec<Block>,
    integration: ReenteringIntegration,
    task_action_link: TaskActionLink,
}

impl BlockAgent {
    pub(crate) fn new(integration: &ReenteringIntegration, task_action_link: &TaskActionLink) -> BlockAgent {
        BlockAgent {
            blocks: vec![Block::new_main(integration,task_action_link)],
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(crate) fn top_block(&self) -> Block {
        self.blocks[self.blocks.len()-1].clone()
    }

    pub(crate) fn push_block(&mut self, new: &Block) {
        self.blocks.push(new.clone());
    }

    pub(crate) fn pop_block(&mut self) {
        self.blocks.pop();
    }

    pub(crate) fn block_task(&mut self) {
        self.task_action_link.add(Action::BlockTask());
    }

    pub(crate) fn root_block(&mut self) -> &mut Block {
        &mut self.blocks[0]
    }

    pub(crate) fn new_block(&self, unblock: Box<dyn Fn(&TaskActionLink) + Send>) -> Block {
        Block::new(&self.integration,&self.task_action_link,unblock)
    }
}

pub(crate) struct FinishAgent {
    tidiers: Vec<Pin<Box<Tidier>>>,
    kill_reason: Option<KillReason>,
    finishing: bool,
    done_sent: bool,
    integration: ReenteringIntegration,
    task_action_link: TaskActionLink,
}

impl FinishAgent {
    pub(crate) fn new(integration: &ReenteringIntegration, task_action_link: &TaskActionLink) -> FinishAgent {
        FinishAgent {
            tidiers: Vec::new(),
            kill_reason: None,
            finishing: false,
            done_sent: false,
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(crate) fn make_tidier<T>(&mut self, inner: T) -> Tidier where T: Future<Output=()> + 'static + Send {
        let t = Tidier::new(Box::pin(inner));
        self.tidiers.push(Box::pin(t.clone()));
        t
    }

    pub(crate) fn check_tidiers(&mut self) {
        let mut finished = Vec::new();
        let mut idx = 0;
        for t in self.tidiers.iter() {
            if t.finished() {
                finished.push(idx);
            } else {
                idx += 1;
            }
        }
        for idx in finished {
            self.tidiers.remove(idx);
        }
    }

    pub(crate) fn finishing(&self) -> bool { self.finishing }

    pub(crate) fn finished(&mut self) -> bool {
        let out = self.finishing && self.tidiers.len() == 0;
        if out {
            if !self.done_sent {
                self.task_action_link.add(Action::Done());
            }
            self.done_sent = true;
        }
        out
    }

    pub(crate) fn get_tidier(&self) -> Option<&Pin<Box<Tidier>>> {
        self.tidiers.get(0)
    }

    pub(crate) fn finish(&mut self, reason: Option<&KillReason>, is_async: bool) {
        if !self.finishing {
            if let Some(reason) = reason {
                self.kill_reason = Some(reason.clone());
            }
            self.finishing = true;
            self.task_action_link.add(Action::Finishing());
            if is_async {
                self.integration.cause_reentry();
            }
        }
    }

    pub(crate) fn kill_reason(&self) -> Option<KillReason> {
        self.kill_reason.as_ref().map(|x| x.clone())
    }
}

pub(crate) struct NameAgent {
    name: String,
    named_waits: HashSet<NamedWait>
}

impl NameAgent {
    pub(crate) fn new(name: &str) -> NameAgent {
        NameAgent {
            name: name.to_string(),
            named_waits: HashSet::new(),
        }
    }

    pub(crate) fn get_name(&self) -> String {
        self.name.to_string()
    }

    pub(crate) fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }

    pub(crate) fn push_wait(&mut self, wait: &NamedWait) {
        self.named_waits.insert(wait.clone());
    }

    pub(crate) fn pop_wait(&mut self, wait: &NamedWait) {
        self.named_waits.remove(wait);
    }

    pub(crate) fn get_waits(&self) -> Vec<String> {
        self.named_waits.iter().map(|x| x.get_name().to_string()).collect()
    }
}

pub(crate) struct RunAgent {
    tick_index: u64,
    config: RunConfig,
    integration: ReenteringIntegration,
    action_handle: TaskActionLink
}

impl RunAgent {
    pub(crate) fn new(integration: &ReenteringIntegration, action_handle: &TaskActionLink, config: &RunConfig) -> RunAgent {
        RunAgent {
            tick_index: 0,
            config: config.clone(),
            integration: integration.clone(),
            action_handle: action_handle.clone()
        }
    }

    pub(crate) fn set_tick_index(&mut self, tick: u64) {
        self.tick_index = tick;
    }

    pub(crate) fn get_tick_index(&self) -> u64 { self.tick_index }

    pub(crate) fn get_config(&self) -> &RunConfig { &self.config }

    pub(crate) fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        let rc = rc.unwrap_or(self.config.clone());
        Agent::new(&rc,&self.action_handle.get_action_link(),&self.integration,name)
    }

    pub(crate) fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        let handle2 = TaskHandle::new(&mut agent2,Box::pin(future));
        self.action_handle.add(Action::Create(Box::new(handle2.clone()),agent2.clone()));
        handle2
    }

    pub(crate) fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(Action::Timer(timeout,Box::new(callback)));
    }

    pub(crate) fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(Action::Tick(self.tick_index+ticks,Box::new(callback)));
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.action_handle.register(task_handle);
    }
}

pub(crate) struct AgentState {
    block_agent: BlockAgent,
    finish_agent: FinishAgent,
    name_agent: NameAgent,
    run_agent: RunAgent
}

// XXX all Arc to state obj?
#[derive(Clone)]
pub struct Agent {
    state: Arc<Mutex<AgentState>>
}

impl Agent {
    pub(crate) fn new(config: &RunConfig,
                      action_handle: &ActionLink,
                      integration: &ReenteringIntegration, name: &str) -> Agent {
        let action_handle = action_handle.new_task_action_link();
        let out = Agent {
            state: Arc::new(Mutex::new(AgentState {
                block_agent: BlockAgent::new(integration,&action_handle),
                finish_agent: FinishAgent::new(integration,&action_handle),
                name_agent: NameAgent::new(name),
                run_agent: RunAgent::new(integration,&action_handle,config)
            }))
        };
        out
    }

    pub(crate) fn block_agent(&self) -> MutexGuardRefMut<AgentState,BlockAgent> {
        MutexGuardRefMut::new(self.state.lock().unwrap()).map_mut(|x| &mut x.block_agent)
    }

    pub(crate) fn finish_agent(&self) -> MutexGuardRefMut<AgentState,FinishAgent> {
        MutexGuardRefMut::new(self.state.lock().unwrap()).map_mut(|x| &mut x.finish_agent)
    }

    pub(crate) fn name_agent(&self) -> MutexGuardRefMut<AgentState,NameAgent> {
        MutexGuardRefMut::new(self.state.lock().unwrap()).map_mut(|x| &mut x.name_agent)
    }

    pub(crate) fn run_agent(&self) -> MutexGuardRefMut<AgentState,RunAgent> {
        MutexGuardRefMut::new(self.state.lock().unwrap()).map_mut(|x| &mut x.run_agent)
    }

    pub fn get_name(&self) -> String {
        self.name_agent().get_name()
    }

    pub fn set_name(&self, name: &str) {
        self.name_agent().set_name(name);
    }

    pub fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.run_agent().add_timer(timeout,callback);
    }

    pub fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        self.run_agent().add_ticks_timer(ticks,callback);
    }

    pub fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        self.run_agent().new_agent(name,rc)
    }

    pub fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        self.run_agent().submit(agent2,future)
    }

    /* kills */

    pub fn finish(&self, reason: KillReason) {
        self.finish_agent().finish(Some(&reason),true);
    }

    /* misc */
    pub fn get_config(&self) -> RunConfig { self.run_agent().get_config().clone() }

    // XXX demut
    /* running steps */

    pub fn get_tick_index(&self) -> u64 { self.run_agent().get_tick_index() }

    pub fn tick(&self,ticks: u64) -> impl Future<Output=()> {
        let future = FlagFuture::new();
        let future2 = future.clone();
        self.add_ticks_timer(ticks, move || future2.flag());
        future
    }

    pub fn timer(&self, timeout: f64) -> impl Future<Output=()> {
        let future = FlagFuture::new();
        let future2 = future.clone();
        self.add_timer(timeout, move || future2.flag());
        future
    }

    pub fn turnstile<R,T>(&self, inner: T) -> TurnstileFuture<R> where T: Future<Output=R> + 'static + Send, R: Send {
        TurnstileFuture::new(&self,inner)
    }

    pub fn named_wait<R,T>(&self, inner: T, name: &str) -> NamedFuture<R> where T: Future<Output=R> + 'static + Send, R: Send {
        NamedFuture::new(&self,inner,name)
    }

    pub fn tidy<T>(&self, inner: T) -> Tidier where T: Future<Output=()> + 'static + Send {
        self.finish_agent().make_tidier(inner)
    }

    fn run_one_destructor(&self, context: &mut Context) {
        self.finish_agent().check_tidiers();
        if let Some(tidier) = self.finish_agent().get_tidier() {
            let mut tidier = tidier.clone();
            match tidier.as_mut().poll(context) {
                Poll::Pending => {
                    self.block_agent().root_block().block();
                    self.block_agent().block_task();
                },
                Poll::Ready(_) => {}
            }
        }
    }

    fn run_one_main<R>(&self, context: &mut Context, future: &mut Pin<Box<dyn Future<Output=R> + 'static+Send>>, result: &mut Option<R>) {
        let out = future.as_mut().poll(context);
        match out {
            Poll::Pending => {
                self.block_agent().root_block().block();
                self.block_agent().block_task();
            },
            Poll::Ready(v) => {
                self.finish_agent().finish(None,false);
                *result = Some(v);
            }
        };
    }

    pub(crate) fn more<R>(&self, future: &mut Pin<Box<dyn Future<Output=R> + 'static+Send>>, tick_index: u64, result: &mut Option<R>) -> bool {
        self.run_agent().set_tick_index(tick_index);
        if self.finish_agent().finished() {
            return false;
        }
        let waker = self.block_agent().root_block().make_waker();
        let wr = &*waker_ref(&waker);
        let context = &mut Context::from_waker(wr);
        if self.finish_agent().finishing() {
            self.run_one_destructor(context);
        } else {
            self.run_one_main(context,future,result);
        }
        self.finish_agent().check_tidiers();
        self.finish_agent().finished()
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::executor::Executor;
    use crate::executor::taskcontainer::TaskContainer;
    use crate::integration::integration::{ Integration, SleepQuantity };
    use crate::integration::testintegration::TestIntegration;

    #[test]
    pub fn test_control_timers() {
        /* setup */
        let time = Arc::new(Mutex::new(0.));
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = ActionLink::new();
        let ctx = x.new_agent(&cfg,"test");
        let mut tc = x.add(async {},ctx);        
        /* test */
        let mut shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.get_agent().add_timer(1.,move || { *shared2.lock().unwrap() = true; });
        x.run_actions();
        x.check_timers(0.5);
        assert!(!*shared.lock().unwrap());
        x.check_timers(1.5);
        assert!(*shared.lock().unwrap());
    }

    #[test]
    pub fn test_control_kill() {
        /* setup */
        let cfg = RunConfig::new(None,0,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = Agent::new(&cfg,&eah,&integration,"test");
        tc.run_agent().register(&h);
        /* test */
        assert!(!tc.finish_agent().finishing);
        tc.finish(KillReason::Cancelled);
        assert!(tc.finish_agent().finishing);
        tc.finish(KillReason::Timeout);
        assert!(tc.finish_agent().finishing);
        let actions = eah.drain_actions();
        assert_eq!(1,actions.len());
        if let Action::Finishing() = actions[0].1 {
        } else {
            assert!(false);
        }
        assert!(Some(KillReason::Cancelled) == tc.finish_agent().kill_reason());
    }

    #[test]
    pub fn test_oneshot() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let mut ti = TestIntegration::new();
        let mut integration = ReenteringIntegration::new(ti.clone());
        let mut tc = Agent::new(&cfg,&eah,&integration.clone(),"name");
        tc.run_agent().register(&h);
        /* simulate */
        integration.sleep(SleepQuantity::Time(1.));
        integration.cause_reentry(); /* sets one-shot, sends SleepQuantity::None */
        integration.sleep(SleepQuantity::Time(2.)); /* not sent */
        integration.reentering(); /* sent by executor at start of tick */
        integration.sleep(SleepQuantity::Time(3.));
        assert_eq!(vec![
            SleepQuantity::Time(1.),
            SleepQuantity::None,
            SleepQuantity::Time(3.)
        ],*ti.get_sleeps());
    }

    #[test]
    pub fn test_internal_finish() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ActionLink::new();
        let mut ti = TestIntegration::new();
        let mut integration = ReenteringIntegration::new(ti.clone());
        /* simulate */
        /* kills are known to be from inside a task should not force reentry */
        let mut tc = Agent::new(&cfg,&eah,&integration.clone(),"name");
        tc.run_agent().register(&h);
        tc.finish_agent().finish(None,false);
        assert_eq!(ti.get_sleeps().len(),0);
        /* but kills which maybe from outside must */
        let mut tc = Agent::new(&cfg,&eah,&integration.clone(),"name");
        tc.run_agent().register(&h);
        tc.finish(KillReason::NotNeeded);
        assert_eq!(vec![SleepQuantity::None],*ti.get_sleeps());
    }

    #[test]
    pub fn test_create_subtask() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(false));
        let tidied2 = tidied.clone();
        let step = async move {
            let agentb = agent2.new_agent("task2",None);
            let agentb2 = agentb.clone();
            agent2.submit(agentb,async move {
                agentb2.tick(1).await;
                *tidied2.lock().unwrap() = true;
                agentb2.tick(1).await;
            });
            42
        };
        let mut handle = x.add(step,agent);
        x.tick(1.);
        assert!(!*tidied.lock().unwrap());
        assert_eq!(Some(42),handle.take_result());
        x.tick(1.);
        assert!(*tidied.lock().unwrap());
        let all = x.summarize_all();
        assert_eq!(1,all.len());
        assert_eq!("task2",all[0].get_name());
    }
}
