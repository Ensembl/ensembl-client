use std::future::Future;
use std::pin::Pin;

use crate::executor::action::{ Action, TaskActionLink };
use crate::integration::reentering::ReenteringIntegration;
use crate::task::task::KillReason;
use crate::helper::tidier::Tidier;

/* FinishAgent is the Agent mixin responsible for destructors and signals */

pub(crate) struct FinishAgent {
    tidiers: Vec<Pin<Box<Tidier>>>,
    kill_reason: Option<KillReason>,
    finishing: bool,
    done_sent: bool,
    integration: ReenteringIntegration,
    task_action_link: TaskActionLink,
}

impl FinishAgent {
    pub(super) fn new(integration: &ReenteringIntegration, task_action_link: &TaskActionLink) -> FinishAgent {
        FinishAgent {
            tidiers: Vec::new(),
            kill_reason: None,
            finishing: false,
            done_sent: false,
            integration: integration.clone(),
            task_action_link: task_action_link.clone()
        }
    }

    pub(super) fn make_tidier<T>(&mut self, inner: T) -> Tidier where T: Future<Output=()> + 'static + Send {
        let t = Tidier::new(Box::pin(inner));
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

    pub(super) fn finished(&mut self) -> bool {
        let out = self.finishing && self.tidiers.len() == 0;
        if out {
            if !self.done_sent {
                self.task_action_link.add(Action::Done());
            }
            self.done_sent = true;
        }
        out
    }

    pub(super) fn get_tidier(&self) -> Option<&Pin<Box<Tidier>>> {
        self.tidiers.get(0)
    }

    pub(super) fn finish(&mut self, reason: Option<&KillReason>, is_async: bool) {
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
