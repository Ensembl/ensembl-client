/* A TimerSet triggers any triggers which it is given when the timeout of 
 * that trigger is exceeded. "timeout" in this case is just an f64 passed
 * to a polled check method.
 */

use binary_heap_plus::{ BinaryHeap, MinComparator };
use std::cmp::{ Ordering };
use std::sync::{ Arc, Mutex };

use crate::taskcontainer::{ TaskContainer, TaskContainerHandle };
use crate::edgetrigger::EdgeTrigger;

struct Timeout<T>(f64,u64,EdgeTrigger<'static>,T);

impl<T> PartialEq for Timeout<T> {
    fn eq(&self, other: &Timeout<T>) -> bool { self.0 == other.0 && self.1 == other.1 }
}

impl<T> Eq for Timeout<T> {}

impl<T> Ord for Timeout<T> {
    fn cmp(&self, other: &Timeout<T>) -> Ordering {
        self.0.partial_cmp(&other.0).unwrap()
    }
}

impl<T> PartialOrd for Timeout<T> {
    fn partial_cmp(&self, other: &Timeout<T>) -> Option<Ordering> {
        Some(self.cmp(&other))
    }
}

struct TimerSetImpl<T> {
    timeouts: BinaryHeap<Timeout<T>,MinComparator>,
    next: u64
}

impl<H> TimerSetImpl<H> {
    fn new() -> TimerSetImpl<H> {
        TimerSetImpl {
            timeouts: BinaryHeap::new_min(),
            next: 0
        }
    }

    fn add<T>(&mut self, taskhandle: H, timeout: f64,callback: T) where T: FnMut() + 'static + Send {
        self.next += 1;
        let trigger = EdgeTrigger::new(callback);
        self.timeouts.push(Timeout(timeout,self.next,trigger,taskhandle));
    }

    fn tidy_handles<T>(&mut self, tidy_fn: T) where T: Fn(&H) -> bool {
        while let Some(timeout) = self.timeouts.pop() {
            if !tidy_fn(&timeout.3) {
                continue;
            }
            self.timeouts.push(timeout);
            break;
        }
    }

    fn check(&mut self, now: f64) {
        while let Some(mut timeout) = self.timeouts.pop() {
            if timeout.0 <= now {
                timeout.2.set();
            } else {
                self.timeouts.push(timeout);
                break;
            }
        }
    }

    fn min(&mut self) -> Option<f64> {
        self.timeouts.peek().map(|x| x.0)
    }
}

#[derive(Clone)]
pub(crate) struct TimerSet<H>(Arc<Mutex<TimerSetImpl<H>>>);

impl<H> TimerSet<H> {
    pub(crate) fn new() -> TimerSet<H> {
        TimerSet(Arc::new(Mutex::new(TimerSetImpl::new())))
    }

    pub(crate) fn add<T>(&mut self, taskhandle: H, timeout: f64,callback: T) where T: FnMut() + 'static + Send {
        self.0.lock().unwrap().add(taskhandle,timeout,callback);
    }

    pub(crate) fn min(&self) -> Option<f64> {
        self.0.lock().unwrap().min()
    }

    pub(crate) fn check(&mut self, now: f64) {
        self.0.lock().unwrap().check(now);
    }

    pub(crate) fn tidy_handles<T>(&mut self, tidy_fn: T) where T: Fn(&H) -> bool {
        self.0.lock().unwrap().tidy_handles(tidy_fn);
    }
}


#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::edgetrigger::EdgeTrigger;
    use crate::task2::Task2;
    use super::*;

    struct FakeTask(i8);
    impl Task2 for FakeTask {
        fn run(&mut self, tick_index: u64) { self.0 += 1; }
        fn get_priority(&self) -> i8 { self.0 }
        fn get_name(&self) -> String { "".to_string() }
    }

    #[test]
    pub fn test_timer() {
        let tc = TaskContainer::new();
        let mut timers = TimerSet::<Option<TaskContainerHandle>>::new();
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        timers.check(0.);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        assert_eq!(None,timers.min());
        timers.add(None,1.,move || { *shared2.lock().unwrap() = true });
        assert_eq!(Some(1.),timers.min());
        timers.add(None,0.1, || {});
        assert_eq!(Some(0.1),timers.min());
        timers.add(None,1.1, || {});
        assert_eq!(Some(0.1),timers.min());
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(0.5);
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(1.);
        assert!(*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        assert_eq!(Some(1.1),timers.min());
        timers.check(1.5);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        assert_eq!(None,timers.min());
    }

    #[test]
    pub fn test_handle_tidy() {
        let mut tasks = TaskContainer::new();
        let mut timers = TimerSet::new();
        let h1 = tasks.allocate();
        let t1 = FakeTask(0);
        tasks.set(&h1,t1);
        let h2 = tasks.allocate();
        let t2 = FakeTask(1);
        tasks.set(&h2,t2);
        let h3 = tasks.allocate();
        let t3 = FakeTask(2);
        tasks.set(&h3,t3);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        timers.add(Some(h1.clone()),1.,|| {});
        timers.add(Some(h2.clone()),2.,|| {});
        timers.add(Some(h3),3.,|| {});
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        tasks.remove(&h2);
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        tasks.remove(&h1);
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        assert!(timers.0.lock().unwrap().timeouts.len()==1);
        timers.check(4.);
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
    }
}