use std::cmp::{ max, min };
use std::collections::{ HashMap, HashSet };

use composit::{ LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf,ScaleCompositor };
use composit::state::ComponentRedo;

const MS_PER_UPDATE : f64 = 250.;

pub struct Compositor {
    sc: ScaleCompositor,    
    updated: bool,
    last_updated: Option<f64>,
    comp_idx: u32,
    components: HashMap<u32,Component>
}

pub struct ComponentRemover(u32);

impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            sc: ScaleCompositor::new(0),
            components: HashMap::<u32,Component>::new(),
            comp_idx: 0,
            updated: true,
            last_updated: None
        }
    }
    
    pub fn set_screen_width(&mut self, width: i32) {
        debug!("trains","set width {}",width);
    }

    pub fn tick(&mut self, t: f64) {
        if self.updated {
            if let Some(prev_t) = self.last_updated {
                if t-prev_t < MS_PER_UPDATE { return; }
            }
            let missing = self.sc.manage_leafs();
            for leaf in missing {
                let lcomps = self.make_leafcomps(leaf);
                self.sc.add_lcomps_to_leaf(leaf,lcomps);
            }
            
            self.updated = false;
            self.last_updated = Some(t);
        }
    }

    pub fn set_position(&mut self, position_bp: f64) {
        self.sc.set_position(position_bp);
        self.updated = true;
    }
    
    fn make_leafcomps(&self, leaf: Leaf) -> Vec<LeafComponent> {
        let mut lcomps = Vec::<LeafComponent>::new();        
        for (k,c) in &self.components {
            lcomps.push(c.make_leafcomp(&leaf));
        }
        lcomps
    }

    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        self.sc.set_zoom(bp_per_screen);
        self.updated = true;
    }

    pub fn leafs(&self) -> Vec<Leaf> {
        self.sc.leafs()
    }
    
    pub fn get_components(&mut self, leaf: &Leaf) -> Option<Vec<&mut LeafComponent>> {
        self.sc.get_components(leaf)
    }
    
    pub fn add_component(&mut self, mut c: Component) -> ComponentRemover {
        self.comp_idx += 1;
        c.set_index(self.comp_idx);
        for leaf in self.sc.leafs() {
            let lcomps = vec! { c.make_leafcomp(&leaf) };
            self.sc.add_lcomps_to_leaf(leaf,lcomps);
        }
        self.components.insert(self.comp_idx,c);
        ComponentRemover(self.comp_idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    pub fn calc_level(&mut self, leaf: &Leaf, oom: &StateManager) -> ComponentRedo {
        self.sc.calc_level(leaf,oom)
    }
}
