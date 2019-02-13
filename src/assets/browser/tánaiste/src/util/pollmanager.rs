use std::sync::{ Arc, Mutex };
use runtime::ProcState;
use util::ValueStore;

struct PollGroup {
    waiters: Vec<Arc<Mutex<ProcState>>>,
    next_id: usize,
    on: Vec<usize>,
    on_idx: usize,
}

impl PollGroup {
    pub fn new() -> PollGroup {
        PollGroup {
            waiters: Vec::<Arc<Mutex<ProcState>>>::new(),
            next_id: 0,
            on: Vec::<usize>::new(),
            on_idx: 0,
        }
    }
    
    fn trigger_waiters(&mut self) {
        for w in &mut self.waiters.drain(..) {
            w.lock().unwrap().wake();
        }
    }
    
    pub fn get_any(&mut self) -> Option<usize> {
        if self.on_idx >= self.on.len() {
            self.on_idx = 0;
        }
        if self.on.len() > 0 {
            let out = Some(self.on[self.on_idx]);
            self.on_idx += 1;
            out
        } else {
            None
        }
    }
    
    pub fn add_waiter(&mut self, ps: Arc<Mutex<ProcState>>) {
        if self.get_any().is_some() {
            ps.lock().unwrap().wake();
        } else {
            self.waiters.push(ps.clone());
        }
    }
        
    pub fn on_off(&mut self, id: usize, on: bool) {
        if on {
            self.on.push(id);
            self.trigger_waiters();
        } else {
            self.on.remove_item(&id);
        }
    }
    
    pub fn allocate(&mut self) -> usize {
        self.next_id += 1;
        self.next_id
    }
}

pub struct PollManagerImpl {
    groups: ValueStore<PollGroup>
}

#[derive(Clone)]
pub struct PollManager(Arc<Mutex<PollManagerImpl>>);

impl PollManagerImpl {
    pub fn create_group(&mut self) -> f64 {
        self.groups.store(PollGroup::new()) as f64
    }
    
    pub fn delete_group(&mut self, id: f64) {
        self.groups.unstore(id as usize);
    }
    
    pub fn allocate(&mut self, group: f64) -> f64 {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.allocate() as f64
        } else { 0. }
    }

    pub fn on_off(&mut self, group: f64, id: f64, on_off: bool) {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.on_off(id as usize,on_off)
        }
    }
    
    pub fn get_any(&mut self, group: f64) -> Option<f64> {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.get_any().map(|s| s as f64)
        } else { None }
    }
        
    pub fn add_waiter(&mut self, group: f64, ps: Arc<Mutex<ProcState>>) {
        if let Some(pg) = self.groups.get_mut(group as usize) {
            pg.add_waiter(ps)
        }
    }
}

impl PollManager {
    pub fn new() -> PollManager {
        PollManager(Arc::new(Mutex::new(PollManagerImpl {
            groups: ValueStore::<PollGroup>::new()
        })))
    }

    pub fn create_group(&mut self) -> f64 {
        self.0.lock().unwrap().create_group()
    }
    
    pub fn delete_group(&mut self, id: f64) {
        self.0.lock().unwrap().delete_group(id)
    }
    
    pub fn allocate(&mut self, group: f64) -> f64 {
        self.0.lock().unwrap().allocate(group)
    }

    pub fn on_off(&mut self, group: f64, id: f64, on_off: bool) {
        self.0.lock().unwrap().on_off(group,id,on_off)
    }
    
    pub fn get_any(&mut self, group: f64) -> Option<f64> {
        self.0.lock().unwrap().get_any(group)
    }
        
    pub fn add_waiter(&mut self, group: f64, ps: Arc<Mutex<ProcState>>) {
        self.0.lock().unwrap().add_waiter(group,ps)
    }
}
