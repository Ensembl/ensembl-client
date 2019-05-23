use std::collections::{ HashMap, HashSet };
use std::sync::{ Arc, Mutex };

use serde_json::Value as SerdeValue;
use serde_json::Map as SerdeMap;
use stdweb::unstable::TryInto;

use dom::domutil::browser_time;
use util::get_instance_id;
use super::blackboxstate::BlackBoxState;

lazy_static! {
    static ref BLACKBOX: Mutex<BlackBoxState> = Mutex::new(BlackBoxState::new());
}

pub trait BlackBoxDriverImpl {
    fn tick(&mut self, state: &mut BlackBoxState, t: f64) {}    
}

#[derive(Clone)]
pub struct BlackBoxDriver(Arc<Mutex<Box<BlackBoxDriverImpl>>>);

impl BlackBoxDriver {
    pub fn new(driver: Box<BlackBoxDriverImpl>) -> BlackBoxDriver {
        BlackBoxDriver(Arc::new(Mutex::new(driver)))
    }
    
    pub fn tick(&mut self, state: &mut BlackBoxState, t: f64) {
        self.0.lock().unwrap().tick(state,t);
    }
}

pub fn blackbox_tick(driver: &mut BlackBoxDriver) {
    let mut bb = BLACKBOX.lock().unwrap();
    let now = browser_time();
    driver.tick(&mut bb,now);
}

pub fn blackbox_report(stream: &str, report: &str) {
    let mut bb = BLACKBOX.lock().unwrap();
    let now = browser_time();
    bb.report(stream,now,report);
}

pub fn blackbox_push(name: &str) {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.push(name);
}

pub fn blackbox_pop() {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.pop();
}
