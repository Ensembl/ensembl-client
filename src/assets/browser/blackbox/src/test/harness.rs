use std::sync::{ Arc, Mutex };
use crate::Integration;

#[derive(Debug)]
struct TestIntegrationImpl {
    id: String,
    time: f64
}

impl TestIntegrationImpl {
    pub fn new(id: &str) -> TestIntegrationImpl {
        TestIntegrationImpl {
            id: id.to_string(),
            time: 0.
        }
    }

    pub fn tick(&mut self) {
        self.time += 1.;
    }
}

impl Integration for TestIntegrationImpl {
    fn get_time(&self) -> f64 { self.time }
    fn get_instance_id(&self) -> String { self.id.to_string() }
    fn get_time_units(&self) -> String { "ms".to_string() }
}

#[derive(Clone,Debug)]
pub(crate) struct TestIntegration(Arc<Mutex<TestIntegrationImpl>>);

impl TestIntegration {
    pub fn new(id: &str) -> TestIntegration {
        TestIntegration(Arc::new(Mutex::new(TestIntegrationImpl::new(id))))
    }

    pub fn tick(&mut self) { self.0.lock().unwrap().tick(); }
}

impl Integration for TestIntegration {
    fn get_time(&self) -> f64 { self.0.lock().unwrap().get_time() }
    fn get_instance_id(&self) -> String { self.0.lock().unwrap().get_instance_id() }
    fn get_time_units(&self) -> String { self.0.lock().unwrap().get_time_units() }
}

pub(crate) fn lines_contains(lines: &Vec<String>,segment: &str) -> bool {
    for line in lines {
        if line.contains(segment) { return true; }
    }
    false
}

lazy_static! {
    static ref LOCK: Mutex<bool> = Mutex::new(false);
}

pub(crate) fn test_lock<F>(func: F) where F: FnOnce() {
    let mut lock = match LOCK.lock() {
        Ok(guard) => guard,
        Err(poisoned) => poisoned.into_inner(),
    };
    *lock = false;
    print!("start\n");
    func();
    print!("finish\n");
    *lock = true;

}
