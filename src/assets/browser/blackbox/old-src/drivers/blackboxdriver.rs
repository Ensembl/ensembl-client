use std::sync::{ Arc, Mutex };

use crate::BlackBoxState;

pub trait BlackBoxDriverImpl {
    fn tick(&mut self, _state: &mut BlackBoxState, _t: f64) -> bool { false }    
}

#[derive(Clone)]
pub struct BlackBoxDriver(Arc<Mutex<Box<dyn BlackBoxDriverImpl>>>);

impl BlackBoxDriver {
    pub fn new<T>(driver: T) -> BlackBoxDriver where T: BlackBoxDriverImpl+'static {
        BlackBoxDriver(Arc::new(Mutex::new(Box::new(driver))))
    }
    
    pub fn tick(&mut self, state: &mut BlackBoxState, t: f64) -> bool {
        self.0.lock().unwrap().tick(state,t)
    }
}
