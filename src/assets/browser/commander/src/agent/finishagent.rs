use std::future::Future;
use std::pin::Pin;
use crate::executor::action::Action;
use crate::executor::link::TaskLink;
use crate::corefutures::tidierfuture::TidierFuture;
use crate::integration::reentering::ReenteringIntegration;
use crate::task::task::KillReason;

/* FinishAgent is the Agent mixin responsible for destructors and signals */

pub(crate) struct FinishAgent {
    tidiers: Vec<Pin<Box<TidierFuture>>>,
    kill_reason: Option<KillReason>,
    finishing: bool,
    done_sent: bool,
    integration: ReenteringIntegration,
    task_action_link: TaskLink<Action>,
}

impl FinishAgent {
    pub(super) fn new(integration: &ReenteringIntegration, task_action_link: &TaskLink<Action>) -> FinishAgent {
        FinishAgent {
            tidiers: Vec::new(),
            kill_reason: None,
            finishing: false,
            done_sent: false,
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(super) fn make_tidier<T>(&mut self, inner: T) -> TidierFuture where T: Future<Output=()> + 'static {
        let t = TidierFuture::new(Box::pin(inner));
        self.tidiers.push(Box::pin(t.clone()));
        t
    }

    pub(super) fn check_tidiers(&mut self) {
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
        if self.finishing && self.tidiers.len() == 0 {
            if !self.done_sent {
                self.task_action_link.add(Action::Done());
            }
            self.done_sent = true;
            true
        } else {
            false
        }
    }

    pub(super) fn get_tidier(&self) -> Option<&Pin<Box<TidierFuture>>> {
        self.tidiers.last()
    }

    pub(super) fn finish(&mut self, reason: Option<&KillReason>, is_async: bool) {
        if !self.finishing {
            if let Some(reason) = reason {
                self.kill_reason = Some(reason.clone());
            }
            self.finishing = true;
            self.task_action_link.add(Action::UnblockTask());
            if is_async {
                self.integration.cause_reentry();
            }
        }
    }

    pub(crate) fn kill_reason(&self) -> Option<KillReason> {
        self.kill_reason.as_ref().map(|x| x.clone())
    }
}

#[cfg(test)]
mod test {
    use crate::agent::agent::Agent;
    use crate::executor::link::Link;
    use crate::executor::taskcontainer::TaskContainer;
    use crate::integration::integration::SleepQuantity;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;
    use super::*;

    #[test]
    pub fn test_control_kill() {
        /* setup */
        let cfg = RunConfig::new(None,0,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let mut eah = Link::new();
        let cq = Link::new();
        let integration = ReenteringIntegration::new(TestIntegration::new());
        let tc = Agent::new(&cfg,&eah,&cq,&integration,"test");
        tc.run_agent().register(&h);
        /* test */
        assert!(!tc.finish_agent().finishing());
        tc.finish(KillReason::Cancelled);
        assert!(tc.finish_agent().finishing());
        tc.finish(KillReason::Timeout);
        assert!(tc.finish_agent().finishing());
        let actions = eah.drain();
        assert_eq!(1,actions.len());
        if let Action::UnblockTask() = actions[0].1 {
        } else {
            assert!(false);
        }
        assert!(Some(KillReason::Cancelled) == tc.finish_agent().kill_reason());
    }

    #[test]
    pub fn test_internal_finish() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = Link::new();
        let ti = TestIntegration::new();
        let integration = ReenteringIntegration::new(ti.clone());
        /* simulate */
        /* kills are known to be from inside a task should not force reentry */
        let cq = Link::new();
        let tc = Agent::new(&cfg,&eah,&cq,&integration.clone(),"name");
        tc.run_agent().register(&h);
        tc.finish_agent().finish(None,false);
        assert_eq!(ti.get_sleeps().len(),0);
        /* but kills which maybe from outside must */
        let cq = Link::new();
        let tc = Agent::new(&cfg,&eah,&cq,&integration.clone(),"name");
        tc.run_agent().register(&h);
        tc.finish(KillReason::NotNeeded);
        assert_eq!(vec![SleepQuantity::None],*ti.get_sleeps());
    }
}
