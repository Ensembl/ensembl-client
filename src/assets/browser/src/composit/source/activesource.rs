use std::cmp::{ Eq, PartialEq };
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{
    Source, Carriage, Leaf, SourceFactory, SourceResponse, StateManager,
    StateValue
};

#[derive(Clone)]
pub struct ActiveSource {
    name: String,
    ooe: Rc<StateExpr>,
    source: Rc<Source>
}

impl ActiveSource {
    pub fn new(name: &str, source: Rc<Source>, ooe: Rc<StateExpr>) -> ActiveSource {
        ActiveSource { ooe, source, name: name.to_string() }
    }
    
    pub fn make_carriage(&self, sf: &mut SourceFactory, leaf: &Leaf) -> Carriage {
        let mut out = Carriage::new(self.clone(),leaf);
        sf.populate_carriage(&mut out);
        out
    }
    
    pub fn populate(&self, resp: &mut SourceResponse, leaf: &Leaf) {
        self.source.populate(resp,leaf);        
    }
    
    pub fn get_name(&self) -> &str { &self.name }  
    
    pub fn is_on(&self, m: &StateManager) -> StateValue {
        self.ooe.is_on(m)
    }
}

impl PartialEq for ActiveSource {
    fn eq(&self, other: &ActiveSource) -> bool {
        self.name == other.name
    }
}
impl Eq for ActiveSource {}

impl Hash for ActiveSource {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name.hash(state);
    }
}

impl fmt::Debug for ActiveSource {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{}",self.get_name())
    }
}
