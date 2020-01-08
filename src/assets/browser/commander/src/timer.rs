/* A TimerSet triggers any triggers which it is given when the timeout of 
 * that trigger is exceeded. "timeout" in this case is just an f64 passed
 * to a polled check method.
 */

use binary_heap_plus::{ BinaryHeap, MinComparator };
use std::cmp::{ Ordering };

use crate::edgetrigger::EdgeTrigger;

struct Timeout(f64,EdgeTrigger<'static>);

impl PartialEq for Timeout {
    fn eq(&self, other: &Timeout) -> bool { self.0 == other.0 }
}

impl Eq for Timeout {}

impl Ord for Timeout {
    fn cmp(&self, other: &Timeout) -> Ordering {
        self.0.partial_cmp(&other.0).unwrap()
    }
}

impl PartialOrd for Timeout {
    fn partial_cmp(&self, other: &Timeout) -> Option<Ordering> {
        Some(self.cmp(&other))
    }
}

pub struct TimerSet {
    timeouts:BinaryHeap<Timeout,MinComparator>
}

impl TimerSet {
    pub(crate) fn new() -> TimerSet {
        TimerSet {
            timeouts: BinaryHeap::new_min()
        }
    }

    pub fn add<T>(&mut self, timeout: f64,callback: T) where T: FnMut() + 'static {
        let trigger = EdgeTrigger::new(callback);
        self.timeouts.push(Timeout(timeout,trigger));
    }

    pub(crate) fn check(&mut self, now: f64) {
        while let Some(mut timeout) = self.timeouts.pop() {
            if timeout.0 <= now {
                timeout.1.set();
            } else {
                self.timeouts.push(timeout);
                break;
            }
        }
    }

    #[allow(unused)] // used in tests
    pub(crate) fn empty(&self) -> bool {
        self.timeouts.len() == 0
    }
}

#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::edgetrigger::EdgeTrigger;
    use super::*;

    #[test]
    pub fn test_timer() {
        let mut timers = TimerSet::new();
        assert!(timers.empty());
        timers.check(0.);
        assert!(timers.empty());
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        timers.add(1.,move || { *shared2.lock().unwrap() = true });
        timers.add(0.1, || {});
        timers.add(1.1, || {});
        assert!(!*shared.lock().unwrap());
        assert!(!timers.empty());
        timers.check(0.5);
        assert!(!*shared.lock().unwrap());
        assert!(!timers.empty());
        timers.check(1.);
        assert!(*shared.lock().unwrap());
        assert!(!timers.empty());
        timers.check(1.5);
        assert!(timers.empty());
    }
}