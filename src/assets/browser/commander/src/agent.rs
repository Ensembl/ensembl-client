/* An agent provides methods on behalf of an Executor within a future. */

use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };

use crate::block::Block;
use crate::blockagent::BlockAgent;
use crate::executoraction::{ AnonExecutorAction, ExecutorActionHandle, ExecutorActionTaskHandle };
use crate::integration::ReenteringIntegration;
use crate::step::RunConfig;
use crate::taskcontainer::TaskContainerHandle;
use crate::turnstile::TurnstileFuture;
use crate::taskhandle::KillReason;
use crate::oneshot::OneShot;
use std::task::Poll;
use futures::task::{ Context, waker_ref };

struct AgentState {
    blocks: Vec<Block>,
    tick_index: u64,
    finished: bool,
    kill_reason: Option<KillReason>,
    name: String
}

// XXX Arc to state obj
#[derive(Clone)]
pub struct Agent {
    state: Arc<Mutex<AgentState>>,
    integration: ReenteringIntegration,
    config: RunConfig,
    action_handle: ExecutorActionTaskHandle,
    blocker: BlockAgent
}

impl Agent {
    pub(crate) fn new(config: &RunConfig,
                      action_handle: &ExecutorActionHandle,
                      integration: &ReenteringIntegration, name: &str) -> Agent {
        let action_handle = action_handle.new_task();
        let blocker = BlockAgent::new(integration,&action_handle);
        let out = Agent {
            state: Arc::new(Mutex::new(AgentState {
                blocks: Vec::new(),
                tick_index: 0,
                finished: false,
                kill_reason: None,
                name: name.to_string()
            })),
            config: config.clone(),
            action_handle,
            integration: integration.clone(),
            blocker,
        };
        out
    }

    pub(crate) fn push_block(&self, new: &Block) {
        let mut state = self.state.lock().unwrap();
        let last = state.blocks.len()-1;
        state.blocks[last].add(&new);
        state.blocks.push(new.clone());
    }

    pub(crate) fn pop_block(&self) {
        self.state.lock().unwrap().blocks.pop();
    }

    pub fn get_name(&self) -> String {
        self.state.lock().unwrap().name.to_string()
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.action_handle.register(task_handle);
    }

    /* timers */
    pub fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        print!("80\n");
        self.action_handle.add(AnonExecutorAction::Timer(timeout,Box::new(callback)));
    }

    pub fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        let state = self.state.lock().unwrap();
        self.action_handle.add(AnonExecutorAction::UnblockOnTick(state.tick_index+ticks,Box::new(callback)));
    }

    /* kills */
    fn finish_internal(&self, state: &mut AgentState, reason: Option<&KillReason>) -> bool {
        if !state.finished {
            if let Some(reason) = reason {
                state.kill_reason = Some(reason.clone());                
            }
            self.action_handle.add(AnonExecutorAction::Done());
            state.finished = true;
            true
        } else {
            false
        }
    }

    pub fn finish(&self, reason: Option<&KillReason>) {
        if self.finish_internal(&mut self.state.lock().unwrap(),reason) {
            self.integration.cause_reentry();
        }
    }

    /* NOTE: relying on this value to detect completion here is racey. 
     * If true it has definitely finished, but if not it may well have
     * finished even before you get the false. Therefore it should only
     * be relied on to detect finish cases which would definitely have
     * occured before this call.
     */
    pub(crate) fn is_finished(&self) -> bool { self.state.lock().unwrap().finished }

    pub(crate) fn kill_reason(&self) -> Option<KillReason> {
        self.state.lock().unwrap().kill_reason.as_ref().map(|x| x.clone())
    }

    /* misc */
    pub fn get_config(&self) -> &RunConfig { &self.config }
    //pub fn get_remaining(&self) -> f64 { 0. }
    //pub fn dropped(&self) -> bool { false }

    // XXX demut
    /* running steps */

    pub fn get_tick_index(&self) -> u64 {
        self.state.lock().unwrap().tick_index
    }

    pub fn block(&self) -> Block {
        Block::new(&self.blocker)
    }

    pub fn tick(&self,ticks: u64) -> impl Future<Output=()> {
        let future = OneShot::new();
        let future2 = future.clone();
        self.add_ticks_timer(ticks,move || {
            print!("FLAG\n");
            future2.flag();
        });
        future
    }

    pub fn timer(&self, timeout: f64) -> impl Future<Output=()> {
        let future = OneShot::new();
        let future2 = future.clone();
        print!("TIMER\n");
        self.add_timer(timeout,move || {
            print!("FLAG\n");
            future2.flag();
        });
        future
    }

    pub fn turnstile<R,T>(&self, inner: T) -> TurnstileFuture<R> where T: Future<Output=R> + 'static + Send, R: Send {
        TurnstileFuture::new(&self,inner)
    }

    pub(crate) fn more<R>(&self, future: &mut Pin<Box<dyn Future<Output=R>>>, tick_index: u64) -> Option<R> {
        print!(">C\n");
        let mut state = self.state.lock().unwrap();
        print!(">D\n");
        /* Race ok because killing is not guaranteed synchronous and done happens in the same thread as this. */
        if state.finished { 
            return None;
        }
        state.blocks = vec![Block::new(&self.blocker)];
        /* prepare tick index, blocker */
        state.tick_index = tick_index;
        /* run */
        let waker = state.blocks[0].future_waker();
        drop(state);
        print!(">B\n");
        let out = future.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker)));
        print!("<B\n");
        let mut state = self.state.lock().unwrap();
        print!(">E\n");
        match out {
            Poll::Pending => {
                /* blocked so note that (for next call) and tell blocker to notify executor */
                self.blocker.block_task(&state.blocks[0]);
                return None;

            },
            Poll::Ready(v) => {
                self.finish_internal(&mut state,None);
                return Some(v);
            }
        };
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::taskcontainer::TaskContainer;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::testintegration::TestIntegration;
    use crate::executoraction::ExecutorAction;

    #[test]
    pub fn test_control_timers() {
        /* setup */
        let time = Arc::new(Mutex::new(0.));
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = ExecutorActionHandle::new();
        let ctx = x.make_context(&cfg,"test");
        let mut tc = x.add(async {},ctx);        
        /* test */
        let mut shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.get_context().add_timer(1.,move || { *shared2.lock().unwrap() = true; });
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
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = Agent::new(&cfg,&eah,&integration,"test");
        tc.register(&h);
        /* test */
        assert!(!tc.is_finished());
        tc.finish(Some(&KillReason::Cancelled));
        assert!(tc.is_finished());
        tc.finish(Some(&KillReason::Timeout));
        assert!(tc.is_finished());
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Done(_) = actions[0] {
        } else {
            assert!(false);
        }
        assert!(Some(KillReason::Cancelled) == tc.kill_reason());
    }

    #[test]
    pub fn test_blocking() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = Agent::new(&cfg,&eah,&integration,"name");
        tc.register(&h);

        // XXX todo

    }

    #[test]
    pub fn test_oneshot() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
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
        let mut eah = ExecutorActionHandle::new();
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
        tc.finish(None);
        assert_eq!(vec![SleepQuantity::None],*ti.get_sleeps());
    }
}
