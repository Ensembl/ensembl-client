use std::collections::HashMap;
use composit::{ Carriage, Leaf, ActiveSource };

#[derive(Debug)]
pub struct CarriageSet {
    carriages: HashMap<Leaf,HashMap<(ActiveSource,Option<String>),Carriage>>
}

impl CarriageSet {
    pub(in super) fn new() -> CarriageSet {
        CarriageSet {
            carriages: HashMap::<Leaf,HashMap<(ActiveSource,Option<String>),Carriage>>::new()
        }
    }
    
    pub(in super) fn add_carriage(&mut self, leaf: &Leaf, carriage: Carriage) {
        let lcc = self.carriages.entry(leaf.clone()).or_insert_with(||
            HashMap::<(ActiveSource,Option<String>),Carriage>::new()
        );
        lcc.insert((carriage.get_source().clone(),
                    carriage.get_part().clone()),carriage);
    }
    
    pub(in super) fn remove_leaf(&mut self, leaf: &Leaf) {
        self.carriages.remove(leaf);
    }

    pub(in super) fn contains_leaf(&mut self, leaf: &Leaf) -> bool {
        return self.carriages.contains_key(&leaf)
    }
    
    pub(in super) fn all_leafs(&self) -> Vec<&Leaf> {
        self.carriages.keys().collect()
    }

    pub(in super) fn all_carriages(&self) -> Vec<&Carriage> {
        let mut out = Vec::<&Carriage>::new();
        for lcc in self.carriages.values() {
            for lc in lcc.values() {
                out.push(lc);
            }
        }
        out
    }
    
    pub(in super) fn leaf_carriages(&mut self, leaf: &Leaf) -> Vec<&mut Carriage> {
        if let Some(lcc) = self.carriages.get_mut(leaf) {
            lcc.values_mut().collect()
        } else {
            vec!{}
        }
    }
}
