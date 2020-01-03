use std::collections::BinaryHeap;
use std::cmp::Ordering;
use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRef;

/*

TODO:
step name
handle
timeout
prio rerun
slice timeout
de pub
split
Non O(n) blocked queue
Rc RunConfig

*/

pub enum StepState<Y,E> {
    NotDone,
    Done(Result<Y,E>),
    Wait(f64),
    Sleep
}

pub enum StepResult<Y,E> {
    Done(Result<Y,E>),
    Timeout,
    Cancelled,
    NotNeeded
}

pub struct RunSlot {}

#[derive(Clone)]
pub struct RunConfig {
    pub priority: i8 // XXX pub
}

impl RunConfig {
    pub fn new(slot: Option<RunSlot>, priority: i8, timeout: Option<f64>) -> RunConfig {
        RunConfig {
            priority
        }
    }

    pub fn get_priority(&self) -> i8 { self.priority }
}

#[derive(Clone)]
pub struct StepControl {
    config: RunConfig,
    waker: Waker
}

impl StepControl {
    pub fn new(config: &RunConfig, waker: &Waker) -> StepControl {
        StepControl {
            config: config.clone(),
            waker: waker.clone()
        }
    }

    pub fn run_config(&self) -> &RunConfig { &self.config }
    pub fn get_remaining(&self) -> f64 { 0. }
    pub fn dropped(&self) -> bool { false }
    pub fn wake(&mut self) { self.waker.awaken() }
}

pub trait Step<X,Y,Error=()> : Send {
    fn execute(&mut self, input: &X, signal: &mut StepControl) -> StepState<Y,Error>;
    fn drop(&mut self, _: &X, _: StepResult<Y,Error>) {}
}

#[derive(Clone)]
pub struct Waker(Arc<Mutex<bool>>);

impl Waker {
    fn new() -> Waker { Waker(Arc::new(Mutex::new(false))) }
    fn awaken(&mut self) { *self.0.lock().unwrap() = true; }
    fn awoken(&self) -> MutexGuardRef<bool> { MutexGuardRef::new(self.0.lock().unwrap()) }
}

struct TaskImpl<X> {
    step: Box<dyn Step<X,(),()>>,
    input: X,
    waker: Waker,
    run_config: RunConfig,
    name: String
}

impl<X> TaskImpl<X> {
    pub fn new<S>(step: S, input: X, run_config: RunConfig, name: &str) -> TaskImpl<X> where S: Step<X,(),()> + 'static + Send, X: Send {
        TaskImpl {
            step: Box::new(step),
            input, run_config,
            waker: Waker::new(),
            name: name.to_string()
        }
    }
}

trait Task : Send {
    fn get_priority(&self) -> i8;
    fn run(&mut self) -> StepState<(),()>;
    fn get_name(&self) -> &str;
    fn get_waker(&mut self) -> &mut Waker;
}

impl<X> Task for TaskImpl<X> where X: Send {
    fn get_priority(&self) -> i8 { self.run_config.get_priority() }
    fn get_name(&self) -> &str { &self.name }
    fn get_waker(&mut self) -> &mut Waker { &mut self.waker }

    fn run(&mut self) -> StepState<(),()> {
        let waker = self.get_waker().clone();
        let mut control = StepControl::new(&self.run_config,&waker);
        self.step.execute(&self.input,&mut control)
    }
}

struct WaitingTask {
    task: Option<Box<dyn Task>>,
    until: f64
}

impl WaitingTask {
    fn make(task: Box<dyn Task>, until: f64) -> WaitingTask {
        WaitingTask { task: Some(task), until }
    }

    fn unmake(mut self) -> Box<dyn Task> {
        self.task.take().unwrap()
    }

    fn get_until(&self) -> f64 { self.until }
}

impl PartialEq for WaitingTask {
    fn eq(&self, other: &WaitingTask) -> bool {
        self.until == other.until
    }
}

impl Eq for WaitingTask {}

impl Ord for WaitingTask {
    fn cmp(&self, other: &WaitingTask) -> Ordering {
        self.until.partial_cmp(&other.until).unwrap()
    }
}

impl PartialOrd for WaitingTask {
    fn partial_cmp(&self, other: &WaitingTask) -> Option<Ordering> {
        Some(self.cmp(&other))
    }
}

pub trait CommanderIntegration : Send {
    fn current_time(&mut self) -> f64;
    fn enable_ticks(&mut self, cmdr: &mut Commander);
    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>);
}

pub struct RunQueue {
    priority: i8,
    tasks: Vec<Box<dyn Task>>,
    next_task: usize
}

enum CommanderTask {
    Wait(Box<dyn Task>,f64),
    Sleep(Box<dyn Task>)
}

impl RunQueue {
    pub fn new(priority: i8) -> RunQueue {
        RunQueue {
            priority,
            tasks: Vec::new(),
            next_task: 0
        }
    }

    pub fn get_priority(&self) -> i8 { self.priority }

    fn add(&mut self, task: Box<dyn Task>) {
        blackbox_log!("scheduler-tasks","Add new task to run queue '{}'",task.get_name());
        self.tasks.push(task);
    }

    fn run(&mut self) -> (bool,Option<CommanderTask>) {
        if self.next_task >= self.tasks.len() {
            return (false,None);
        }
        let task = &mut self.tasks[self.next_task];
        blackbox_log!("scheduler-tasks","Run task '{}'",task.get_name());
        let r = task.run();
        let mut out = None;
        match r {
            StepState::NotDone => (),
            StepState::Done(_)=> {
                blackbox_log!("scheduler-tasks","Remove task from run queue (done) '{}'",task.get_name());
                self.tasks.remove(self.next_task);
            },
            StepState::Wait(delay) => {
                blackbox_log!("scheduler-tasks","Remove task from run queue (waiting={}) '{}'",delay,task.get_name());
                let task = self.tasks.remove(self.next_task);
                out = Some(CommanderTask::Wait(task,delay));
            },
            StepState::Sleep => {
                blackbox_log!("scheduler-tasks","Remove task from run queue (blocked) '{}'",task.get_name());
                let task = self.tasks.remove(self.next_task);
                out = Some(CommanderTask::Sleep(task));
            }
        }
        self.next_task += 1;
        (true,out)
    }

    fn end_tick(&mut self) {
        self.next_task = 0;
    }
}

pub struct CommanderShared {
    integration: Box<dyn CommanderIntegration>,
    run_queues: Vec<RunQueue>,
    wait_queue: BinaryHeap<WaitingTask>,
    blocked: Vec<Box<dyn Task>>
}

impl CommanderShared {
    pub fn new(integration: Box<dyn CommanderIntegration>) -> CommanderShared {
        CommanderShared {
            integration,
            run_queues: Vec::new(),
            wait_queue: BinaryHeap::new(),
            blocked: Vec::new()
        }
    }

    fn get_queue_mut(&mut self, priority: i8) -> &mut RunQueue {
        match self.run_queues.binary_search_by_key(&priority,|x| x.get_priority()) {
            Ok(index) => &mut self.run_queues[index],
            Err(index) => {
                self.run_queues.insert(index,RunQueue::new(priority));
                &mut self.run_queues[index]
            }
        }
    }

    fn add(&mut self, task: Box<dyn Task>) {
        self.get_queue_mut(task.get_priority()).add(task);
    }

    fn unblock(&mut self) {
        let mut new_blocked = Vec::new();
        let mut unblocked = Vec::new();
        for mut task in self.blocked.drain(..) {
            if *task.get_waker().awoken() {
                blackbox_log!("scheduler-tasks","Unblocking task '{}'",task.get_name());
                unblocked.push(task);
            } else {
                new_blocked.push(task);
            }
        }
        self.blocked = new_blocked;
        for task in unblocked.drain(..) {
            self.add(task);
        }
    }

    fn unqueue_waited(&mut self) {
        let now = self.integration.current_time();
        while let Some(task) = self.wait_queue.pop() {
            if task.get_until() > now {
                self.wait_queue.push(task);
                break;
            } else {
                let task = task.unmake();
                blackbox_log!("scheduler-tasks","Remove task from wait queue '{}'",task.get_name());
                self.add(task);
            }
        }
    }

    fn run_runqueues(&mut self) {
        for queue in self.run_queues.iter_mut() {
            while let (true,command) = queue.run() {
                match command {
                    Some(CommanderTask::Wait(task,delay)) => {
                        self.wait_queue.push(WaitingTask::make(task,delay));
                    },
                    Some(CommanderTask::Sleep(task)) => {
                        self.blocked.push(task);
                    },
                    None => ()
                }
            }
        }
        for queue in self.run_queues.iter_mut() {
            queue.end_tick();
        }
    }

    // XXX repeat prio if any still runnable before lower prio
    fn run(&mut self) {
        self.unblock();
        self.unqueue_waited();
        self.run_runqueues();
    }
}

#[derive(Clone)]
pub struct Commander {
    shared: Arc<Mutex<CommanderShared>>
}

impl PartialEq for Commander {
    fn eq(&self, other: &Self) -> bool {
        Arc::ptr_eq(&self.shared,&other.shared)
    }
}

impl Commander {
    pub fn new<T>(itgn: T) -> Commander where T: CommanderIntegration + 'static {
        Commander {
            shared: Arc::new(Mutex::new(CommanderShared::new(Box::new(itgn))))
        }
    }

    pub fn new_slot(&mut self) -> RunSlot {
        RunSlot {}
    }

    pub fn add<T,X>(&mut self, step: T, input: X, run_config: RunConfig, name: &str) where T: Step<X,()> + 'static + Send, X: 'static + Send {
        self.shared.lock().unwrap().add(Box::new(TaskImpl::new(step,input,run_config,name)));
    }

    pub fn tick(&mut self, slice: f64) {
        self.shared.lock().unwrap().run();
    }
}
