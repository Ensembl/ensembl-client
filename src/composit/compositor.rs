use std::cmp::{ max, min };
use std::collections::HashMap;

use composit::{
    LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf,
    ScaleCompositor, best_vscale, ComponentManager, ComponentRemover
};
use composit::state::ComponentRedo;

const MS_PER_UPDATE : f64 = 250.;
const MS_FADE : f64 = 300.;

pub struct Transit {
    current_sc: ScaleCompositor,
    future_sc: Option<ScaleCompositor>,
    transition_sc: Option<ScaleCompositor>,
    transition_start: Option<f64>,
    transition_prop: Option<f64>,    
}

impl Transit {
    pub fn new() -> Transit {
        Transit {
            current_sc: ScaleCompositor::new(0),
            future_sc: None,
            transition_sc: None,
            transition_start: None,
            transition_prop: None,            
        }
    }
    
    fn transition_is_done(&mut self, t: f64) {
        if let Some(start) = self.transition_start {
            if t-start < MS_FADE {
                self.transition_prop = Some((t-start)/MS_FADE);
            } else {
                console!("Fade done to {}",self.transition_sc.as_ref().unwrap().get_vscale());
                self.current_sc = self.transition_sc.take().unwrap();
                self.transition_start = None;
                self.transition_prop = None;
            }
        }
    }
    
    fn future_is_waiting(&mut self, t: f64) {
        let mut ready = false;
        if let Some(ref mut future_sc) = self.future_sc {
            if future_sc.is_done() {
                ready = true;
            }
        }
        if ready && self.transition_sc.is_none() {
            self.transition_sc = self.future_sc.take();
            self.transition_start = Some(t);
            self.transition_prop = Some(0.);
            console!("future is ready for transition at {}",
                    self.transition_sc.as_ref().unwrap().get_vscale());
        }
    }
    
    pub fn switch_scales(&mut self, t: f64) {
        self.transition_is_done(t);
        self.future_is_waiting(t);
    }
    
    pub fn each_scale<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut ScaleCompositor) {
        cb(&mut self.current_sc);
        if let Some(ref mut transition_sc) = self.transition_sc {
            cb(transition_sc);
        }
        if let Some(ref mut future_sc) = self.future_sc {
            cb(future_sc);
        }
    }
        
    pub fn get_max_y(&self) -> i32 {
        let mut max = self.current_sc.get_max_y();
        if let Some(ref transition_sc) = self.transition_sc {
            let y = transition_sc.get_max_y();
            if y > max { max = y; }
        }
        max
    }
    
    fn target_vscale(&self) -> i32 {
        if let Some(ref transition_sc) = self.transition_sc {
            transition_sc.get_vscale()
        } else {
            self.current_sc.get_vscale()
        }
    }

    fn new_future(&mut self, cm: &mut ComponentManager, vscale: i32) {
        console!("preparing future at {}",vscale);
        let f = self.current_sc.duplicate(cm,vscale);
        self.future_sc = Some(f);
    }
    
    fn end_future(&mut self) {
        self.future_sc = None;
    }

    pub fn maybe_new_scale(&mut self, cm: &mut ComponentManager, bp_per_screen: f64) {
        let best = best_vscale(bp_per_screen);
        let mut end_future = false;
        let mut new_future = false;
        if best != self.target_vscale() {
            if let Some(ref mut future_sc) = self.future_sc {
                if best != future_sc.get_vscale() {
                    end_future = true;
                    new_future = true;
                }
            } else {
                new_future = true;
            }
        } else if self.future_sc.is_some() {
            end_future = true;
        }
        
        if end_future { self.end_future(); }
        if new_future { self.new_future(cm,best); }
        console!("best {}",best);
    }
    
    pub fn get_prop_trans(&self) -> f32 {
        self.transition_prop.unwrap_or(0.) as f32
    }
    
    pub fn all_leafs(&self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        if let Some(ref transition_sc) = self.transition_sc {
            out.append(&mut transition_sc.leafs());
        }
        out.append(&mut self.current_sc.leafs());
        out
    }
    
    pub fn get_current_sc(&mut self) -> &mut ScaleCompositor {
        &mut self.current_sc
    }

    pub fn get_transition_sc(&mut self) -> Option<&mut ScaleCompositor> {
        self.transition_sc.as_mut()
    }
}

pub struct Compositor {
    transit: Transit,
    bp_per_screen: f64,
    updated: bool,
    last_updated: Option<f64>,
    components: ComponentManager
}

impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            transit: Transit::new(),
            components: ComponentManager::new(),
            bp_per_screen: 1.,
            updated: true,
            last_updated: None
        }
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

    pub fn set_position(&mut self, position_bp: f64) {
        self.transit.each_scale(|sc|
            sc.set_position(position_bp)
        );        
        self.updated = true;
    }
            
    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = bp_per_screen;
        self.transit.each_scale(|sc|
            sc.set_zoom(bp_per_screen)
        );
        self.transit.maybe_new_scale(&mut self.components, bp_per_screen);
        self.updated = true;
    }

    pub fn get_current_sc(&mut self) -> &mut ScaleCompositor {
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
