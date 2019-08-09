use std::collections::HashMap;
use std::rc::Rc;
use std::cell::RefCell;

use composit::{ Stick, StickManager };
use data::BackendStickManager;

struct CombinedStickManagerImpl {
    backend: BackendStickManager,
    internal: HashMap<String,Stick>
}

impl CombinedStickManagerImpl {
    fn new(backend: BackendStickManager) -> CombinedStickManagerImpl {
        CombinedStickManagerImpl {
            backend,
            internal: HashMap::<String,Stick>::new()
        }
    }
    
    fn add_internal_stick(&mut self, name: &str, stick: Stick) {
        self.internal.insert(name.to_string(),stick);
    }

    fn get_stick(&mut self, name: &str) -> Option<Stick> {
        if let Some(stick) = self.internal.get(name) {
            Some(stick).cloned()
        } else {
            self.backend.get_stick(name)
        }
    }
}

#[derive(Clone)]
pub struct CombinedStickManager(Rc<RefCell<CombinedStickManagerImpl>>);

impl CombinedStickManager {
    pub fn new(backend: BackendStickManager) -> CombinedStickManager {
        CombinedStickManager(Rc::new(RefCell::new(CombinedStickManagerImpl::new(backend))))
    }
    
    pub fn add_internal_stick(&mut self, name: &str, stick: Stick) {
        self.0.borrow_mut().add_internal_stick(name,stick);
    }
}

impl StickManager for CombinedStickManager {
    fn get_stick(&mut self, name: &str) -> Option<Stick> {
        self.0.borrow_mut().get_stick(name)
    }
}