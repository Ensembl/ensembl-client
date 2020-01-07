use std::collections::BTreeMap;
use crate::taskcontainer::{ TaskContainer, TaskHandle };
use crate::runqueue::RunQueue2;

pub struct Runnable {
    queues: BTreeMap<i8,RunQueue2>
}

impl Runnable {
    pub fn new() -> Runnable {
        Runnable {
            queues: BTreeMap::new()
        }
    }

    pub fn add(&mut self, tasks: &TaskContainer, handle: &TaskHandle) {
        let priority = tasks.get(*handle).get_priority();
        let queue = self.queues.entry(priority).or_insert_with(||
            RunQueue2::new(priority)
        );
        queue.add(handle);
    }

    pub fn remove(&mut self, tasks: &TaskContainer, handle: &TaskHandle) {
        let priority = tasks.get(*handle).get_priority();
        let mut doomed = false;
        if let Some(queue) = self.queues.get_mut(&priority) {
            queue.remove(handle);
            if queue.empty() {
                doomed = true;
            }
        }
        if doomed {
            self.queues.remove(&priority);
        }
    }

    pub fn run(&mut self, tasks: &mut TaskContainer) -> bool {
        if let Some(mut queue) = self.queues.iter_mut().next() {
            queue.1.run(tasks);
            true
        } else {
            false
        }
    }
}