use std::sync::{ Arc, Mutex };
use super::integration::{ Integration, SleepQuantity };

/* ReenteringIntegration and SleepCatcherIntegration wrap the user's supplied
 * integration. The innermost of these is SleepCactherIntegration. A user's
 * implementation of sleep() may well be expensive, requiring event calls, etc and
 * the executor may issue repeated, redundant calls. This is particularly acute
 * after passing through ReenteringIntegration whcih issues many sleep() calls in
 * routine operaiton. To avoid these expensive calls to assist the user, we catch
 * them here and do not issue them.
 */

#[derive(Clone)]
pub(super) struct SleepCatcherIntegration {
    integration: Arc<Mutex<dyn Integration>>,
    prev_sleep: Arc<Mutex<Option<SleepQuantity>>>
}

impl SleepCatcherIntegration {
    pub(super) fn new<T>(integration: T) -> SleepCatcherIntegration where T: Integration + 'static {
        SleepCatcherIntegration {
            integration: Arc::new(Mutex::new(integration)),
            prev_sleep: Arc::new(Mutex::new(None))
        }
    }

    pub(super) fn current_time(&self) -> f64 {
        self.integration.lock().unwrap().current_time()
    }

    pub(super) fn sleep(&self, amount: SleepQuantity) {
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

#[cfg(test)]
mod test {
    use crate::integration::testintegration::TestIntegration;
    use super::super::integration::SleepQuantity;
    use super::*;

    #[test]
    pub fn test_sleep_catcher() {
        let integration = TestIntegration::new();
        let sc = SleepCatcherIntegration::new(integration.clone());
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
}