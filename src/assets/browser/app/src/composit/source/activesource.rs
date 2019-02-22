use std::cmp::{ Eq, PartialEq };
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{
    AllLandscapes, Landscape,
    Source, Carriage, Leaf, SourceSched, SourceResponse, StateManager,
    StateValue
};

#[derive(Clone)]
pub struct ActiveSource {
    als: AllLandscapes,
    lid: usize,
    name: String,
    ooe: Rc<StateExpr>,
    source: Rc<Source>
}

impl ActiveSource {
    pub fn new(name: &str, source: Rc<Source>, ooe: Rc<StateExpr>, als: &AllLandscapes, lid: usize) -> ActiveSource {
        ActiveSource {
            ooe, source, lid,
            name: name.to_string(),
            als: als.clone()
        }
    }
    
    pub fn make_carriage(&self, sf: &mut SourceSched, leaf: &Leaf) -> Carriage {
        let mut out = Carriage::new(self.clone(),leaf);
        sf.populate_carriage(&mut out);
        out
    }
    
    pub fn populate(&mut self, resp: &mut SourceResponse, leaf: &Leaf) {
        let twin = self.source.clone();
        twin.populate(self,resp,leaf);        
    }
    
    pub fn get_name(&self) -> &str { &self.name }  
    
    pub fn is_on(&self, m: &StateManager) -> StateValue {
        self.ooe.is_on(m)
    }
    
    pub fn with_landscape<F,G>(&mut self, lid: usize, cb: F) -> Option<G>
            where F: FnOnce(&mut Landscape) -> G {
        self.als.with(lid,cb)
    }
    
    pub fn all_landscapes<F,G>(&mut self, cb: F) -> Vec<Option<G>>
            where F: Fn(usize,&mut Landscape) -> G {
        self.als.every(cb)
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
