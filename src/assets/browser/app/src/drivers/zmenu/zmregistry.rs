use std::sync::{ Arc, Mutex };
use std::collections::{ HashMap, HashSet };
use composit::{ Leaf, Stage };
use types::Dot;

use super::{ ZMenuLeaf, ZMenuLeafSet, ZMenuFeatureTmpl };

pub struct ZMenuRegistryImpl {
    zml: HashMap<Leaf,ZMenuLeaf>,
    tmpls: HashMap<String,ZMenuFeatureTmpl>
}

impl ZMenuRegistryImpl {
    pub fn new() -> ZMenuRegistryImpl {
        ZMenuRegistryImpl {
            zml: HashMap::new(),
            tmpls: HashMap::new()
        }
    }
    
    pub fn add_leafset(&mut self, mut zmls: ZMenuLeafSet) {
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
    
    fn add_template(&mut self, sid: &str, tmpl: ZMenuFeatureTmpl) {
        bb_log!("zmenu","template: {:?}",tmpl);
        self.tmpls.insert(sid.to_string(),tmpl);
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
    
    pub fn intersects(&self, stage: &Stage, pos: Dot<i32,i32>) {
        self.0.lock().unwrap().intersects(stage,pos);
    }   
    
    pub fn add_template(&mut self, sid: &str, spec: &str) {
        self.0.lock().unwrap().add_template(sid,ZMenuFeatureTmpl::new(spec));
    }
}
