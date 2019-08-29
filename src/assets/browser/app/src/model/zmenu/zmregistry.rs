use std::sync::{ Arc, Mutex };
use std::collections::{ HashMap, HashSet };
use composit::Leaf;
use controller::input::Action;
use model::stage::{ Screen, Position };
use types::Dot;

use super::{ ZMenuLeaf, ZMenuLeafSet, ZMenuFeatureTmpl, ZMenuData, ZMenuIntersection };

pub struct ZMenuRegistryImpl {
    zml: HashMap<Leaf,ZMenuLeaf>,
    data: ZMenuData
}

impl ZMenuRegistryImpl {
    pub fn new() -> ZMenuRegistryImpl {
        ZMenuRegistryImpl {
            zml: HashMap::new(),
            data: ZMenuData::new()
        }
    }
    
    pub fn add_leafset(&mut self, mut zmls: ZMenuLeafSet) {
        /* hotspots */
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
    
    pub fn intersects(&self, screen: &Screen, position: &Position, pos: Dot<i32,i32>) -> HashSet<ZMenuIntersection> {
        let mut all = HashSet::new();
        bb_log!("zmenu","zmr: pos={:?}",pos);
        for zml in self.zml.values() {
            for zmi in zml.intersects(screen,position,pos) {
                all.insert(zmi);
            }
        }
        all
    }       
}

#[derive(Clone)]
pub struct ZMenuRegistry(Arc<Mutex<ZMenuRegistryImpl>>);

impl ZMenuRegistry {
    pub fn new() -> ZMenuRegistry {
        ZMenuRegistry(Arc::new(Mutex::new(ZMenuRegistryImpl::new())))
    }
    
    pub fn add_leafset(&mut self, mut zmls: ZMenuLeafSet) {
        self.0.lock().unwrap().add_leafset(zmls);
    }
    
    pub fn intersects(&self, screen: &Screen, position: &Position, pos: Dot<i32,i32>) -> HashSet<ZMenuIntersection> {
        self.0.lock().unwrap().intersects(screen,position,pos)
    }    
}
