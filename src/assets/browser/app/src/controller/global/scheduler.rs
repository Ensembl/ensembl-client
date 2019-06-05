use std::collections::{ HashSet };
use std::sync::{ Arc, Mutex };

use dom::domutil::browser_time;

use controller::output::JankBuster;

const UNBURST_TIME : f64 = 60000.; // ms
const MAX_BURSTS : u32 = 2;

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
    cb: Box<FnMut(&mut SchedRun) + 'static>,
    id: u32
}

impl SchedTask {
    fn new(name: &str, cb: Box<FnMut(&mut SchedRun) + 'static>) -> SchedTask {
        SchedTask { stream: format!("scheduler-task-{}",name), cb, id: 0 }
    }
    
    fn run(&mut self, available: f64) {
        bb_time_if!(&self.stream,{
            let mut sr = SchedRun::new(available);
            (self.cb)(&mut sr);
            sr.productive
        });
    }
    
    fn set_id(&mut self, id: u32) {
        self.id = id;
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
    
    fn delete(&mut self, id: u32) {
        loop {
            let mut target = None;        
            for (index,task) in self.tasks.iter().enumerate() {
                if task.id == id {
                    target = Some(index);
                    break;
                }
            }
            if let Some(index) = target {
                self.tasks.remove(index);
            } else {
                break;
            }
        }
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
    
    fn delete(&mut self, id: u32) {
        for q in &mut self.queues {
            q.delete(id);
        }
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
    count: u32,
    jank: JankBuster
}

impl SchedulerMain {
    fn new() -> SchedulerMain {
        SchedulerMain {
            on_beat: SchedQueueList::new("on"),
            all_beats: SchedQueueList::new("all"),
            timesig: 1,
            count: 0,
            jank: JankBuster::new()
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
    
    fn del_tasks(&mut self, mut dels: Vec<u32>) {
        for id in dels.drain(..) {
            self.on_beat.delete(id);
            self.all_beats.delete(id);
        }
    }

    fn run_beat(&mut self, allotment: f64) -> bool {
        let end_at = browser_time() + allotment;
        let on_beat = (self.count == 0);
        self.count += 1;
        if self.count >= self.timesig { self.count = 0; }
        bb_metronome!("scheduler-beat");
        let mut busrt = false;
        if on_beat {
            let mut burst = !self.on_beat.run(end_at);
            if !burst {
                let tail_burst = !self.all_beats.run(end_at);
                if self.timesig == 1 {
                    burst |= tail_burst;
                }
            }
            burst
        } else {
            !self.all_beats.run(end_at)
        }
    }
    
    fn check_tempo(&mut self, burst: bool) {
        let now = browser_time();
        self.jank.detect(burst,now/1000.);
        self.set_timesig(self.jank.gear());
    }
    
    fn beat(&mut self, new: Vec<SchedNewTask>, dels: Vec<u32>, allotment: f64) {
        self.add_tasks(new);
        self.del_tasks(dels);
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
    next_id: u32,
    main: Arc<Mutex<SchedulerMain>>,
    adds: Vec<SchedNewTask>,
    dels: HashSet<u32>
}

impl SchedulerImpl {
    fn new() -> SchedulerImpl {
        SchedulerImpl {
            next_id: 0,
            main: Arc::new(Mutex::new(SchedulerMain::new())),
            adds: Vec::new(),
            dels: HashSet::new()
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
    
    pub fn make_group(&self) -> SchedulerGroup {
        SchedulerGroup::new(self.clone())
    }
    
    fn next_id(&mut self) -> u32 {
        let id = &mut unwrap!(self.0.lock()).next_id;
        *id += 1;
        *id
    }
    
    fn add(&mut self, mut task: SchedTask, prio: usize, on_beat: bool) -> u32 {
        let id = self.next_id();
        task.set_id(id);
        let mut adds = &mut unwrap!(self.0.lock()).adds;
        adds.push(SchedNewTask{task,prio,on_beat});
        id
    }
    
    fn delete(&mut self, id: u32) {
        let mut dels = &mut unwrap!(self.0.lock()).dels;
        dels.insert(id);
    }
    
    pub fn beat(&self, allotment: f64) {
        let main = self.main();
        let adds = unwrap!(self.0.lock()).adds.drain(..).collect();
        let dels = unwrap!(self.0.lock()).dels.drain().collect();
        main.lock().unwrap().beat(adds,dels,allotment);
    }
}

pub struct SchedulerGroup {
    scheduler: Scheduler,
    managed: Vec<u32>
}

impl SchedulerGroup {
    fn new(scheduler: Scheduler) -> SchedulerGroup {
        SchedulerGroup {
            scheduler,
            managed: Vec::new()
        }
    }
    
    pub fn add(&mut self, name: &str, cb: Box<FnMut(&mut SchedRun) + 'static>, prio: usize, on_beat: bool) {
        let task = SchedTask::new(name,cb);
        let id = self.scheduler.add(task,prio,on_beat);
        self.managed.push(id);
    }
}

impl Drop for SchedulerGroup {
    fn drop(&mut self) {
        for id in &self.managed {
            self.scheduler.delete(*id);
        }
    }
}
