use std::collections::HashMap;
use std::collections::hash_map::Entry;

const MAX_PENDING : i32 = 16;
const CACHE_SIZE : usize = 100;

use composit::{
    ActiveSource, Leaf, Carriage, SourceFactory
};

pub struct ComponentManager {
    components: HashMap<String,ActiveSource>,
    source_factory: SourceFactory
}

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            components: HashMap::<String,ActiveSource>::new(),
            source_factory: SourceFactory::new(MAX_PENDING,CACHE_SIZE)
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
    
    pub fn make_carriage(&mut self, c: &ActiveSource, leaf: &Leaf) -> Carriage {
        c.make_carriage(&mut self.source_factory,&leaf)
    }
    
    pub fn make_carriages(&mut self, leaf: Leaf) -> Vec<Carriage> {
        let mut lcomps = Vec::<Carriage>::new();        
        for (_k,c) in &self.components {
            debug!("redraw","make_carriages {:?}",leaf);
            lcomps.push(c.make_carriage(&mut self.source_factory,&leaf));
        }
        lcomps
    }    
}
