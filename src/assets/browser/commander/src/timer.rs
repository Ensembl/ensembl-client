use std::collections::BTreeMap;
use std::fmt::Debug;
use std::sync::{ Arc, Mutex };
use crate::edgetrigger::EdgeTrigger;

struct Timeout<S> {
    trigger: EdgeTrigger<'static>,
    state: S
}

struct TimersState<T,S> where T: Ord {
    timeouts: BTreeMap<T,Vec<Timeout<S>>>
}

impl<T,S> TimersState<T,S> where T: Ord+Clone+Debug { // XXX not debug
    pub fn new() -> TimersState<T,S> {
        TimersState {
            timeouts: BTreeMap::new(),
        }
    }

    fn add<C>(&mut self, state: S, timeout: T, callback: C) where C: FnMut() + 'static + Send, T: Ord {
        let trigger = EdgeTrigger::new(callback);
        self.timeouts.entry(timeout).or_insert_with(|| {
            Vec::new()
        }).push(Timeout {
            trigger,
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
                    timeout.trigger.set();
                }
            }
        }
    }

    fn min(&mut self) -> Option<T> {
        self.timeouts.iter().next().map(|x| x.0.clone())
    }
}

#[derive(Clone)]
pub(crate) struct TimerSet<T,S>(Arc<Mutex<TimersState<T,S>>>) where T: Ord;

impl<T,S> TimerSet<T,S> where T: Ord + Clone + Debug { // XXX Debug
    pub(crate) fn new() -> TimerSet<T,S> {
        TimerSet(Arc::new(Mutex::new(TimersState::new())))
    }

    pub(crate) fn add<C>(&mut self, state: S, timeout: T, callback: C) where C: FnMut() + 'static + Send, T: Ord + Debug {
        self.0.lock().unwrap().add(state,timeout,callback);
    }

    pub(crate) fn min(&mut self) -> Option<T> {
        self.0.lock().unwrap().min()
    }

    pub(crate) fn check(&mut self, now: T) {
        self.0.lock().unwrap().check(now);
    }

    pub(crate) fn tidy_handles<F>(&mut self, tidy_fn: F) where F: Fn(&S) -> bool {
        self.0.lock().unwrap().tidy_handles(tidy_fn);
    }
}

#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use ordered_float::OrderedFloat;
    use crate::edgetrigger::EdgeTrigger;
    use crate::taskcontainer::{ TaskContainer, TaskContainerHandle };
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
        let t1 = FakeTask(0);
        tasks.set(&h1,t1);
        let h2 = tasks.allocate();
        let t2 = FakeTask(1);
        tasks.set(&h2,t2);
        let h3 = tasks.allocate();
        let t3 = FakeTask(2);
        tasks.set(&h3,t3);
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