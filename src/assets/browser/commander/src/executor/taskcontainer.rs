use binary_heap_plus::{ BinaryHeap, MinComparator };
use hashbrown::HashSet;
use crate::task::taskhandle::ExecutorTaskHandle;

/* A TaskContainer is a place to store ExecutorTasks and give them a convenient
 * handle, a TaskContainerHandle. This can be passed around, cloned, etc, with
 * impunity. The executor can then extract the corresponding ExecutorTask. The
 * handle comprises a tuple. The first arg is the slot where the Task is/was stored,
 * the second a globally unique identifier to ensure that the handle is current.
 */

#[derive(Clone,PartialEq,Eq,PartialOrd,Ord,Hash)]
pub(crate) struct TaskContainerHandle(usize,u64);

impl TaskContainerHandle {
    pub(crate) fn identity(&self) -> u64 { self.1 }
}

pub(crate) struct TaskContainer {
    free_slots: BinaryHeap<usize,MinComparator>,
    tasks: Vec<Option<Box<dyn ExecutorTaskHandle>>>,
    current: HashSet<TaskContainerHandle>,
    identity: u64
}

impl TaskContainer {
    pub(crate) fn new() -> TaskContainer {
        TaskContainer {
            free_slots: BinaryHeap::new_min(),
            tasks: Vec::new(),
            current: HashSet::new(),
            identity: 2
        }
    }

    pub(crate) fn allocate(&mut self) -> TaskContainerHandle {
        let slot = self.free_slots.pop().unwrap_or_else(|| {
            self.tasks.push(None);
            self.tasks.len()-1
        });
        self.tasks[slot] = None;
        let out = TaskContainerHandle(slot,self.identity);
        self.current.insert(out.clone());
        self.identity += 1;
        out
    }

    pub(super) fn all_handles(&self) -> Vec<TaskContainerHandle> {
        self.current.iter().cloned().collect()
    }

    pub(crate) fn set(&mut self, handle: &TaskContainerHandle, task: Box<dyn ExecutorTaskHandle>) {
        self.tasks[handle.0] = Some(task);
    }

    pub(crate) fn remove(&mut self, handle: &TaskContainerHandle) {
        if self.current.contains(&handle) {
            self.current.remove(&handle);
            self.tasks[handle.0] = None;
            self.free_slots.push(handle.0);
        }
    }

    pub(crate) fn get(&self, handle: &TaskContainerHandle) -> Option<&Box<dyn ExecutorTaskHandle>> { 
        if self.current.contains(&handle) {
            self.tasks[handle.0].as_ref()
        } else {
            None
        }
    }

    pub(crate) fn get_mut(&mut self, handle: &TaskContainerHandle) -> Option<&mut Box<dyn ExecutorTaskHandle>> {
        if self.current.contains(&handle) {
           self.tasks[handle.0].as_mut()
        } else {
            None
        }
    }

    #[allow(unused)]
    pub(super) fn len(&self) -> usize { self.tasks.len() - self.free_slots.len() }
}

#[cfg(test)]
mod test {
    use crate::task::faketask::FakeTask;
    use super::*;

    #[test]
    pub fn test_container() {
        let mut tasks = TaskContainer::new();
        assert!(tasks.tasks.len()==0);
        assert!(tasks.free_slots.len()==0);
        let t1 = FakeTask::new(1);
        let t2 = FakeTask::new(2);
        let t3 = FakeTask::new(3);
        let h1 = tasks.allocate();
        tasks.set(&h1,Box::new(t1.clone()));
        let h2 = tasks.allocate();
        tasks.set(&h2,Box::new(t2.clone()));
        let h3 = tasks.allocate();
        tasks.set(&h3,Box::new(t3));
        assert_eq!(0,h1.0);
        assert_eq!(1,h2.0);
        assert_eq!(2,h3.0);
        tasks.remove(&h2);
        assert!(tasks.free_slots.len()==1);
        assert_eq!(1,*tasks.free_slots.peek().unwrap());
        tasks.remove(&h1);
        assert!(tasks.free_slots.len()==2);
        assert_eq!(0,*tasks.free_slots.peek().unwrap());
        let t4 = FakeTask::new(4);
        let h4 = tasks.allocate();
        tasks.set(&h4,Box::new(t4.clone()));
        assert_eq!(0,h4.0);
        assert!(tasks.free_slots.len()==1);
        assert_eq!(1,*tasks.free_slots.peek().unwrap());
        assert_eq!(4,t4.get_priority());
        tasks.get_mut(&h4).unwrap().run(0);
        assert_eq!(1,t4.run_count());
    }

    #[test]
    pub fn test_expired_handles() {
        let mut tasks = TaskContainer::new();
        assert!(tasks.tasks.len()==0);
        assert!(tasks.free_slots.len()==0);
        /* h1 => slot 0, h2 => slot 1 */
        let h1 = tasks.allocate();
        let h2 = tasks.allocate();
        let t1 = FakeTask::new(1);
        let t2 = FakeTask::new(2);
        tasks.set(&h1,Box::new(t1));
        tasks.set(&h2,Box::new(t2));
        assert_eq!(0,h1.0);
        assert_eq!(1,h2.0);
        assert!(tasks.get(&h1).is_some());
        assert!(tasks.get(&h2).is_some());
        /* remove h1, freeing slot 0 */
        tasks.remove(&h1);
        /* allocate t3/h3 in h1's place */
        let h3 = tasks.allocate();
        let t3 = FakeTask::new(3);
        tasks.set(&h3,Box::new(t3.clone()));
        assert_eq!(0,h3.0);
        assert!(tasks.get(&h1).is_none());
        assert!(tasks.get(&h3).is_some());
        /* verify double removal does nothing */
        tasks.remove(&h1);
        assert!(tasks.get(&h3).is_some());
    }
}
