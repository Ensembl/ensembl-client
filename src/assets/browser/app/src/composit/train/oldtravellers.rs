use std::collections::HashMap;
use composit::Leaf;

pub struct OldTravellers {
    done_seen: HashMap<Leaf,u32>,
    done_now: u32
}

impl OldTravellers {
    pub(in super) fn new() -> OldTravellers {
        OldTravellers {
            done_seen: HashMap::<Leaf,u32>::new(),
            done_now: 1
        }
    }
    
    pub(in super) fn all_old(&mut self) {
        self.done_now += 1;
    }
    
    pub(in super) fn is_old(&self, leaf: &Leaf) -> bool {
        let done_seen = *self.done_seen.get(leaf).unwrap_or(&0);
        done_seen < self.done_now            
    }

    pub(in super) fn not_old(&mut self, leaf: &Leaf) {
        self.done_seen.insert(leaf.clone(),self.done_now);
    }
    
    pub(in super) fn set_old(&mut self, leaf: &Leaf) {
        self.done_seen.remove(&leaf.clone());
    }
}
