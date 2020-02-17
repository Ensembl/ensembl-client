use std::collections::BTreeMap;
use crate::executor::taskcontainer::{ TaskContainer, TaskContainerHandle };
use super::runqueue::RunQueue;

/* A Runnable contains a group of RunQueues. Each RunQueue has a different priority.
 * When asked to run a task, Runnable diverts the call to the RunQueue with the
 * highest priority.
 */

pub(super) struct Runnable {
    queues: BTreeMap<i8,RunQueue>
}

impl Runnable {
    pub(super) fn new() -> Runnable {
        Runnable {
            queues: BTreeMap::new()
        }
    }

    pub(super) fn add(&mut self, tasks: &TaskContainer, handle: &TaskContainerHandle) {
        if let Some(task) = tasks.get(handle) {
            let queue = self.queues.entry(task.get_priority()).or_insert_with(||
                RunQueue::new()
            );
            queue.add(handle);
        }
    }

    pub(super) fn remove(&mut self, tasks: &TaskContainer, handle: &TaskContainerHandle) {
        if let Some(task) = tasks.get(handle) {
            let mut doomed = false;
            if let Some(queue) = self.queues.get_mut(&task.get_priority()) {
                queue.remove(handle);
                if queue.empty() {
                    doomed = true;
                }
            }
            if doomed {
                self.queues.remove(&task.get_priority());
            }
        }
    }

    fn first_queue(&mut self) -> Option<&mut RunQueue> {
        self.queues.iter_mut().next().map(|x| x.1)
    }

    pub(super) fn empty(&self) -> bool { self.queues.len() == 0 }

    pub(super) fn run(&mut self, tasks: &mut TaskContainer, tick_index: u64) -> bool {
        if let Some(queue) = self.first_queue() {
            queue.run(tasks,tick_index);
            true
        } else {
            false
        }
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use std::sync::{ Arc, Mutex };
    use crate::task::task::{ TaskSummary, KillReason };
    use crate::task::taskhandle::ExecutorTaskHandle;
    use crate::helper::tidier::Tidier;

    #[derive(Clone)]
    struct FakeTask(i8,Arc<Mutex<i8>>);
    impl ExecutorTaskHandle for FakeTask {
        fn run(&mut self, tick_index: u64) { *self.1.lock().unwrap() += 1; }
        fn get_priority(&self) -> i8 { self.0 }
        fn summarize(&self) -> Option<TaskSummary> { None }
        fn evict(&self) {}
        fn kill(&self, reason: KillReason) {}
        fn set_identity(&self, identity: u64) {}
    }

    // XXX common harness

    #[test]
    pub fn test_runnable() {
        let mut tasks = TaskContainer::new();
        let mut r = Runnable::new();
        /* 1: h1, h2; 2: h3, 3: h4 */
        let h1 = tasks.allocate();
        let t1 = FakeTask(1,Arc::new(Mutex::new(0)));
        tasks.set(&h1,Box::new(t1.clone()));
        let h2 = tasks.allocate();
        let t2 = FakeTask(1,Arc::new(Mutex::new(0)));
        tasks.set(&h2,Box::new(t2.clone()));
        let h3 = tasks.allocate();
        let t3 = FakeTask(2,Arc::new(Mutex::new(0)));
        tasks.set(&h3,Box::new(t3.clone()));
        let h4 = tasks.allocate();
        let t4 = FakeTask(3,Arc::new(Mutex::new(0)));
        tasks.set(&h4,Box::new(t4.clone()));
        /* add all four and check just h1, h2 run */
        r.add(&mut tasks,&h1);
        r.add(&mut tasks,&h2);
        r.add(&mut tasks,&h3);
        r.add(&mut tasks,&h4);
        r.run(&mut tasks,0);
        r.run(&mut tasks,0);
        r.run(&mut tasks,0);
        assert_eq!(2,*t1.1.lock().unwrap());
        assert_eq!(1,*t2.1.lock().unwrap());
        assert_eq!(0,*t3.1.lock().unwrap());
        assert_eq!(0,*t4.1.lock().unwrap());
        /* remove h1 and check h2 just runs */
        r.remove(&mut tasks,&h1);
        r.run(&mut tasks,0);
        r.run(&mut tasks,0);
        assert_eq!(2,*t1.1.lock().unwrap());
        assert_eq!(3,*t2.1.lock().unwrap());
        assert_eq!(0,*t3.1.lock().unwrap());
        assert_eq!(0,*t4.1.lock().unwrap());
        /* remove h2 and check just h3 runs */
        r.remove(&mut tasks,&h2);
        r.run(&mut tasks,0);
        assert!(r.run(&mut tasks,0));
        assert_eq!(2,*t1.1.lock().unwrap());
        assert_eq!(3,*t2.1.lock().unwrap());
        assert_eq!(2,*t3.1.lock().unwrap());
        assert_eq!(0,*t4.1.lock().unwrap());
        /* remove h3 and h4 and check run returns false */
        r.remove(&mut tasks,&h3);
        r.remove(&mut tasks,&h4);
        assert!(!r.run(&mut tasks,0));
    }
}
