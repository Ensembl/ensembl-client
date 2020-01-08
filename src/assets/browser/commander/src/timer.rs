/* A TimerSet triggers any triggers which it is given when the timeout of 
 * that trigger is exceeded. "timeout" in this case is just an f64 passed
 * to a polled check method.
 */

use binary_heap_plus::{ BinaryHeap, MinComparator };
use std::cmp::{ Ordering };
use std::sync::{ Arc, Mutex };

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

struct TimerSetImpl {
    timeouts: BinaryHeap<Timeout,MinComparator>
}

impl TimerSetImpl {
    fn new() -> TimerSetImpl {
        TimerSetImpl {
            timeouts: BinaryHeap::new_min()
        }
    }

    fn add<T>(&mut self, timeout: f64,callback: T) where T: FnMut() + 'static {
        let trigger = EdgeTrigger::new(callback);
        self.timeouts.push(Timeout(timeout,trigger));
    }

    fn check(&mut self, now: f64) {
        while let Some(mut timeout) = self.timeouts.pop() {
            if timeout.0 <= now {
                timeout.1.set();
            } else {
                self.timeouts.push(timeout);
                break;
            }
        }
    }
}

#[derive(Clone)]
pub(crate) struct TimerSet(Arc<Mutex<TimerSetImpl>>);

impl TimerSet {
    pub(crate) fn new() -> TimerSet {
        TimerSet(Arc::new(Mutex::new(TimerSetImpl::new())))
    }

    pub(crate) fn add<T>(&mut self, timeout: f64,callback: T) where T: FnMut() + 'static {
        self.0.lock().unwrap().add(timeout,callback);
    }

    pub(crate) fn check(&mut self, now: f64) {
        self.0.lock().unwrap().check(now);
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
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        timers.check(0.);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        timers.add(1.,move || { *shared2.lock().unwrap() = true });
        timers.add(0.1, || {});
        timers.add(1.1, || {});
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(0.5);
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(1.);
        assert!(*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(1.5);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
    }
}