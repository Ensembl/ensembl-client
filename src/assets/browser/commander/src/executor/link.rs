use std::sync::{ Arc, Mutex };
use super::taskcontainer::TaskContainerHandle;

pub(crate) struct Link<T>(Arc<Mutex<Option<Vec<(TaskContainerHandle,T)>>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<T> Clone for Link<T> {
    fn clone(&self) -> Self {
        Link(self.0.clone())
    }
}

pub(crate) struct TaskLink<T>(Arc<Mutex<LinkState<T>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<T> Clone for TaskLink<T> {
    fn clone(&self) -> Self {
        TaskLink(self.0.clone())
    }
}

struct LinkState<T> {
    pre_queue: Vec<T>,
    link: Link<T>,
    task: Option<TaskContainerHandle>
}

impl<T> Link<T> {
    pub(crate) fn new() -> Link<T> {
        Link(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub(crate) fn new_task_link(&self) -> TaskLink<T> {
        TaskLink::new(&self)
    }

    fn add_action(&self, handle: &TaskContainerHandle, action: T) {
        self.0.lock().unwrap().as_mut().unwrap().push((handle.clone(),action));
    }

    pub(crate) fn drain(&mut self) -> Vec<(TaskContainerHandle,T)> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }
}


impl<T> TaskLink<T> {
    fn new(link: &Link<T>) -> TaskLink<T> {
        TaskLink(Arc::new(Mutex::new(
            LinkState {
                pre_queue: Vec::new(),
                link: link.clone(),
                task: None
            }
        )))
    }

    pub(crate) fn get_link(&self) -> Link<T> {
        self.0.lock().unwrap().link.clone()
    }

    pub(crate) fn register(&self, handle: &TaskContainerHandle) {
        let mut state = self.0.lock().unwrap();
        let mut queue = Vec::new();
        queue.append(&mut state.pre_queue);
        for action in queue.drain(..) {
            state.link.add_action(&handle,action);
        }
        state.task = Some(handle.clone());
    }

    pub(crate) fn add(&self, action: T) {
        let mut state = self.0.lock().unwrap();
        if let Some(task) = &state.task {
            state.link.add_action(task,action);
        } else {
            state.pre_queue.push(action);
        }
    }
}
