use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };

use super::blockagent::BlockAgent;
use super::finishagent::FinishAgent;
use super::nameagent::NameAgent;
use super::runagent::RunAgent;
use crate::executor::action::ActionLink;
use crate::integration::reentering::ReenteringIntegration;
use crate::helper::named::{ NamedFuture };
use crate::task::runconfig::RunConfig;
use crate::helper::turnstile::TurnstileFuture;
use crate::task::task::KillReason;
use crate::task::taskhandle::TaskHandle;
use crate::helper::tidier::Tidier;
use crate::helper::flagfuture::FlagFuture;
use std::task::Poll;
use futures::task::{ Context, waker_ref };
use owning_ref::MutexGuardRefMut;

/* An agent provides methods on behalf of an Executor for use within a future. It
 * is also ultimately responsible for executing the future and for destructors.
 * That's a lot of work, so it's split into mixins. In this main class there are:
 *   1. accessors for the mixins (crate scoped);
 *   2. public API;
 *   3. top-level execution methods (as they require coordination across mixins)
 */

pub(crate) struct AgentState {
    block_agent: BlockAgent,
    finish_agent: FinishAgent,
    name_agent: NameAgent,
    run_agent: RunAgent
}

// XXX demut
#[derive(Clone)]
pub struct Agent {
    state: Arc<Mutex<AgentState>>
}

impl Agent {
    pub(crate) fn new(config: &RunConfig,
                      action_link: &ActionLink,
                      integration: &ReenteringIntegration, name: &str) -> Agent {
        let task_action_link = action_link.new_task_action_link();
        let out = Agent {
            state: Arc::new(Mutex::new(AgentState {
                block_agent: BlockAgent::new(integration,&task_action_link),
                finish_agent: FinishAgent::new(integration,&task_action_link),
                name_agent: NameAgent::new(name),
                run_agent: RunAgent::new(integration,&task_action_link,config)
            }))
        };
        out
    }

    /* access mixins */

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

    /* public API */

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

    pub fn submit<R,T>(&self, agent: Agent, future: T) -> TaskHandle<R> where T: Future<Output=R> + 'static + Send, R: 'static + Send {
        self.run_agent().submit(agent,future)
    }

    pub fn finish(&self, reason: KillReason) {
        self.finish_agent().finish(Some(&reason),true);
    }

    pub fn get_config(&self) -> RunConfig { self.run_agent().get_config().clone() }

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

    /* overall run task */

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
