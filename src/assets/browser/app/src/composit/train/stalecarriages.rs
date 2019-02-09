use std::collections::HashMap;
use composit::Leaf;

pub struct StaleCarriages {
    done_seen: HashMap<Leaf,u32>,
    done_now: u32
}

impl StaleCarriages {
    pub fn new() -> StaleCarriages {
        StaleCarriages {
            done_seen: HashMap::<Leaf,u32>::new(),
            done_now: 1
        }
    }
    
    pub fn all_stale(&mut self) {
        self.done_now += 1;
    }
    
    pub fn is_stale(&self, leaf: &Leaf) -> bool {
        let done_seen = *self.done_seen.get(leaf).unwrap_or(&0);
        done_seen < self.done_now            
    }

    pub fn not_stale(&mut self, leaf: &Leaf) {
        self.done_seen.insert(leaf.clone(),self.done_now);
    }
    
    pub fn set_stale(&mut self, leaf: &Leaf) {
        self.done_seen.remove(&leaf.clone());
    }
}
