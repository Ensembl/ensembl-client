use std::future::Future;
use std::sync::{ Arc, Mutex };

use crate::step::Step2;
use crate::block::Block;
use crate::blocker::Blocker;
use crate::executoraction::{ AnonExecutorAction, ExecutorActionHandle, ExecutorActionTaskHandle };
use crate::integration::ReenteringIntegration;
use crate::step::{ KillReason, RunConfig };
use crate::steprunner::{ StepRunner, StepRun };
use crate::taskcontainer::TaskContainerHandle;
use crate::future::FutureOneShot;

#[derive(Clone)]
pub struct TaskContext {
    integration: ReenteringIntegration,
    config: RunConfig,
    tick_index: Arc<Mutex<u64>>,
    finished: Arc<Mutex<bool>>,
    kill_reason: Arc<Mutex<Option<KillReason>>>,
    action_handle: ExecutorActionTaskHandle,
    blocker: Blocker
}

impl TaskContext {
    pub(crate) fn new(config: &RunConfig,
                      action_handle: &ExecutorActionHandle,
                      integration: &ReenteringIntegration) -> TaskContext {
        let action_handle = action_handle.new_task();
        let blocker = Blocker::new(integration,&action_handle);
        let out = TaskContext {
            config: config.clone(),
            finished: Arc::new(Mutex::new(false)),
            kill_reason: Arc::new(Mutex::new(None)),
            action_handle,
            integration: integration.clone(),
            tick_index: Arc::new(Mutex::new(0)),
            blocker
        };
        out
    }

    pub(crate) fn register(&self, task_handle: &TaskContainerHandle) {
        self.action_handle.register(task_handle);
    }

    /* timers */
    pub fn add_timer<T>(&self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(AnonExecutorAction::Timer(timeout,Box::new(callback)));
    }

    pub fn add_ticks_timer<T>(&self, ticks: u64, callback: T) where T: FnMut() + 'static + Send {
        let tick = *self.tick_index.lock().unwrap();
        self.action_handle.add(AnonExecutorAction::UnblockOnTick(tick+ticks,Box::new(callback)));
    }

    /* kills */
    pub(crate) fn finish_internal(&mut self, reason: Option<&KillReason>) -> bool {
        let mut finished = self.finished.lock().unwrap();
        if !*finished {
            if let Some(reason) = reason {
                *self.kill_reason.lock().unwrap() = Some(reason.clone());
                self.action_handle.add(AnonExecutorAction::Kill(reason.clone()));
            } else {
                self.action_handle.add(AnonExecutorAction::Done());
            }
            *finished = true;
            true
        } else {
            false
        }
    }

    pub fn finish(&mut self, reason: Option<&KillReason>) {
        if self.finish_internal(reason) {
            self.integration.cause_reentry();
        }
    }

    /* NOTE: relying on this value to detect completion here is racey. 
     * If true it has definitely finished, but if not it may well have
     * finished even before you get the false. Therefore it should only
     * be relied on to detect finish cases which would definitely have
     * occured before this call.
     */
    pub(crate) fn is_finished(&self) -> bool { *self.finished.lock().unwrap() }

    pub(crate) fn kill_reason(&self) -> Option<KillReason> {
        self.kill_reason.lock().unwrap().as_ref().map(|x| x.clone())
    }

    /* misc */
    pub fn get_config(&self) -> &RunConfig { &self.config }
    //pub fn get_remaining(&self) -> f64 { 0. }
    //pub fn dropped(&self) -> bool { false }

    // XXX demut
    /* running steps */
    pub fn new_step<X,R>(&mut self, step: &mut Box<dyn Step2<X,Output=R>>, input: X) -> StepRunner<R> {
        let run = step.start(input,self);
        StepRunner::new(run,self)
    }

    pub fn new_step2<R>(&mut self, run: Box<dyn StepRun<Output=R>>) -> StepRunner<R> {
        StepRunner::new(run,self)
    }

    pub(crate) fn about_to_run(&mut self, tick_index: u64) {
        *self.tick_index.lock().unwrap() = tick_index;
    }

    pub fn get_tick_index(&self) -> u64 {
        *self.tick_index.lock().unwrap()
    }

    pub(crate) fn block_task(&self, block: &Block) {
        self.blocker.block_task(block)
    }

    pub fn block(&self) -> Block {
        Block::new(&self.blocker)
    }

    pub fn tick(&self,ticks: u64) -> impl Future<Output=()> {
        let future = FutureOneShot::new();
        let future2 = future.clone();
        self.add_ticks_timer(ticks,move || {
            future2.flag();
        });
        future
    }

    pub fn timer(&self, timeout: f64) -> impl Future<Output=()> {
        let future = FutureOneShot::new();
        let future2 = future.clone();
        self.add_timer(timeout,move || {
            future2.flag();
        });
        future
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::executor::Executor;
    use crate::taskcontainer::TaskContainer;
    use crate::integration::{ CommanderIntegration2, SleepQuantity };
    use crate::step::{ Step2, StepState2, OngoingState };
    use crate::steprunner::StepRun;
    use crate::testintegration::{ TestIntegration, TestState };
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
        let mut step = integration.new_step(vec![TestState::Done(())]);
        let mut tc = x.add(step.clone(),&(),x.make_context(&cfg),"test");
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
        let mut tc = TaskContext::new(&cfg,&eah,&integration);
        tc.register(&h);
        /* test */
        assert!(!tc.is_finished());
        tc.finish(Some(&KillReason::Cancelled));
        assert!(tc.is_finished());
        tc.finish(Some(&KillReason::Timeout));
        assert!(tc.is_finished());
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Kill(_,KillReason::Cancelled) = actions[0] {
        } else {
            assert!(false);
        }
    }

    #[test]
    pub fn test_blocking() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let mut tc = TaskContext::new(&cfg,&eah,&integration);
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
        let mut tc = TaskContext::new(&cfg,&eah,&integration.clone());
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
        let mut tc = TaskContext::new(&cfg,&eah,&integration.clone());
        tc.register(&h);
        tc.finish_internal(None);
        assert_eq!(ti.get_sleeps().len(),0);
        /* but kills which maybe from outside must */
        let mut tc = TaskContext::new(&cfg,&eah,&integration.clone());
        tc.register(&h);
        tc.finish(None);
        assert_eq!(vec![SleepQuantity::None],*ti.get_sleeps());
    }
}
