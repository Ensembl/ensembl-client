use std::collections::BTreeMap;
use std::sync::{ Arc, Mutex };

/* A TimerSet manages a set of timers. Timers are registered with add() and register a callback.
 * When a timer expires its callback is run on the next call to check(). When a Timer is 
 * registered it also registers some state. tidy_handles() can be called with a callback to
 * ensure that timers are still relevant. The state of each timer is passed to the callback
 * and the timer removed, untriggered, if the callback returns false.
 * 
 * TimerSet is the externally visible object. All state and methods are actually inside TimersState.
 * Within TimersState is a BTree of Timeouts.
 * 
 * TimerSets are used exclusively by Executor.
 */

struct Timeout<S> {
    callback: Box<dyn FnMut() + 'static>,
    state: S
}

struct TimersState<T,S> where T: Ord {
    timeouts: BTreeMap<T,Vec<Timeout<S>>>
}

impl<T,S> TimersState<T,S> where T: Ord+Clone {
    fn new() -> TimersState<T,S> {
        TimersState {
            timeouts: BTreeMap::new(),
        }
    }

    fn add<C>(&mut self, state: S, timeout: T, callback: C) where C: FnMut() + 'static, T: Ord {
        self.timeouts.entry(timeout).or_insert_with(|| {
            Vec::new()
        }).push(Timeout {
            callback: Box::new(callback),
            state
        });
    }

    fn tidy_handles<F>(&mut self, tidy_fn: F) where F: Fn(&S) -> bool {
        /* remove entries until non-empty list */
        for (_,list) in self.timeouts.iter_mut() {
            let mut new = Vec::new();
            for timeout in list.drain(..) {
                if tidy_fn(&timeout.state) {
                    new.push(timeout);
                }
            }
            *list = new;
            if list.len() > 0 {
                break;
            }
        }
        /* remove leading empty lists */
        while let Some(min) = self.min() {
            if let Some(timeouts) = self.timeouts.get(&min) {
                if timeouts.len() != 0 {
                    break;
                }
            }
            self.timeouts.remove(&min);
        }
    }

    fn check(&mut self, now: T) {
        while let Some(min) = self.min() {
            if min > now { break; }
            if let Some(mut timeouts) = self.timeouts.remove(&min) {
                for timeout in timeouts.iter_mut() {
                    (timeout.callback)();
                }
            }
        }
    }

    fn min(&self) -> Option<T> {
        self.timeouts.iter().next().map(|x| x.0.clone())
    }

    fn len(&self) -> usize {
        self.timeouts.len()
    }
}

#[derive(Clone)]
pub(super) struct TimerSet<T,S>(Arc<Mutex<TimersState<T,S>>>) where T: Ord;

impl<T,S> TimerSet<T,S> where T: Ord + Clone {
    pub(super) fn new() -> TimerSet<T,S> {
        TimerSet(Arc::new(Mutex::new(TimersState::new())))
    }

    pub(super) fn add<C>(&mut self, state: S, timeout: T, callback: C) where C: FnMut() + 'static, T: Ord {
        self.0.lock().unwrap().add(state,timeout,callback);
    }

    pub(super) fn min(&self) -> Option<T> {
        self.0.lock().unwrap().min()
    }

    pub(super) fn len(&self) -> usize {
        self.0.lock().unwrap().len()
    }

    pub(super) fn check(&self, now: T) {
        self.0.lock().unwrap().check(now);
    }

    pub(super) fn tidy_handles<F>(&self, tidy_fn: F) where F: Fn(&S) -> bool {
        self.0.lock().unwrap().tidy_handles(tidy_fn);
    }
}

#[cfg(test)]
mod test {
    use ordered_float::OrderedFloat;
    use std::sync::{ Arc, Mutex };
    use crate::executor::taskcontainer::{ TaskContainer, TaskContainerHandle };
    use crate::task::faketask::FakeTask;
    use super::*;

    #[test]
    pub fn test_timer() {
        let mut timers : TimerSet<OrderedFloat<f64>,Option<TaskContainerHandle>> = TimerSet::new();
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        timers.check(OrderedFloat(0.));
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        assert_eq!(None,timers.min());
        timers.add(None,OrderedFloat(1.),move || { *shared2.lock().unwrap() = true });
        assert_eq!(Some(OrderedFloat(1.)),timers.min());
        timers.add(None,OrderedFloat(0.1), || {});
        assert_eq!(Some(OrderedFloat(0.1)),timers.min());
        timers.add(None,OrderedFloat(1.1), || {});
        assert_eq!(Some(OrderedFloat(0.1)),timers.min());
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(OrderedFloat(0.5));
        assert!(!*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        timers.check(OrderedFloat(1.));
        assert!(*shared.lock().unwrap());
        assert!(timers.0.lock().unwrap().timeouts.len()!=0);
        assert_eq!(Some(OrderedFloat(1.1)),timers.min());
        timers.check(OrderedFloat(1.5));
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        assert_eq!(None,timers.min());
    }

    #[test]
    pub fn test_handle_tidy() {
        let mut tasks = TaskContainer::new();
        let mut timers = TimerSet::new();
        let h1 = tasks.allocate();
        let t1 = FakeTask::new(0);
        tasks.set(&h1,Box::new(t1));
        let h2 = tasks.allocate();
        let t2 = FakeTask::new(1);
        tasks.set(&h2,Box::new(t2));
        let h3 = tasks.allocate();
        let t3 = FakeTask::new(2);
        tasks.set(&h3,Box::new(t3));
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
        timers.add(Some(h1.clone()),OrderedFloat(1.),|| {});
        timers.add(Some(h2.clone()),OrderedFloat(2.),|| {});
        timers.add(Some(h3),OrderedFloat(3.),|| {});
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        tasks.remove(&h2);
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        tasks.remove(&h1);
        assert!(timers.0.lock().unwrap().timeouts.len()==3);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        assert_eq!(1,timers.0.lock().unwrap().timeouts.len());
        timers.check(OrderedFloat(4.));
        assert!(timers.0.lock().unwrap().timeouts.len()==0);
    }
}