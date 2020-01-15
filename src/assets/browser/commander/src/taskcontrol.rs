use std::sync::{ Arc, Mutex };

use crate::step::Step2;
use crate::block::Block;
use crate::blocker::Blocker;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::integration::ReenteringIntegration;
use crate::step::{ KillReason, RunConfig };
use crate::steprunner::StepRunner;
use crate::taskcontainer::TaskHandle;

#[derive(Clone)]
pub struct TaskControl {
    integration: ReenteringIntegration,
    config: RunConfig,
    tick_index: Arc<Mutex<u64>>,
    finished: Arc<Mutex<bool>>,
    kill_reason: Arc<Mutex<Option<KillReason>>>,
    task_handle: TaskHandle,
    action_handle: ExecutorActionHandle,
    blocker: Blocker
}

impl TaskControl {
    pub(crate) fn new(config: &RunConfig,
                      action_handle: &ExecutorActionHandle, task_handle: &TaskHandle, 
                      integration: &ReenteringIntegration) -> TaskControl {
        let action_handle = action_handle.clone();
        let task_handle = task_handle.clone();
        let blocker = Blocker::new(integration,&action_handle,&task_handle);
        TaskControl {
            config: config.clone(),
            finished: Arc::new(Mutex::new(false)),
            kill_reason: Arc::new(Mutex::new(None)),
            task_handle, action_handle,
            integration: integration.clone(),
            tick_index: Arc::new(Mutex::new(0)),
            blocker
        }
    }

    /* timers */
    pub fn add_timer<T>(&mut self, timeout: f64, callback: T) where T: FnMut() + 'static + Send {
        self.action_handle.add(ExecutorAction::Timer(self.task_handle.clone(),timeout,Box::new(callback)));
    }

    /* kills */
    pub(crate) fn finish_internal(&mut self, reason: Option<&KillReason>) -> bool {
        let mut finished = self.finished.lock().unwrap();
        if !*finished {
            if let Some(reason) = reason {
                *self.kill_reason.lock().unwrap() = Some(reason.clone());
                self.action_handle.add(ExecutorAction::Kill(self.task_handle.clone(),reason.clone()));
            } else {
                self.action_handle.add(ExecutorAction::Done(self.task_handle.clone()));
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
    pub fn is_finished(&self) -> bool { *self.finished.lock().unwrap() }

    pub fn kill_reason(&self) -> Option<KillReason> {
        self.kill_reason.lock().unwrap().as_ref().map(|x| x.clone())
    }

    /* misc */
    pub fn get_config(&self) -> &RunConfig { &self.config }
    //pub fn get_remaining(&self) -> f64 { 0. }
    //pub fn dropped(&self) -> bool { false }

    // XXX demut
    /* running steps */
    pub fn new_step<X,Y,E>(&mut self, step: &mut Box<dyn Step2<X,Y,E>>, input: &X) -> StepRunner<Y,E> where {
        let run = step.start(input,self);
        StepRunner::new(run,self)
    }

    pub(crate) fn about_to_run(&mut self, tick_index: u64) {
        *self.tick_index.lock().unwrap() = tick_index;
    }

    pub fn get_tick_index(&self) -> u64 {
        *self.tick_index.lock().unwrap()
    }

    pub(crate) fn wait_for_next_tick(&mut self) {
        self.action_handle.add(ExecutorAction::Tick(self.task_handle.clone()));
    }

    pub(crate) fn get_blocker(&mut self) -> &mut Blocker {
        &mut self.blocker
    }

    pub fn block(&mut self) -> Block {
        Block::new(self.get_blocker())
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
        let mut step = integration.new_step(vec![TestState::Done(Ok(()))]);
        let mut tc = x.add(step.clone(),&(),&cfg,"test");
        /* test */
        let mut shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.add_timer(1.,move || { *shared2.lock().unwrap() = true; });
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
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration);
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
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration);


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
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration.clone());
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
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration.clone());
        tc.finish_internal(None);
        assert_eq!(ti.get_sleeps().len(),0);
        /* but kills which maybe from outside must */
        let mut tc = TaskControl::new(&cfg,&eah,&h,&integration.clone());
        tc.finish(None);
        assert_eq!(vec![SleepQuantity::None],*ti.get_sleeps());
    }
}
