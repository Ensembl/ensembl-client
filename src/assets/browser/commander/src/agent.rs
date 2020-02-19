/* An agent provides methods on behalf of an Executor within a future. */

use hashbrown::HashSet;
use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex, MutexGuard };

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

struct AgentState {
    blocks: Vec<Block>,
    tick_index: u64,
    tidiers: Vec<Pin<Box<Tidier>>>,
    done_sent: bool,
    finishing: bool,
    kill_reason: Option<KillReason>,
    name: String,
    named_waits: HashSet<NamedWait>,
    config: RunConfig,
    integration: ReenteringIntegration,
    action_handle: TaskActionLink
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
                blocks: vec![Block::new_main(&integration,&action_handle)],
                tick_index: 0,
                finishing: false,
                done_sent: false,
                tidiers: Vec::new(),
                kill_reason: None,
                name: name.to_string(),
                named_waits: HashSet::new(),
                config: config.clone(),
                integration: integration.clone(),
                action_handle
            }))
        };
        out
    }

    pub(crate) fn new_block(&self, unblock: Box<dyn Fn(&TaskActionLink) + Send>) -> Block {
        let state = self.state.lock().unwrap();
        Block::new(&state.integration,&state.action_handle,unblock)
    }

    pub(crate) fn top_block(&self) -> Block {
        let blocks = &self.state.lock().unwrap().blocks;
        blocks[blocks.len()-1].clone()
    }

    pub(crate) fn push_block(&self, new: &Block) {
        let mut state = self.state.lock().unwrap();
        state.blocks.push(new.clone());
    }

    pub(crate) fn pop_block(&self) {
        self.state.lock().unwrap().blocks.pop();
    }

    pub fn get_name(&self) -> String {
        self.state.lock().unwrap().name.to_string()
    }

    pub fn set_name(&self, name: &str) {
        self.state.lock().unwrap().name = name.to_string();
    }

    pub(crate) fn push_wait(&self, wait: &NamedWait) {
        self.state.lock().unwrap().named_waits.insert(wait.clone());
    }

    pub(crate) fn pop_wait(&self, wait: &NamedWait) {
        self.state.lock().unwrap().named_waits.remove(wait);
    }

    pub(crate) fn get_waits(&self) -> Vec<String> {
        self.state.lock().unwrap().named_waits.iter().map(|x| x.get_name().to_string()).collect()
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.state.lock().unwrap().action_handle.register(task_handle);
    }

    /* timers */
    pub fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.state.lock().unwrap().action_handle.add(Action::Timer(timeout,Box::new(callback)));
    }

    pub fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        let state = self.state.lock().unwrap();
        state.action_handle.add(Action::Tick(state.tick_index+ticks,Box::new(callback)));
    }

    /* resubmissions */
    pub fn new_agent(&self, name: &str, rc: Option<RunConfig>) -> Agent {
        let state = self.state.lock().unwrap();
        let rc = rc.unwrap_or(state.config.clone());
        Agent::new(&rc,&state.action_handle.get_action_link(),&state.integration,name)
    }

    pub fn submit<R,T>(&self, mut agent2: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        let state = self.state.lock().unwrap();
        let handle2 = TaskHandle::new(&mut agent2,Box::pin(future));
        state.action_handle.add(Action::Create(Box::new(handle2.clone()),agent2.clone()));
        handle2
    }

    /* kills */

    fn send_done_if_unsent(&self, state: &mut AgentState) {
        if !state.done_sent {
            state.action_handle.add(Action::Done());
        }
        state.done_sent = true;
    }

    fn finish_internal(&self, state: &mut AgentState, reason: Option<&KillReason>) -> bool {
        if !state.finishing {
            if let Some(reason) = reason {
                state.kill_reason = Some(reason.clone());
            }
            state.finishing = true;
            state.action_handle.add(Action::Finishing());
            true
        } else {
            false
        }
    }

    pub fn finish(&self, reason: KillReason) {
        let mut state = self.state.lock().unwrap();
        if self.finish_internal(&mut state,Some(&reason)) {
            state.integration.cause_reentry();
        }
    }

    /* NOTE: relying on this value to detect completion here is racey. 
     * If true it has definitely finished, but if not it may well have
     * finished even before you get the false. Therefore it should only
     * be relied on to detect finish cases which would definitely have
     * occured before this call.
     */
    #[cfg(test)]
    pub(crate) fn is_finished(&self) -> bool { self.state.lock().unwrap().finishing }

    pub(crate) fn kill_reason(&self) -> Option<KillReason> {
        self.state.lock().unwrap().kill_reason.as_ref().map(|x| x.clone())
    }

    /* misc */
    pub fn get_config(&self) -> RunConfig { self.state.lock().unwrap().config.clone() }

    // XXX demut
    /* running steps */

    pub fn get_tick_index(&self) -> u64 {
        self.state.lock().unwrap().tick_index
    }

    pub fn tick(&self,ticks: u64) -> impl Future<Output=()> {
        let future = FlagFuture::new();
        let future2 = future.clone();
        self.add_ticks_timer(ticks,move || {
            future2.flag();
        });
        future
    }

    pub fn timer(&self, timeout: f64) -> impl Future<Output=()> {
        let future = FlagFuture::new();
        let future2 = future.clone();
        self.add_timer(timeout,move || {
            future2.flag();
        });
        future
    }

    pub fn turnstile<R,T>(&self, inner: T) -> TurnstileFuture<R> where T: Future<Output=R> + 'static + Send, R: Send {
        TurnstileFuture::new(&self,inner)
    }

    pub fn named_wait<R,T>(&self, inner: T, name: &str) -> NamedFuture<R> where T: Future<Output=R> + 'static + Send, R: Send {
        NamedFuture::new(&self,inner,name)
    }

    pub fn tidy<T>(&self, inner: T) -> Tidier where T: Future<Output=()> + 'static + Send {
        let t = Tidier::new(Box::pin(inner));
        self.state.lock().unwrap().tidiers.push(Box::pin(t.clone()));
        t
    }

    fn check_tidiers(&self, state: &mut AgentState) {
        let mut finished = Vec::new();
        let mut idx = 0;
        for t in state.tidiers.iter() {
            if t.finished() {
                finished.push(idx);
            } else {
                idx += 1;
            }
        }
        for idx in finished {
            state.tidiers.remove(idx);
        }
    }

    fn run_one_destructor(&self, mut state: MutexGuard<AgentState>, context: &mut Context) {
        self.check_tidiers(&mut state);
        if let Some(tidier) = state.tidiers.get(0) {
            let mut tidier = tidier.clone();
            drop(state);
            match tidier.as_mut().poll(context) {
                Poll::Pending => {
                    let state = self.state.lock().unwrap();
                    state.blocks[0].block();
                    state.action_handle.add(Action::BlockTask());
                },
                Poll::Ready(_) => {}
            }
        } else {
            drop(state);
        }
    }

    fn run_one_main<R>(&self, state: MutexGuard<AgentState>, context: &mut Context, future: &mut Pin<Box<dyn Future<Output=R> + 'static+Send>>, result: &mut Option<R>) {
        drop(state);
        let out = future.as_mut().poll(context);
        match out {
            Poll::Pending => {
                let state = self.state.lock().unwrap();
                state.blocks[0].block();
                state.action_handle.add(Action::BlockTask());
            },
            Poll::Ready(v) => {
                let mut state = self.state.lock().unwrap();
                self.finish_internal(&mut state,None);
                *result = Some(v);
            }
        };
    }

    pub(crate) fn more<R>(&self, future: &mut Pin<Box<dyn Future<Output=R> + 'static+Send>>, tick_index: u64, result: &mut Option<R>) -> bool {
        let mut state = self.state.lock().unwrap();
        let finishing = state.finishing;
        /* Race ok because killing is not guaranteed synchronous and done happens in the same thread as this. */
        if finishing && state.tidiers.len() == 0 {
            self.send_done_if_unsent(&mut state);
            return false;
        }
        /* prepare tick index, blocker */
        state.tick_index = tick_index;
        /* run */
        let waker = state.blocks[0].make_waker();
        let wr = &*waker_ref(&waker);
        let context = &mut Context::from_waker(wr);
        if finishing {
            self.run_one_destructor(state,context);
        } else {
            self.run_one_main(state,context,future,result);
        }
        let mut state = self.state.lock().unwrap();
        self.check_tidiers(&mut state);
        let finished = state.finishing && state.tidiers.len() == 0;
        if finished {
            self.send_done_if_unsent(&mut state);
        }
        finished
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
        tc.register(&h);
        /* test */
        assert!(!tc.is_finished());
        tc.finish(KillReason::Cancelled);
        assert!(tc.is_finished());
        tc.finish(KillReason::Timeout);
        assert!(tc.is_finished());
        let actions = eah.drain_actions();
        assert_eq!(1,actions.len());
        if let Action::Finishing() = actions[0].1 {
        } else {
            assert!(false);
        }
        assert!(Some(KillReason::Cancelled) == tc.kill_reason());
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
        tc.register(&h);
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
        tc.register(&h);
        tc.finish_internal(&mut tc.state.lock().unwrap(),None);
        assert_eq!(ti.get_sleeps().len(),0);
        /* but kills which maybe from outside must */
        let mut tc = Agent::new(&cfg,&eah,&integration.clone(),"name");
        tc.register(&h);
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
