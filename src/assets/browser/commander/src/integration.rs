use std::sync::{ Arc, Mutex };

#[derive(PartialEq,Clone)]
#[cfg_attr(test,derive(Debug))]
pub enum SleepQuantity {
    None,
    Time(f64),
    Forever
}

pub trait CommanderIntegration2 : Send {
    fn current_time(&mut self) -> f64;
    fn sleep(&mut self, amount: SleepQuantity);
}

/* To make an integration's life easier we catch all duplicate sleep calls as changing
 * strategy might be expensive.
 */

#[derive(Clone)]
struct SleepCatcherIntegration {
    integration: Arc<Mutex<dyn CommanderIntegration2>>,
    prev_sleep: Arc<Mutex<Option<SleepQuantity>>>
}

impl SleepCatcherIntegration {
    pub(crate) fn new<T>(integration: T) -> SleepCatcherIntegration where T: CommanderIntegration2 + 'static {
        SleepCatcherIntegration {
            integration: Arc::new(Mutex::new(integration)),
            prev_sleep: Arc::new(Mutex::new(None))
        }
    }

    pub(crate) fn current_time(&mut self) -> f64 {
        self.integration.lock().unwrap().current_time()
    }

    // XXX test non-sc sleep
    pub(crate) fn sleep(&mut self, amount: SleepQuantity) {
        let mut prev_sleep = self.prev_sleep.lock().unwrap();
        match amount {
            SleepQuantity::Forever | SleepQuantity::None => {
                if prev_sleep.is_some() && *prev_sleep.as_ref().unwrap() == amount {
                    return;
                }
            },
            _ => {}
        }
        self.integration.lock().unwrap().sleep(amount.clone());
        *prev_sleep = Some(amount);
    }
}

/* IntegrationWrapper handles one-shot requests which are necessary to avoid races.
 * A one-shot guarantees that a new call to tick() is made soon, irrespective of
 * sleep state. It's reset on the way into tick() and set by any callbacks. If these
 * should race then it's ok because tick() is just about to be called anyway: if reset
 * happens before set then we are ok anyway, as we'll get another run; if set happens
 * before reset, it definitely happens before the next tick() run (because reset does,
 * too), so the set will be followed by a run.
 * 
 * One-shot does its work by intercepting SleepQuantity commands. tick() always fixes
 * updates SleepQuantities and extra runs are fine, so all we need to do is to send 
 * SleepQuantity::None's at appropriate times. We send them when one-shot is first set
 * (per contract) and refuse to send anything else _while_ it is set.
 */

#[derive(Clone)]
pub(crate) struct ReenteringIntegration {
    one_shot: Arc<Mutex<bool>>,
    integration: SleepCatcherIntegration
}

impl ReenteringIntegration {
    pub(crate) fn new<T>(integration: T) -> ReenteringIntegration where T: CommanderIntegration2 + 'static {
        ReenteringIntegration {
            one_shot: Arc::new(Mutex::new(false)),
            integration: SleepCatcherIntegration::new(integration)
        }
    }

    pub(crate) fn current_time(&mut self) -> f64 {
        self.integration.current_time()
    }

    pub(crate) fn sleep(&mut self, amount: SleepQuantity) {
        let one_shot = self.one_shot.lock().unwrap();
        if !*one_shot {
            self.integration.sleep(amount);
        }
    }

    pub(crate) fn cause_reentry(&mut self) {
        let mut one_shot = self.one_shot.lock().unwrap();
        if !*one_shot {
            self.integration.sleep(SleepQuantity::None);
        }
        *one_shot = true;
    }

    pub(crate) fn reentering(&mut self) {
        *self.one_shot.lock().unwrap() = false;
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::testintegration::TestIntegration;

    #[test]
    pub fn test_sleep_catcher() {
        let mut integration = TestIntegration::new();
        let mut sc = SleepCatcherIntegration::new(integration.clone());
        sc.sleep(SleepQuantity::None); /* pushed (new) */
        sc.sleep(SleepQuantity::None); /* not pushed (copy) */
        sc.sleep(SleepQuantity::Forever); /* pushed (different) */
        sc.sleep(SleepQuantity::None); /* pushed (different) */
        sc.sleep(SleepQuantity::Time(1.)); /* pushed (different) */
        sc.sleep(SleepQuantity::Time(2.)); /* pushed (different) */
        sc.sleep(SleepQuantity::Time(2.)); /* pushed (copy but of time) */
        sc.sleep(SleepQuantity::Time(1.)); /* pushed (different) */
        sc.sleep(SleepQuantity::Forever); /* pushed (different) */
        sc.sleep(SleepQuantity::Forever); /* not pushed (copy) */
        assert_eq!(*integration.get_sleeps(),vec![
            SleepQuantity::None,
            SleepQuantity::Forever,
            SleepQuantity::None,
            SleepQuantity::Time(1.),
            SleepQuantity::Time(2.),
            SleepQuantity::Time(2.),
            SleepQuantity::Time(1.),
            SleepQuantity::Forever
        ]);
    }

    pub fn test_one_shot() {
        let mut integration = TestIntegration::new();
        let mut sc = ReenteringIntegration::new(integration.clone());
        assert_eq!(4.,sc.current_time());
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
