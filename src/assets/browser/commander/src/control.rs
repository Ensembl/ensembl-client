use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRefMut;

use crate::edgetrigger::EdgeTrigger;
use crate::executoraction::{ ExecutorAction, ExecutorActionHandle };
use crate::step::{ KillReason, RunConfig };
use crate::timer::TimerSet;
use crate::taskcontainer::TaskHandle;

#[derive(Clone)]
pub struct TaskControl {
    config: RunConfig,
    finished: Arc<Mutex<bool>>,
    kill_reason: Arc<Mutex<Option<KillReason>>>,
    task_handle: TaskHandle,
    action_handle: ExecutorActionHandle,
    timers: Arc<Mutex<TimerSet>>,
    rerun_soon: Arc<Mutex<EdgeTrigger<'static>>>
}

impl TaskControl {
    pub(crate) fn new(config: &RunConfig, action_handle: &ExecutorActionHandle, task_handle: &TaskHandle) -> TaskControl {
        let action_handle = action_handle.clone();
        let mut action_handle2 = action_handle.clone();
        let task_handle = *task_handle;
        TaskControl {
            config: config.clone(),
            finished: Arc::new(Mutex::new(false)),
            kill_reason: Arc::new(Mutex::new(None)),
            task_handle, action_handle,
            timers: Arc::new(Mutex::new(TimerSet::new())),
            rerun_soon: Arc::new(Mutex::new(EdgeTrigger::new(move || {
                action_handle2.add(ExecutorAction::Unblock(task_handle));
            })))
        }
    }

    /* timers */
    pub fn timers(&mut self) -> MutexGuardRefMut<TimerSet> { 
        MutexGuardRefMut::new(self.timers.lock().unwrap())
    }

    pub(crate) fn check_timers(&mut self, now: f64) {
        self.timers().check(now);
    }

    /* kills */
    pub fn finish(&mut self, reason: Option<&KillReason>) {
        let mut finished = self.finished.lock().unwrap();
        if !*finished {
            if let Some(reason) = reason {
                *self.kill_reason.lock().unwrap() = Some(reason.clone());
                self.action_handle.add(ExecutorAction::Kill(self.task_handle,reason.clone()));
            } else {
                self.action_handle.add(ExecutorAction::Done(self.task_handle));
            }
            *finished = true;
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

    /* blocking */
    pub fn rerun_soon(&mut self) {
        self.rerun_soon.lock().unwrap().set();
    }

    pub(crate) fn about_to_run(&mut self) {
        self.rerun_soon.lock().unwrap().reset();
    }

    pub(crate) fn not_runnable(&mut self) {
        self.action_handle.add(ExecutorAction::Block(self.task_handle));
        if self.rerun_soon.lock().unwrap().is_set() {
            /* handle race between this unblock call and rerun_soon
             * (we need to gurantee that the latter always wins)
             */
            self.action_handle.add(ExecutorAction::Unblock(self.task_handle));
        }
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use crate::taskcontainer::TaskContainer;

    #[test]
    pub fn test_control_timers() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = ExecutorActionHandle::new();
        let mut tc = TaskControl::new(&cfg,&eah,&h);
        /* quickly test vaious accessors */
        assert_eq!(2,tc.get_config().get_priority());
        /* test */
        let mut shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.timers().add(1.,move || { *shared2.lock().unwrap() = true; });
        tc.check_timers(0.5);
        assert!(!*shared.lock().unwrap());
        tc.check_timers(1.5);
        assert!(*shared.lock().unwrap());
    }

    #[test]
    pub fn test_control_kill() {
        /* setup */
        let cfg = RunConfig::new(None,0,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let mut tc = TaskControl::new(&cfg,&eah,&h);
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
        let cfg = RunConfig::new(None,0,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = ExecutorActionHandle::new();
        let mut tc = TaskControl::new(&cfg,&eah,&h);
        /* test */
        /* 2 unblocks cause single action */
        tc.rerun_soon();
        tc.rerun_soon();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Unblock(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* reset and then unblock and we should get another */
        tc.about_to_run();
        tc.rerun_soon();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Unblock(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* not_runnable should cause a block */
        tc.about_to_run();
        tc.not_runnable();
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let ExecutorAction::Block(_) = actions[0] {
        } else {
            assert!(false);
        }
        /* not runnable should not cause block if unblock called in-between */
        tc.about_to_run();
        tc.rerun_soon();
        tc.not_runnable();
        let actions = eah.drain();
        assert_eq!(3,actions.len());
        if let (ExecutorAction::Unblock(_),
                ExecutorAction::Block(_),
                ExecutorAction::Unblock(_)) = (&actions[0],&actions[1],&actions[2]) {
        } else {
            assert!(false);
        }
    }
}
