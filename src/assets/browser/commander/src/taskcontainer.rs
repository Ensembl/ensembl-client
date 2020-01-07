use binary_heap_plus::{ BinaryHeap, MinComparator };

use crate::task2::Task2;

#[derive(Copy,Clone,PartialEq)]
pub struct TaskHandle(usize);

pub struct TaskContainer {
    free_slots: BinaryHeap<usize,MinComparator>,
    tasks: Vec<Option<Box<dyn Task2>>>
}

impl TaskContainer {
    pub fn new() -> TaskContainer {
        TaskContainer {
            free_slots: BinaryHeap::new_min(),
            tasks: Vec::new()
        }
    }

    pub fn allocate(&mut self) -> TaskHandle {
        let slot = self.free_slots.pop().unwrap_or_else(|| {
            self.tasks.push(None);
            self.tasks.len()-1
        });
        self.tasks[slot] = None;
        TaskHandle(slot)
    }

    pub fn set<T>(&mut self, handle: &TaskHandle, task: T) where T: Task2 + 'static {
        self.tasks[handle.0] = Some(Box::new(task));
    }

    pub fn remove(&mut self, handle: TaskHandle) {
        self.tasks[handle.0] = None;
        self.free_slots.push(handle.0);
    }

    pub fn get(&self, handle: TaskHandle) -> &Box<Task2> { self.tasks[handle.0].as_ref().unwrap() }
    pub fn get_mut(&mut self, handle: TaskHandle) -> &mut Box<Task2> { self.tasks[handle.0].as_mut().unwrap() }
}