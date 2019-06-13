use std::collections::{ HashMap, HashSet };
use composit::Leaf;

use super::{ ZMenuLeaf, ZMenuLeafSet };

pub struct ZMenuRegistry {
    zml: HashMap<Leaf,ZMenuLeaf>
}

impl ZMenuRegistry {
    pub fn new() -> ZMenuRegistry {
        ZMenuRegistry {
            zml: HashMap::new()
        }
    }
    
    pub fn update(&mut self, mut zmls: ZMenuLeafSet) {
        let leafs = zmls.take_leafs();
        let seen_leafs : HashSet<Leaf> = leafs.iter().map(|x| x.get_leaf()).cloned().collect();
        for zml in leafs {
            if zml.was_redrawn() {
                console!("zmr : redraw {:?}",zml.get_leaf());
                self.zml.insert(zml.get_leaf().clone(),zml);
            }
        }
        let expected_leafs : HashSet<Leaf> = self.zml.keys().cloned().collect();
        let gone = expected_leafs.difference(&seen_leafs);
        for leaf in gone {
            console!("zmr : gone {:?}",leaf);
            self.zml.remove(&leaf);
        }
    }    
}
