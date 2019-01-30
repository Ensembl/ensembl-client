use std::collections::HashMap;
use std::collections::hash_map::Entry;

use composit::{
    Component, Leaf, Carriage, SourceFactory
};

pub struct ComponentManager {
    components: HashMap<String,Component>,
    source_factory: SourceFactory
}

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            components: HashMap::<String,Component>::new(),
            source_factory: SourceFactory::new()
        }
    }
        
    pub fn add(&mut self, c: Component) {
        let name = c.get_name().to_string();
        if let Entry::Vacant(e) = self.components.entry(name) {
            e.insert(c);
        }
    }

    pub fn remove(&mut self, k: &str) {
        self.components.remove(k);
    }
    
    pub fn make_carriage(&mut self, c: &Component, leaf: &Leaf) -> Carriage {
        c.make_carriage(&mut self.source_factory,&leaf)
    }
    
    pub fn make_carriages(&mut self, leaf: Leaf) -> Vec<Carriage> {
        let mut lcomps = Vec::<Carriage>::new();        
        for (_k,c) in &self.components {
            lcomps.push(c.make_carriage(&mut self.source_factory,&leaf));
        }
        lcomps
    }    
}
