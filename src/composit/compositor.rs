use std::cmp::{ max, min };
use std::collections::{ HashMap, HashSet };

use composit::{ LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf };
use composit::state::ComponentRedo;

const MAX_FLANK : i32 = 10;

pub struct Compositor {
    vscale: i32,
    train_flank: i32,
    middle_leaf: i64,
    comp_idx: u32,
    components: HashMap<u32,Component>,
    leafcomps: HashMap<Leaf,HashMap<u32,LeafComponent>>
}

pub struct ComponentRemover(u32);

impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            components: HashMap::<u32,Component>::new(),
            leafcomps: HashMap::<Leaf,HashMap<u32,LeafComponent>>::new(),
            comp_idx: 0,
            vscale: 0,
            train_flank: 10,
            middle_leaf: 0,
        }
    }
    
    pub fn set_screen_width(&mut self, width: i32) {
        debug!("trains","set width {}",width);
    }

    pub fn set_position(&mut self, position_bp: f64) {
        self.middle_leaf = (position_bp / vscale_bp_per_leaf(self.vscale) as f64) as i64;
        debug!("trains","set position leaf={}",self.middle_leaf);
        self.add_missing_leafs();
        self.remove_unused_leafs();        
    }
    
    fn add_missing_leafs(&mut self) {
        for idx in -self.train_flank..self.train_flank+1 {
            let hindex = self.middle_leaf + idx as i64;
            let leaf = Leaf::new(hindex,self.vscale);
            if !self.leafcomps.contains_key(&leaf) {
                debug!("trains","adding {}",hindex);
                self.add_leaf(leaf);
            }
        }
    }
    
    fn remove_unused_leafs(&mut self) {
        let mut doomed = HashSet::new();
        for leaf in self.leafcomps.keys() {
            if (leaf.get_index()-self.middle_leaf).abs() > self.train_flank as i64 {
                doomed.insert(leaf.clone());
            }
        }
        for d in doomed {
            debug!("trains","removing {}",d.get_index());
            self.remove_leaf(&d);
        }
    }
    
    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        let leaf_per_screen = bp_per_screen / vscale_bp_per_leaf(self.vscale);
        self.train_flank = min(max((3.*leaf_per_screen) as i32,1),MAX_FLANK);
        debug!("trains","set  bp_per_screen={} bp_per_leaf={} leaf_per_screen={}",
            bp_per_screen,vscale_bp_per_leaf(self.vscale),leaf_per_screen);
        self.add_missing_leafs();
        self.remove_unused_leafs();
    }

    pub fn leafs(&self) -> Vec<Leaf> {
        self.leafcomps.keys().map(|s| s.clone()).collect()
    }

    pub fn add_leaf(&mut self, leaf: Leaf) {
        let mut lcc = HashMap::<u32,LeafComponent>::new();
        for (k,c) in &self.components {
            lcc.insert(*k,c.make_leafcomp(&leaf));
        }
        self.leafcomps.insert(leaf,lcc);
    }
    
    pub fn remove_leaf(&mut self, leaf: &Leaf) {
        self.leafcomps.remove(leaf);
    }
    
    pub fn get_components(&mut self, leaf: &Leaf) -> Option<Vec<&mut LeafComponent>> {
        self.leafcomps.get_mut(leaf).map(|s| s.values_mut().collect())
    }
    
    pub fn add_component(&mut self, c: Component) -> ComponentRemover {
        self.comp_idx += 1;
        for (ref mut leaf,ref mut lcc) in &mut self.leafcomps {
            lcc.insert(self.comp_idx,c.make_leafcomp(&leaf));
        }
        self.components.insert(self.comp_idx,c);
        ComponentRemover(self.comp_idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    pub fn calc_level(&mut self, leaf: &Leaf, oom: &StateManager) -> ComponentRedo {
        let mut redo = ComponentRedo::None;
        if let Some(ref mut lcc) = self.leafcomps.get_mut(leaf) {
            for c in lcc.values_mut() {
                redo = redo | c.update_state(oom);
            }
        }
        redo
    }
}
