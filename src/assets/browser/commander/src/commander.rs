use std::cmp::Ordering;
use std::fmt;
use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRef;

use crate::step::{ KillReason, RunConfig, RunSlot, StepResult };

/*

TODO:
step name
handle
soft step timeout
Rc RunConfig
tick enable/disable
Do we need Send?
killed in-step memory
non-null return values
detect result in control
weaken timers

*/

pub trait CommanderIntegration : Send {
    fn current_time(&mut self) -> f64;
    fn enable_ticks(&mut self, cmdr: &mut Commander);
    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>);
}

impl fmt::Display for KillReason {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{}", match self {
            KillReason::Timeout => "timeout",
            KillReason::Cancelled => "cancelled",
            KillReason::NotNeeded => "not-needed"
        })
    }
}

pub enum StepState<Y,E> {
    NotDone,
    Done(Result<Y,E>),
    Wait(f64),
    Sleep,
    Killed
}

#[derive(Clone)]
pub struct StepControl {
    config: RunConfig,
    waker: Waker,
    killed: Option<KillReason>
}

impl StepControl {
    pub fn new(config: &RunConfig, waker: &Waker) -> StepControl {
        StepControl {
            config: config.clone(),
            waker: waker.clone(),
            killed: None
        }
    }

    pub fn run_config(&self) -> &RunConfig { &self.config }
    pub fn get_remaining(&self) -> f64 { 0. }
    pub fn dropped(&self) -> bool { false }
    pub fn wake(&mut self) { self.waker.awaken() }
    pub fn kill(&mut self, reason: KillReason) { self.killed = Some(reason); }
    pub fn autopsy(&self) -> &Option<KillReason> { &self.killed }
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
    fn sleep(&mut self) { *self.0.lock().unwrap() = false; }
    fn awoken(&self) -> MutexGuardRef<bool> { MutexGuardRef::new(self.0.lock().unwrap()) }
}

struct TaskImpl<X> {
    step: Box<dyn Step<X,(),()>>,
    input: X,
    waker: Waker,
    doom_timer: Option<Waker>,
    killed: Option<KillReason>,
    run_config: RunConfig,
    name: String
}

impl<X> TaskImpl<X> {
    pub fn new<S>(step: S, input: X, run_config: RunConfig, doom_timer: Option<Waker>, name: &str) -> TaskImpl<X> where S: Step<X,(),()> + 'static + Send, X: Send {
        TaskImpl {
            step: Box::new(step),
            input, run_config,
            waker: Waker::new(),
            killed: None,
            doom_timer,
            name: name.to_string()
        }
    }

    fn check_timeout(&mut self) -> bool {
        if let Some(doom) = &self.doom_timer {
            if *doom.awoken() { 
                self.killed = Some(KillReason::Timeout);
                return true;
            }
        }
        false
    }
}

trait Task : Send {
    fn ready(&mut self);
    fn get_priority(&self) -> i8;
    fn run(&mut self) -> StepState<(),()>;
    fn get_name(&self) -> &str;
    fn get_waker(&mut self) -> &mut Waker;
    fn get_doomed(&self) -> &Option<Waker>;
    fn autopsy(&self) -> &Option<KillReason>;
}

impl<X> Task for TaskImpl<X> where X: Send {
    fn get_priority(&self) -> i8 { self.run_config.get_priority() }
    fn get_name(&self) -> &str { &self.name }
    fn get_waker(&mut self) -> &mut Waker { &mut self.waker }
    fn get_doomed(&self) -> &Option<Waker> { &self.doom_timer }
    fn autopsy(&self) -> &Option<KillReason> { &self.killed }

    fn ready(&mut self) {
        self.waker.sleep();
    }

    fn run(&mut self) -> StepState<(),()> {
        if self.check_timeout() { return StepState::Killed; }
        let mut control = StepControl::new(&self.run_config,&self.waker);
        let mut out = self.step.execute(&self.input,&mut control);
        if let Some(reason) = control.autopsy() {
            self.killed = Some(reason.clone());
            out = StepState::Killed;
        }
        if self.check_timeout() { return StepState::Killed; }
        out
    }
}

struct TimedPayload<T> {
    payload: Option<T>,
    timer: f64,
    timeout: Option<Waker>
}

impl<T> TimedPayload<T> {
    fn make(payload: T, timer: f64, timeout: Option<Waker>) -> TimedPayload<T> {
        TimedPayload { payload: Some(payload), timer, timeout }
    }

    fn unmake(mut self) -> T {
        self.payload.take().unwrap()
    }

    fn get_timer(&self) -> f64 { self.timer }
    fn get_doomed(&self) -> &Option<Waker> { &self.timeout }
}

impl<T> PartialEq for TimedPayload<T> {
    fn eq(&self, other: &TimedPayload<T>) -> bool {
        self.timer == other.timer
    }
}

impl<T> Eq for TimedPayload<T> {}

impl<T> Ord for TimedPayload<T> {
    fn cmp(&self, other: &TimedPayload<T>) -> Ordering {
        self.timer.partial_cmp(&other.timer).unwrap()
    }
}

impl<T> PartialOrd for TimedPayload<T> {
    fn partial_cmp(&self, other: &TimedPayload<T>) -> Option<Ordering> {
        Some(self.cmp(&other))
    }
}

// XXX Arc
// XXX efficiently
pub struct PayloadDelayer<T> {
    payloads: Vec<TimedPayload<T>>
}

impl<T> PayloadDelayer<T> {
    pub fn new() -> PayloadDelayer<T> {
        PayloadDelayer {
            payloads: Vec::new()
        }
    }

    pub fn add(&mut self, payload: T, delay: f64, timer: Option<Waker>) {
        self.payloads.push(TimedPayload::make(payload,delay,timer));
    }

    pub fn take(&mut self, now: f64) -> Option<T> {
        let mut index = None;
        for (i,payload) in self.payloads.iter().enumerate() {
            if payload.get_timer() <= now || payload.get_doomed().as_ref().map(|x| *x.awoken()).unwrap_or(false) {
                index = Some(i);
                break;
            }
        }
        index.map(|index| self.payloads.remove(index).unmake())
    }
}

pub struct Timers {
    timers: PayloadDelayer<Waker>
}

impl Timers {
    pub fn new() -> Timers {
        Timers {
            timers: PayloadDelayer::new()
        }
    }

    pub fn new_timer(&mut self, t: f64) -> Waker {
        blackbox_log!("scheduler-timers","Timer created for {}",t);
        let w = Waker::new();
        self.timers.add(w.clone(),t,None);
        w
    }

    pub fn check(&mut self, now: f64) {
        while let Some(mut timer) = self.timers.take(now) {
            blackbox_log!("scheduler-timers","Timer expired");
            timer.awaken();
        }
    }
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
            StepState::Done(_) => {
                blackbox_log!("scheduler-tasks","Remove task from run queue (done) '{}'",task.get_name());
                self.tasks.remove(self.next_task);
            },
            StepState::Killed => {
                let reason = task.autopsy().as_ref().unwrap_or(&KillReason::NotNeeded);
                blackbox_log!("scheduler-tasks","Remove task from run queue (kill -- {}) '{}'",reason,task.get_name());
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
    wait_queue: PayloadDelayer<Box<dyn Task>>,
    blocked: Vec<Box<dyn Task>>,
    timers: Timers
}

impl CommanderShared {
    pub fn new(integration: Box<dyn CommanderIntegration>) -> CommanderShared {
        CommanderShared {
            integration,
            run_queues: Vec::new(),
            wait_queue: PayloadDelayer::new(),
            blocked: Vec::new(),
            timers: Timers::new()
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

    fn new_timer(&mut self, t: f64) -> Waker {
        self.timers.new_timer(t)
    }

    fn add(&mut self, mut task: Box<dyn Task>) {
        task.ready();
        self.get_queue_mut(task.get_priority()).add(task);
    }

    fn unblock(&mut self) {
        let mut new_blocked = Vec::new();
        let mut unblocked = Vec::new();
        for mut task in self.blocked.drain(..) {
            let doomed = task.get_doomed().as_ref().map(|x| *x.awoken()).unwrap_or(false);
            if *task.get_waker().awoken() || doomed {
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

    fn unqueue_waited(&mut self, now: f64) {
        while let Some(task) = self.wait_queue.take(now) {
            blackbox_log!("scheduler-tasks","Remove task from wait queue '{}'",task.get_name());
            self.add(task);
        }
    }

    fn run_runqueues(&mut self) {
        for queue in self.run_queues.iter_mut() {
            while let (true,command) = queue.run() {
                match command {
                    Some(CommanderTask::Wait(task,delay)) => {
                        let doomed = task.get_doomed().clone();
                        let now = self.integration.current_time();
                        self.wait_queue.add(task,now+delay,doomed);
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

    fn now(&mut self) -> f64 {
        self.integration.current_time()
    }

    // XXX repeat prio if any still runnable before lower prio
    fn run(&mut self) {
        let now = self.now();
        self.timers.check(now);
        self.unblock();
        self.unqueue_waited(now);
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
        let mut shared = self.shared.lock().unwrap();
        let now = shared.now();
        let doomed = run_config.get_timeout().map(|timeout| shared.new_timer(now+timeout));
        shared.add(Box::new(TaskImpl::new(step,input,run_config,doomed,name)));
    }

    pub fn tick(&mut self, slice: f64) {
        self.shared.lock().unwrap().run();
    }
}
