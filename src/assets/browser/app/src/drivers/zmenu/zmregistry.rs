use std::collections::{ HashMap, HashSet };
use composit::{ Leaf, Stage };
use types::Dot;

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
                bb_log!("zmenu","zmr: redrawn");
                self.zml.insert(zml.get_leaf().clone(),zml);
            }
        }
        let expected_leafs : HashSet<Leaf> = self.zml.keys().cloned().collect();
        let gone = expected_leafs.difference(&seen_leafs);
        for leaf in gone {
            bb_log!("zmenu","zmr: removed");
            self.zml.remove(&leaf);
        }
    }
    
    pub fn intersects(&self, stage: &Stage, pos: Dot<i32,i32>) {
        bb_log!("zmenu","zmr: pos={:?}",pos);
        for zml in self.zml.values() {
            bb_log!("zmenu","zmr: zml");
            zml.intersects(stage,pos);
        }
    }   
}
