use std::cmp::{ max, min };
use std::collections::HashMap;

use composit::{
    LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf,
    ScaleCompositor, best_vscale, ComponentManager, ComponentRemover,
    Stick
};
use composit::state::ComponentRedo;

const MS_PER_UPDATE : f64 = 250.;
const MS_FADE : f64 = 300.;

pub struct Transit {
    current_sc: Option<ScaleCompositor>,
    future_sc: Option<ScaleCompositor>,
    transition_sc: Option<ScaleCompositor>,
    transition_start: Option<f64>,
    transition_prop: Option<f64>,    
}

impl Transit {
    pub fn new() -> Transit {
        Transit {
            current_sc: None,
            future_sc: None,
            transition_sc: None,
            transition_start: None,
            transition_prop: None,            
        }
    }
    
    pub fn set_stick(&mut self, st: &Stick, bp_per_screen: f64) {
        // XXX not the right thing to do: should transition
        let vscale = best_vscale(bp_per_screen);
        self.current_sc = Some(ScaleCompositor::new(st,vscale));
        self.current_sc.as_mut().unwrap().set_zoom(bp_per_screen);
        self.transition_sc = None;
        self.future_sc = None;
    }
    
    fn transition_is_done(&mut self, t: f64) {
        if let Some(start) = self.transition_start {
            if t-start < MS_FADE {
                self.transition_prop = Some((t-start)/MS_FADE);
            } else {
                //console!("Fade done to {}",self.transition_sc.as_ref().unwrap().get_vscale());
                self.current_sc = self.transition_sc.take();
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
            //console!("future is ready for transition at {}",
            //        self.transition_sc.as_ref().unwrap().get_vscale());
        }
    }
    
    pub fn switch_scales(&mut self, t: f64) {
        self.transition_is_done(t);
        self.future_is_waiting(t);
    }
    
    pub fn each_scale<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut ScaleCompositor) {
        if let Some(ref mut current_sc) = self.current_sc {
            cb(current_sc);
        }
        if let Some(ref mut transition_sc) = self.transition_sc {
            cb(transition_sc);
        }
        if let Some(ref mut future_sc) = self.future_sc {
            cb(future_sc);
        }
    }
        
    pub fn get_max_y(&self) -> i32 {
        let mut max = 0;
        if let Some(ref current_sc) = self.current_sc {
            max = current_sc.get_max_y();
        }
        if let Some(ref transition_sc) = self.transition_sc {
            let y = transition_sc.get_max_y();
            if y > max { max = y; }
        }
        max
    }
    
    fn target_vscale(&self) -> Option<i32> {
        if let Some(ref transition_sc) = self.transition_sc {
            Some(transition_sc.get_vscale())
        } else if let Some(ref current_sc) = self.current_sc {
            Some(current_sc.get_vscale())
        } else {
            None
        }
    }

    fn new_scale_future(&mut self, cm: &mut ComponentManager, vscale: i32) {
        //console!("preparing future at {}",vscale);
        let f = self.current_sc.as_ref().unwrap().duplicate(cm,vscale);
        self.future_sc = Some(f);
    }
    
    fn end_future(&mut self) {
        self.future_sc = None;
    }

    pub fn maybe_new_scale(&mut self, cm: &mut ComponentManager, bp_per_screen: f64) {
        let best = best_vscale(bp_per_screen);
        let mut end_future = false;
        let mut new_future = false;
        if let Some(target_vscale) = self.target_vscale() {
            if best != target_vscale {
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
        }
        if end_future { self.end_future(); }
        if new_future { self.new_scale_future(cm,best); }
        //console!("best {}",best);
    }
    
    pub fn get_prop_trans(&self) -> f32 {
        self.transition_prop.unwrap_or(0.) as f32
    }
    
    pub fn all_leafs(&self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        if let Some(ref transition_sc) = self.transition_sc {
            out.append(&mut transition_sc.leafs());
        }
        if let Some(ref current_sc) = self.current_sc {
            out.append(&mut current_sc.leafs());
        }
        out
    }
    
    pub fn get_current_sc(&mut self) -> Option<&mut ScaleCompositor> {
        self.current_sc.as_mut()
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
