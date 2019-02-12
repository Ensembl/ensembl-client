use std::collections::HashSet;
use std::sync::{ Arc, Mutex };
use runtime::{ DataState, ProcState };
use util::ValueStore;

struct PollGroup {
    waiters: Vec<Arc<Mutex<ProcState>>>,
    next_id: usize,
    on: HashSet<usize>
}

impl PollGroup {
    pub fn new() -> PollGroup {
        PollGroup {
            waiters: Vec::<Arc<Mutex<ProcState>>>::new(),
            next_id: 0,
            on: HashSet::<usize>::new()
        }
    }
    
    fn trigger_waiters(&mut self) {
        for w in &mut self.waiters.drain(..) {
            w.lock().unwrap().wake();
        }
    }
    
    pub fn wait_any(&mut self, data: &mut DataState, ps: Arc<Mutex<ProcState>>) -> Option<usize> {
        if let Some(id) = self.on.drain().next() {
            Some(id)
        } else {
            data.set_again();
            ps.lock().unwrap().sleep();
            self.waiters.push(ps.clone());
            None
        }
    }
    
    pub fn on_off(&mut self, id: usize, on: bool) {
        if on {
            self.on.insert(id);
            self.trigger_waiters();
        } else {
            self.on.remove(&id);
        }
    }
    
    pub fn allocate(&mut self) -> usize {
        self.next_id += 1;
        self.next_id
    }
}

pub struct PollManager {
    groups: ValueStore<Arc<Mutex<PollGroup>>>
}

impl PollManager {
    pub fn new() -> PollManager {
        PollManager {
            groups: ValueStore::<Arc<Mutex<PollGroup>>>::new()
        }
    }
    
    pub fn create_group(&mut self) -> f64 {
        let g = Arc::new(Mutex::new(PollGroup::new()));
        self.groups.store(g) as f64
    }
    
    pub fn delete_group(&mut self, id: f64) {
        self.groups.unstore(id as usize);
    }
    
    pub fn allocate(&mut self, group: f64) -> f64 {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.lock().unwrap().allocate() as f64
        } else { 0. }
    }

    pub fn on_off(&mut self, group: f64, id: f64, on_off: bool) {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.lock().unwrap().on_off(id as usize,on_off)
        }
    }
    
    pub fn wait_any(&mut self, group:f64, data: &mut DataState, ps: Arc<Mutex<ProcState>>) -> Option<f64> {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.lock().unwrap().wait_any(data,ps).map(|s| s as f64)
        } else { Some(0.) }
    }
}
