use std::sync::{ Arc, Mutex };
use super::integration::{ Integration, SleepQuantity };
use super::sleepcatcher::SleepCatcherIntegration;

/* ReenteringIntegration and SleepCatcherIntegration wrap the user's supplied
 * integration. The outermost of these is ReenteringIntegration, and is the struct
 * abstracts certain races. It provides "cause_reentry" to the executor which ensures
 * that the sleep quantity is always None after that call until reentering() is called
 * (by the excutor on reentry). This allows a running task to guarantess a call on the
 * next poll event.
 */

#[derive(Clone)]
pub(crate) struct ReenteringIntegration {
    force_no_delay: Arc<Mutex<bool>>,
    integration: SleepCatcherIntegration
}

impl ReenteringIntegration {
    pub(crate) fn new<T>(integration: T) -> ReenteringIntegration where T: Integration + 'static {
        ReenteringIntegration {
            force_no_delay: Arc::new(Mutex::new(false)),
            integration: SleepCatcherIntegration::new(integration)
        }
    }

    pub(crate) fn current_time(&self) -> f64 {
        self.integration.current_time()
    }

    pub(crate) fn sleep(&self, amount: SleepQuantity) {
        let force_no_delay = self.force_no_delay.lock().unwrap();
        if !*force_no_delay {
            self.integration.sleep(amount);
        }
    }

    pub(crate) fn cause_reentry(&self) {
        let mut force_no_delay = self.force_no_delay.lock().unwrap();
        if !*force_no_delay {
            self.integration.sleep(SleepQuantity::None);
        }
        *force_no_delay = true;
    }

    pub(crate) fn reentering(&mut self) {
        *self.force_no_delay.lock().unwrap() = false;
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
    pub fn test_reentry() {
        /* setup */
        let cfg = RunConfig::new(None,2,None);
        let mut tasks = TaskContainer::new();
        let h = tasks.allocate();
        let eah = Link::new();
        let ti = TestIntegration::new();
        let mut integration = ReenteringIntegration::new(ti.clone());
        let cq = Link::new();
        let tc = Agent::new(&cfg,&eah,&cq,&integration.clone(),"name");
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
    pub fn test_force_no_delay() {
        let integration = TestIntegration::new();
        let mut sc = ReenteringIntegration::new(integration.clone());
        sc.sleep(SleepQuantity::None); /* push SleepQuantity::None */
        sc.sleep(SleepQuantity::Time(1.)); /* push SleepQuantity::Time(1.) */
        sc.cause_reentry(); /* push SleepQuantity::None */
        sc.sleep(SleepQuantity::Time(2.)); /* ignored */
        sc.sleep(SleepQuantity::Forever); /* ignored */
        sc.sleep(SleepQuantity::None); /* ignored */
        sc.reentering();
        sc.sleep(SleepQuantity::Time(3.)); /* push SleepQuantity::Time(3.) */
        sc.sleep(SleepQuantity::None); /* push SleepQuantity::None */
        sc.cause_reentry(); /* duplicate caught */
        sc.reentering();
        sc.sleep(SleepQuantity::Forever); /* push SleepQuantity::Forever */
        assert_eq!(*integration.get_sleeps(),vec![
            SleepQuantity::None,
            SleepQuantity::Time(1.),
            SleepQuantity::None,
            SleepQuantity::Time(3.),
            SleepQuantity::None,
            SleepQuantity::Forever
        ]);
    }
}
