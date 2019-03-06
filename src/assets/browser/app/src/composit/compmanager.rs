use std::collections::HashMap;
use std::collections::hash_map::Entry;

const MAX_PENDING : i32 = 0;
const CACHE_SIZE : usize = 10;

use composit::{
    ActiveSource, Leaf, Carriage, SourceSched
};

pub struct ComponentManager {
    components: HashMap<String,ActiveSource>,
    source_factory: SourceSched
}

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            components: HashMap::<String,ActiveSource>::new(),
            source_factory: SourceSched::new(MAX_PENDING,CACHE_SIZE)
        }
    }
    
    pub fn tick(&mut self, t: f64) {
        self.source_factory.tick(t);
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
    
    pub fn make_comp_carriages(&mut self, c: &ActiveSource, leaf: &Leaf) -> Vec<Carriage> {
        let mut lcomps = Vec::<Carriage>::new();
        lcomps.push(c.make_carriage(&mut self.source_factory,&None,&leaf));
        for part in c.list_parts() {            
            debug!("redraw","make_carriages {:?} for {}",leaf,part);
            lcomps.push(c.make_carriage(&mut self.source_factory,&Some(part),&leaf));
        }
        lcomps
    }
    
    pub fn make_leaf_carriages(&mut self, leaf: Leaf) -> Vec<Carriage> {
        let mut lcomps = Vec::<Carriage>::new();
        debug!("redraw","make_carriages {:?}",leaf);
        let comps : Vec<ActiveSource> = self.components.values().cloned().collect();
        for c in &comps {
            lcomps.append(&mut self.make_comp_carriages(c,&leaf));
        }
        lcomps
    }    
}
