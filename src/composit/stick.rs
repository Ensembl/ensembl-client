use std::cell::RefCell;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

#[derive(Debug)]
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
    
    pub fn get_name(&self) -> &str { &self.name }
    pub fn length(&self) -> u64 { self.length }
}

impl PartialEq<StickImpl> for StickImpl {
    fn eq(&self, other: &StickImpl) -> bool {
        self.name == other.name
    }
}

impl Hash for StickImpl {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name.hash(state);
    }
}

#[derive(Clone,Debug)]
pub struct Stick(Rc<RefCell<StickImpl>>);

impl Stick {
    pub fn new(name: &str, length: u64, circular: bool) -> Stick {
        Stick(Rc::new(RefCell::new(StickImpl::new(name, length, circular))))
    }
    
    pub fn length(&self) -> u64 { self.0.borrow().length() }
    pub fn get_name(&self) -> String { 
        self.0.borrow().get_name().to_string()
    }
}

impl PartialEq<Stick> for Stick {
    fn eq(&self, other: &Stick) -> bool {
        self.0.borrow().eq(&other.0.borrow())
    }
}

impl Eq for Stick {}

impl Hash for Stick {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.borrow().hash(state);
    }
}
