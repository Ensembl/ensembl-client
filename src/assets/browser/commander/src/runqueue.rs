use hashbrown::HashSet;

use crate::taskcontainer::{ TaskContainer, TaskContainerHandle };

pub(crate) struct RunQueue2 {
    present: HashSet<TaskContainerHandle>,
    tasks: Vec<TaskContainerHandle>,
    next_task: usize
}

impl RunQueue2 {
    pub(crate) fn new() -> RunQueue2 {
        RunQueue2 {
            present: HashSet::new(),
            tasks: Vec::new(),
            next_task: 0
        }
    }

    pub(crate) fn empty(&self) -> bool {
        self.tasks.len() == 0
    }

    pub(crate) fn add(&mut self, handle: &TaskContainerHandle) {
        if !self.present.contains(&handle) {
            self.present.insert(handle.clone());
            self.tasks.push(handle.clone());
        }
    }

    pub(crate) fn remove(&mut self, handle: &TaskContainerHandle) {
        if let Some(index) = self.tasks.iter().position(|h| h == handle) {
            if index < self.next_task {
                self.next_task -= 1;
            }
            self.present.remove(&handle);
            self.tasks.remove(index);
        }
    }

    pub(crate) fn run(&mut self, tasks: &mut TaskContainer, tick_index: u64) {
        if self.next_task >= self.tasks.len() {
            self.next_task = 0;
        }
        if let Some(task) = tasks.get_mut(&self.tasks[self.next_task]) {
            task.run(tick_index);
        }
        self.next_task += 1;
    }
}

#[allow(unused)]
mod test {
    use super::*;
    use crate::task::{ Task, TaskSummary };
    use crate::taskcontainer::TaskContainer;

    struct FakeTask(i8);
    impl Task for FakeTask {
        fn run(&mut self, tick_index: u64) { self.0 += 1; }
        fn get_priority(&self) -> i8 { self.0 }
        fn summarize(&self) -> TaskSummary { TaskSummary::new(0,&"",&vec![]) }
        fn evict(&self) {}
    }

    #[test]
    pub fn test_runqueue() {
        let mut tasks = TaskContainer::new();
        let mut q = RunQueue2::new();
        /* test */
        assert!(q.empty());
        let h1 = tasks.allocate();
        let t1 = FakeTask(0);
        tasks.set(&h1,t1);
        /* single task: check runs */
        q.add(&h1);
        assert!(!q.empty());
        assert_eq!(0,tasks.get(&h1).unwrap().get_priority());
        q.run(&mut tasks,0);
        assert_eq!(1,tasks.get(&h1).unwrap().get_priority());
        q.run(&mut tasks,0);
        assert_eq!(2,tasks.get(&h1).unwrap().get_priority());
        /* add second and third task and check run fairly */
        let h2 = tasks.allocate();
        let t2 = FakeTask(0);
        tasks.set(&h2,t2);
        let h3 = tasks.allocate();
        let t3 = FakeTask(0);
        tasks.set(&h3,t3);
        q.add(&h2);
        q.add(&h3);
        q.run(&mut tasks,0);
        q.run(&mut tasks,0);
        assert_eq!(1,tasks.get(&h2).unwrap().get_priority());
        assert_eq!(1,tasks.get(&h3).unwrap().get_priority());
        q.run(&mut tasks,0);
        assert_eq!(3,tasks.get(&h1).unwrap().get_priority());
        /* remove first and check for queue rewind */
        q.remove(&h1);
        q.run(&mut tasks,0);
        assert_eq!(2,tasks.get(&h2).unwrap().get_priority());
        /* remove three and check for end-skip and no rewind */
        q.remove(&h3);
        q.run(&mut tasks,0);
        assert_eq!(3,tasks.get(&h2).unwrap().get_priority());
        /* remove two to check for emptying */
        q.remove(&h2);
        assert!(q.empty());
    }
}