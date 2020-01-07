use std::cmp::Ordering;
use crate::taskcontainer::{ TaskContainer, TaskHandle };

pub struct RunQueue2 {
    tasks: Vec<TaskHandle>,
    priority: i8,
    next_task: usize
}

impl RunQueue2 {
    pub fn new(priority: i8) -> RunQueue2 {
        RunQueue2 {
            tasks: Vec::new(),
            priority,
            next_task: 0
        }
    }

    pub fn empty(&self) -> bool {
        self.tasks.len() == 0
    }

    pub fn add(&mut self, handle: &TaskHandle) {
        self.tasks.push(*handle);
    }

    pub fn remove(&mut self, handle: &TaskHandle) {
        if let Some(index) = self.tasks.iter().position(|h| h == handle) {
            if index < self.next_task {
                self.next_task -= 1;
            }
            self.tasks.remove(index);
        }
    }

    pub fn run(&mut self, tasks: &mut TaskContainer) {
        if self.next_task >= self.tasks.len() {
            self.next_task = 0;
        }
        tasks.get_mut(self.tasks[self.next_task]).run();
        self.next_task += 1;
    }
}
