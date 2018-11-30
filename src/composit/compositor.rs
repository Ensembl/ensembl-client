use std::cmp::{ max, min };
use std::collections::HashMap;

use composit::{
    LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf,
    ScaleCompositor, best_vscale, ComponentManager, ComponentRemover,
    Stick, Transit
};
use composit::state::ComponentRedo;

const MS_PER_UPDATE : f64 = 250.;

pub struct Compositor {
    transit: Transit,
    bp_per_screen: f64,
    updated: bool,
    last_updated: Option<f64>,
    components: ComponentManager
}

impl Compositor {
    pub fn new() -> Compositor {
        let mut out = Compositor {
            transit: Transit::new(),
            components: ComponentManager::new(),
            bp_per_screen: 1.,
            updated: true,
            last_updated: None
        };
        out.set_zoom(1.); // XXX
        out
    }

    pub fn get_prop_trans(&self) -> f32 { self.transit.get_prop_trans() }

    pub fn tick(&mut self, t: f64) {
        /* Move into future */
        self.transit.switch_scales(t);
        /* Manage useful leafs */
        if self.updated {
            if let Some(prev_t) = self.last_updated {
                if t-prev_t < MS_PER_UPDATE { return; }
            }
            let comps = &mut self.components;
            self.transit.each_scale(|sc|
                sc.manage_leafs(comps)
            );            
            self.updated = false;
            self.last_updated = Some(t);
        }
    }

    pub fn set_stick(&mut self, st: &Stick) {
        self.transit.set_stick(st,self.bp_per_screen);
    }

    pub fn set_position(&mut self, position_bp: f64) {
        self.transit.each_scale(|sc|
            sc.set_position(position_bp)
        );        
        self.updated = true;
    }
    
    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        //console!("zoom = {}",bp_per_screen);
        self.bp_per_screen = bp_per_screen;
        self.transit.each_scale(|sc|
            sc.set_zoom(bp_per_screen)
        );
        self.transit.maybe_new_scale(&mut self.components, bp_per_screen);
        self.updated = true;
    }

    pub fn get_current_sc(&mut self) -> Option<&mut ScaleCompositor> {
        self.transit.get_current_sc()
    }

    pub fn get_transition_sc(&mut self) -> Option<&mut ScaleCompositor> {
        self.transit.get_transition_sc()
    }
    
    pub fn add_component(&mut self, mut c: Component) -> ComponentRemover {
        self.components.prepare(&mut c);
        self.transit.each_scale(|sc|
            sc.add_component(&c)
        );
        self.components.add(c)
    }

    pub fn get_max_y(&self) -> i32 { self.transit.get_max_y() }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(k);
    }
    
    pub fn all_leafs(&self) -> Vec<Leaf> { self.transit.all_leafs() }
}
