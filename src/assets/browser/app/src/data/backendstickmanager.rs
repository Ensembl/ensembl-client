use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Stick, StickManager };
use data::BackendConfigBootstrap;
use super::BackendConfig;

pub struct BackendStickManager {
    sticks: Rc<RefCell<Option<HashMap<String,Stick>>>>
}

impl BackendStickManager {
    pub fn new(bcb: &mut BackendConfigBootstrap) -> BackendStickManager {
        let out = BackendStickManager {
            sticks: Rc::new(RefCell::new(None))
        };
        let sticks = out.sticks.clone();
        bcb.add_callback(Box::new(move |config| {
            *sticks.borrow_mut() = Some(config.get_sticks().clone());
        }));
        out
    }    
}

impl StickManager for BackendStickManager {
    fn get_stick(&mut self, name: &str) -> Option<Stick> {
        let sticks = self.sticks.borrow();
        sticks.as_ref().and_then(|k| k.get(name).cloned())
    }    
}
