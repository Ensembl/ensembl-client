use std::collections::HashMap;
use std::collections::hash_map::Entry;

use model::train::Traveller;

const MAX_PENDING : i32 = 0;
const CACHE_SIZE : usize = 10;

use composit::{
    ActiveSource, Leaf, AllSourceResponseBuilder
};

pub struct ComponentManager {
    components: HashMap<String,ActiveSource>
}

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            components: HashMap::<String,ActiveSource>::new()
        }
    }
        
    pub fn add(&mut self, c: ActiveSource) {
        let name = c.get_name().to_string();
        if let Entry::Vacant(e) = self.components.entry(name) {
            e.insert(c);
        }
    }

    pub fn remove(&mut self, k: &str) {
        self.components.remove(k);
    }
    
    pub fn make_comp_carriages(&mut self, c: &ActiveSource, leaf: &Leaf) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        let asrb = AllSourceResponseBuilder::new(&c.list_parts());
        let mut source = c.get_source().clone();
        lcomps.push(c.make_carriage(&asrb,&None,&leaf));
        for part in c.list_parts() {            
            debug!("redraw","make_carriages {:?} for {}",leaf,part);
            lcomps.push(c.make_carriage(&asrb,&Some(part),&leaf));
        }
        source.populate(c,asrb,leaf);
        lcomps
    }
    
    pub fn make_leaf_carriages(&mut self, leaf: Leaf) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        debug!("redraw","make_carriages {:?}",leaf);
        let comps : Vec<ActiveSource> = self.components.values().cloned().collect();
        for c in &comps {
            lcomps.append(&mut self.make_comp_carriages(c,&leaf));
        }
        lcomps
    }    
}
