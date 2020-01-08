/* Somewhere convenient to store tasks without requiring too much of their
 * signature but allowing handles.
 */

use binary_heap_plus::{ BinaryHeap, MinComparator };

use crate::task2::Task2;

#[derive(Copy,Clone,PartialEq,Eq,PartialOrd,Ord,Hash)]
pub(crate) struct TaskHandle(usize);

pub(crate) struct TaskContainer {
    free_slots: BinaryHeap<usize,MinComparator>,
    tasks: Vec<Option<Box<dyn Task2>>>
}

impl TaskContainer {
    pub(crate) fn new() -> TaskContainer {
        TaskContainer {
            free_slots: BinaryHeap::new_min(),
            tasks: Vec::new()
        }
    }

    pub(crate) fn allocate(&mut self) -> TaskHandle {
        let slot = self.free_slots.pop().unwrap_or_else(|| {
            self.tasks.push(None);
            self.tasks.len()-1
        });
        self.tasks[slot] = None;
        TaskHandle(slot)
    }

    pub(crate) fn set<T>(&mut self, handle: TaskHandle, task: T) where T: Task2 + 'static {
        self.tasks[handle.0] = Some(Box::new(task));
    }

    pub(crate) fn remove(&mut self, handle: TaskHandle) {
        self.tasks[handle.0] = None;
        self.free_slots.push(handle.0);
    }

    pub(crate) fn get(&self, handle: TaskHandle) -> &Box<dyn Task2> { self.tasks[handle.0].as_ref().unwrap() }
    pub(crate) fn get_mut(&mut self, handle: TaskHandle) -> &mut Box<dyn Task2> { self.tasks[handle.0].as_mut().unwrap() }

    #[allow(unused)] /* used in tests */
    pub(crate) fn len(&self) -> usize { self.tasks.len() - self.free_slots.len() }
}

#[allow(unused)]
mod test {
    use super::*;

    struct FakeTask(i8);
    impl Task2 for FakeTask {
        fn run(&mut self, now: f64) { self.0 += 1; }
        fn get_priority(&self) -> i8 { self.0 }
        fn get_name(&self) -> String { "".to_string() }
    }

    #[test]
    pub fn test_container() {
        let mut tasks = TaskContainer::new();
        assert!(tasks.tasks.len()==0);
        assert!(tasks.free_slots.len()==0);
        let t1 = FakeTask(1);
        let t2 = FakeTask(2);
        let t3 = FakeTask(3);
        let h1 = tasks.allocate();
        tasks.set(h1,t1);
        let h2 = tasks.allocate();
        tasks.set(h2,t2);
        let h3 = tasks.allocate();
        tasks.set(h3,t3);
        assert_eq!(0,h1.0);
        assert_eq!(1,h2.0);
        assert_eq!(2,h3.0);
        tasks.remove(h2);
        assert!(tasks.free_slots.len()==1);
        assert_eq!(1,*tasks.free_slots.peek().unwrap());
        tasks.remove(h1);
        assert!(tasks.free_slots.len()==2);
        assert_eq!(0,*tasks.free_slots.peek().unwrap());
        let t4 = FakeTask(4);
        let h4 = tasks.allocate();
        tasks.set(h4,t4);
        assert_eq!(0,h4.0);
        assert!(tasks.free_slots.len()==1);
        assert_eq!(1,*tasks.free_slots.peek().unwrap());
        assert_eq!(4,tasks.get(h4).get_priority());
        tasks.get_mut(h4).run(0.);
        assert_eq!(5,tasks.get(h4).get_priority());
    }
}
