use std::cell::RefCell;
use std::rc::Rc;

pub struct StickImpl {
    name: String,
    length: u64,
    circular: bool
}

impl StickImpl {
    pub fn new(name: &str, length: u64, circular: bool) -> StickImpl {
        StickImpl {
            name: name.to_string(),
            length, circular
        }
    }
    
    pub fn length(&self) -> u64 { self.length }
}

#[derive(Clone)]
pub struct Stick(Rc<RefCell<StickImpl>>);

impl Stick {
    pub fn new(name: &str, length: u64, circular: bool) -> Stick {
        Stick(Rc::new(RefCell::new(StickImpl::new(name, length, circular))))
    }
    
    pub fn length(&self) -> u64 { self.0.borrow().length() }
}
