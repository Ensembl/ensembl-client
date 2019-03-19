use std::collections::{ HashMap, HashSet };

use composit::ActiveSource;

#[derive(Clone)]
pub struct ComponentSet {
    components: HashMap<String,ActiveSource>
}

impl ComponentSet {
    pub fn new() -> ComponentSet {
        ComponentSet {
            components: HashMap::<String,ActiveSource>::new()
        }
    }
    
    pub fn add(&mut self, comp: ActiveSource) {
        self.components.insert(comp.get_name().to_string(),comp);
    }
    
    pub fn remove(&mut self, comp: ActiveSource) {
        self.components.remove(comp.get_name());
    }
    
    pub fn list_names(&self) -> Vec<String> {
        self.components.keys().cloned().collect()
    }
    
    pub fn not_in(&self, other: &ComponentSet) -> Vec<ActiveSource> {
        let our_keys : HashSet<String> = self.components.keys().cloned().collect();
        let their_keys : HashSet<String> = other.components.keys().cloned().collect();
        our_keys.difference(&their_keys).map(|x| self.components[x].clone()).collect()
    }
}
