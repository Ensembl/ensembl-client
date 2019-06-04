use std::sync::{ Arc, Mutex };

use dom::domutil::browser_time;

pub struct SchedRun {
    productive: bool,
    available: f64
}

impl SchedRun {
    fn new(available: f64) -> SchedRun {
        SchedRun {
            productive: true,
            available
        }
    }
    
    pub fn unproductive(&mut self) {
        self.productive = false;
    }
    
    pub fn available(&self) -> f64 {
        self.available
    }
}

pub struct SchedTask {
    stream: String,
    cb: Box<FnMut(&mut SchedRun) + 'static>
}

impl SchedTask {
    fn new(name: &str, cb: Box<FnMut(&mut SchedRun) + 'static>) -> SchedTask {
        SchedTask { stream: format!("scheduler-task-{}",name), cb }
    }
    
    fn run(&mut self, available: f64) {
        bb_time_if!(&self.stream,{
            let mut sr = SchedRun::new(available);
            (self.cb)(&mut sr);
            sr.productive
        });
    }
}

struct SchedQueue {
    tasks: Vec<SchedTask>,
    next: usize
}

impl SchedQueue {
    fn new() -> SchedQueue {
        SchedQueue {
            tasks: Vec::new(),
            next: 0
        }
    }
    
    fn add(&mut self, task: SchedTask) {
        self.tasks.push(task);
    }
    
    fn run(&mut self, end_at: f64) -> bool {
        if self.tasks.len() == 0 { return true; }
        let mut t = browser_time();
        if self.next >= self.tasks.len() { self.next = 0; }
        for idx in 0..self.tasks.len() {
            if t >= end_at { return false; }
            let task = &mut self.tasks[self.next];
            task.run(end_at-t);
            self.next += 1;
            self.next %= self.tasks.len();
            t = browser_time();
        }
        return t < end_at;
    }
}

struct SchedQueueList {
    queues: Vec<SchedQueue>,
    name: String,
    bb_stream: String
}

impl SchedQueueList {
    fn new(name: &str) -> SchedQueueList {
        SchedQueueList {
            queues: Vec::new(),
            name: name.to_string(),
            bb_stream: format!("scheduler-queuelist-{}",name)
        }
    }
    
    fn add(&mut self, new: SchedNewTask) {
        while self.queues.len() <= new.prio {
            self.queues.push(SchedQueue::new());
        }
        self.queues[new.prio].add(new.task);
    }
    
    fn run(&mut self, end_at: f64) -> bool {
        bb_time!(&self.bb_stream,{
            for q in &mut self.queues {
                if !q.run(end_at) {
                    return false;
                }
            }
            return true;
        })
    }
}

struct SchedulerMain {
    on_beat: SchedQueueList,
    all_beats: SchedQueueList,
    timesig: u32,
    count: u32
}

impl SchedulerMain {
    fn new() -> SchedulerMain {
        SchedulerMain {
            on_beat: SchedQueueList::new("on"),
            all_beats: SchedQueueList::new("all"),
            timesig: 1,
            count: 0
        }
    }
    
    fn set_timesig(&mut self, sig: u32) {
        self.timesig = sig;
    }
    
    fn add_tasks(&mut self, mut new: Vec<SchedNewTask>) {
        for task in new.drain(..) {
            if task.on_beat {
                self.on_beat.add(task);
            } else {
                self.all_beats.add(task);
            }
        }
    }

    fn run_beat(&mut self, allotment: f64) -> bool {
        let end_at = browser_time() + allotment;
        let on_beat = (self.count == 0);
        self.count += 1;
        if self.count == self.timesig { self.count = 0; }
        bb_metronome!("scheduler-beat");
        let mut busted = false;
        if on_beat {
            let mut busted = !self.on_beat.run(end_at);
            if !busted {
                let tail_busted = !self.all_beats.run(end_at);
                if self.timesig == 1 {
                    busted |= tail_busted;
                }
            }
            busted
        } else {
            !self.all_beats.run(end_at)
        }
    }
    
    fn check_tempo(&mut self, busted: bool) {
        if busted {
            bb_log!("scheduler","raf was busted");
        }
    }
    
    fn beat(&mut self, new: Vec<SchedNewTask>, allotment: f64) {
        self.add_tasks(new);
        let busted = self.run_beat(allotment);
        self.check_tempo(busted);
    }
}

struct SchedNewTask {
    task: SchedTask,
    prio: usize,
    on_beat: bool
}

struct SchedulerImpl {
    main: Arc<Mutex<SchedulerMain>>,
    pending: Vec<SchedNewTask>
}

impl SchedulerImpl {
    fn new() -> SchedulerImpl {
        SchedulerImpl {
            main: Arc::new(Mutex::new(SchedulerMain::new())),
            pending: Vec::new()
        }
    }    
}

#[derive(Clone)]
pub struct Scheduler(Arc<Mutex<SchedulerImpl>>);

impl Scheduler {
    pub fn new() -> Scheduler {
        Scheduler(Arc::new(Mutex::new(SchedulerImpl::new())))
    }
    
    fn main(&self) -> Arc<Mutex<SchedulerMain>> {
        unwrap!(self.0.lock()).main.clone()
    }
        
    pub fn set_timesig(&self, sig: u32) {
        self.main().lock().unwrap().set_timesig(sig);
    }
    
    pub fn add(&mut self, name: &str, cb: Box<FnMut(&mut SchedRun) + 'static>, prio: usize, on_beat: bool) {
        let task = SchedTask::new(name,cb);
        let mut adds = &mut unwrap!(self.0.lock()).pending;
        adds.push(SchedNewTask{task,prio,on_beat});
    }
    
    pub fn beat(&self, allotment: f64) {
        let main = self.main();
        let adds = unwrap!(self.0.lock()).pending.drain(..).collect();
        main.lock().unwrap().beat(adds,allotment);
    }
}
