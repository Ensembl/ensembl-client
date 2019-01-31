use std::collections::HashMap;
use composit::{ Carriage, Leaf, ActiveSource };

pub struct CarriageSet {
    carriages: HashMap<Leaf,HashMap<ActiveSource,Carriage>>
}

impl CarriageSet {
    pub fn new() -> CarriageSet {
        CarriageSet {
            carriages: HashMap::<Leaf,HashMap<ActiveSource,Carriage>>::new()
        }
    }
    
    pub fn add_carriage(&mut self, leaf: &Leaf, carriage: Carriage) {
        let lcc = self.carriages.entry(leaf.clone()).or_insert_with(||
            HashMap::<ActiveSource,Carriage>::new()
        );
        lcc.insert(carriage.get_source().clone(),carriage);
    }
    
    pub fn remove_leaf(&mut self, leaf: &Leaf) {
        self.carriages.remove(leaf);
    }

    pub fn contains_leaf(&mut self, leaf: &Leaf) -> bool {
        return self.carriages.contains_key(&leaf)
    }
    
    pub fn all_leafs(&self) -> Vec<&Leaf> {
        self.carriages.keys().collect()
    }

    pub fn all_carriages(&self) -> Vec<&Carriage> {
        let mut out = Vec::<&Carriage>::new();
        for (leaf,lcc) in &self.carriages {
            for lc in lcc.values() {
                out.push(lc);
            }
        }
        out
    }
    
    pub fn leaf_carriages(&mut self, leaf: &Leaf) -> Vec<&mut Carriage> {
        if let Some(lcc) = self.carriages.get_mut(leaf) {
            lcc.values_mut().collect()
        } else {
            vec!{}
        }
    }
}
