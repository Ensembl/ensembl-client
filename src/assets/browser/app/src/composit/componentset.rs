use std::collections::{ HashMap, HashSet };

use model::supply::Product;

#[derive(Clone)]
pub struct ComponentSet {
    components: HashMap<String,Product>
}

impl ComponentSet {
    pub fn new() -> ComponentSet {
        ComponentSet {
            components: HashMap::<String,Product>::new()
        }
    }
    
    pub fn add(&mut self, comp: Product) {
        self.components.insert(comp.get_product_name().to_string(),comp);
    }
    
    pub fn remove(&mut self, comp: Product) {
        self.components.remove(comp.get_product_name());
    }
    
    pub fn get_products(&self) -> impl Iterator<Item=&Product> {
        self.components.values()
    }
    
    pub fn not_in(&self, other: &ComponentSet) -> Vec<Product> {
        let our_keys : HashSet<String> = self.components.keys().cloned().collect();
        let their_keys : HashSet<String> = other.components.keys().cloned().collect();
        our_keys.difference(&their_keys).map(|x| self.components[x].clone()).collect()
    }
}
