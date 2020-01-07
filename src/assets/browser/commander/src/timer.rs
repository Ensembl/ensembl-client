/* A TimerSet triggers any triggers which it is given when the timeout of 
 * that trigger is exceeded. "timeout" in this case is just an f64.
 */

// XXX test

use binary_heap_plus::{ BinaryHeap, MinComparator };
use std::cmp::{ Ordering };

use crate::oneshot::Trigger;

pub struct Timeout(f64,Trigger);

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
    pub fn new() -> TimerSet {
        TimerSet {
            timeouts: BinaryHeap::new_min()
        }
    }

    pub fn add(&mut self, timeout: f64, trigger: Trigger) {
        self.timeouts.push(Timeout(timeout,trigger));
    }

    pub fn check(&mut self, now: f64) {
        while let Some(timeout) = self.timeouts.pop() {
            if timeout.0 <= now {
                timeout.1.set();
            } else {
                self.timeouts.push(timeout);
            }
        }
    }
}
