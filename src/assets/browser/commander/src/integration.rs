// YYY unit test all of SleepCatcherIntegration and IntegrationWrapper.

use std::sync::{ Arc, Mutex };

#[derive(PartialEq,Clone)]
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

    pub(crate) fn sleep(&mut self, amount: SleepQuantity) {
        let mut prev_sleep = self.prev_sleep.lock().unwrap();
        if prev_sleep.is_some() && *prev_sleep.as_ref().unwrap() == amount {
            return;
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
pub(crate) struct IntegrationWrapper {
    one_shot: Arc<Mutex<bool>>,
    integration: SleepCatcherIntegration
}

impl IntegrationWrapper {
    pub(crate) fn new<T>(integration: T) -> IntegrationWrapper where T: CommanderIntegration2 + 'static {
        IntegrationWrapper {
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

    pub(crate) fn add_one_shot(&mut self) {
        let mut one_shot = self.one_shot.lock().unwrap();
        if !*one_shot {
            self.integration.sleep(SleepQuantity::None);
        }
        *one_shot = true;
    }

    pub(crate) fn reset_one_shot(&mut self) {
        *self.one_shot.lock().unwrap() = false;
    }
}