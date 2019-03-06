use std::cmp::{ Eq, PartialEq };
use std::collections::HashMap;
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{
    AllLandscapes, Landscape, Source,
    Carriage, Leaf, SourceSched, SourceResponse, StateManager,
    StateValue
};

use super::SourcePart;

#[derive(Clone)]
pub struct ActiveSource {
    als: AllLandscapes,
    lid: usize,
    name: String,
    parts: HashMap<Option<String>,SourcePart>,
    source: Rc<Source>
}

impl ActiveSource {
    pub fn new(name: &str, source: Rc<Source>, als: &AllLandscapes, lid: usize) -> ActiveSource {
        let mut out = ActiveSource {
            source, lid,
            name: name.to_string(),
            als: als.clone(),
            parts: HashMap::<Option<String>,SourcePart>::new()
        };
        out
    }
    
    pub fn new_part(&mut self, part: Option<&str>, ooe: Rc<StateExpr>) {
        self.parts.insert(part.map(|x| x.to_string()),SourcePart::new(part,&ooe));
    }
    
    pub fn list_parts(&self) -> Vec<String> {
        self.parts.keys().filter(|x| x.is_some()).map(|x| x.as_ref().unwrap().clone()).collect()
    }
    
    pub fn make_carriage(&self, sf: &mut SourceSched, part: &Option<String>, leaf: &Leaf) -> Carriage {
        let mut out = Carriage::new(self.clone(),part,leaf);
        sf.populate_carriage(&mut out);
        out
    }
    
    pub fn populate(&mut self, resp: &mut SourceResponse, leaf: &Leaf) {
        let twin = self.source.clone();
        twin.populate(self,resp,leaf);
    }
    
    pub fn get_name(&self) -> &str { &self.name }  
    
    pub fn is_on(&self, m: &StateManager, part: &Option<String>) -> StateValue {
        self.parts.get(&part).unwrap().is_on(m)
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
