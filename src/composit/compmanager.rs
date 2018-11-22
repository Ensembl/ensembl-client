use std::collections::HashMap;

use composit::{
    Component, Leaf, LeafComponent
};

pub struct ComponentManager {
    comp_idx: u32,
    components: HashMap<u32,Component>    
}

pub struct ComponentRemover(u32);

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            comp_idx: 0,
            components: HashMap::<u32,Component>::new()
        }
    }
    
    pub fn prepare(&mut self, c: &mut Component) {
        self.comp_idx += 1;
        c.set_index(self.comp_idx);
    }
    
    pub fn add(&mut self, c: Component) -> ComponentRemover {
        self.components.insert(self.comp_idx,c);
        ComponentRemover(self.comp_idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    pub fn make_leafcomps(&self, leaf: Leaf) -> Vec<LeafComponent> {
        let mut lcomps = Vec::<LeafComponent>::new();        
        for (k,c) in &self.components {
            lcomps.push(c.make_leafcomp(&leaf));
        }
        lcomps
    }    
}
