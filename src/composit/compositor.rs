use std::cmp::{ max, min };
use std::collections::{ HashMap, HashSet };

use composit::{ LeafComponent, StateManager, Component, Leaf, vscale_bp_per_leaf,ScaleCompositor, best_vscale };
use composit::state::ComponentRedo;

const MS_PER_UPDATE : f64 = 250.;

pub struct ComponentManager {
    comp_idx: u32,
    components: HashMap<u32,Component>    
}

impl ComponentManager {
    pub fn new() -> ComponentManager {
        ComponentManager {
            comp_idx: 0,
            components: HashMap::<u32,Component>::new()
        }
    }
    
    pub fn prepare(&mut self, c: &mut Component) {
        self.comp_idx += 1;
        c.set_index(self.comp_idx);
    }
    
    pub fn add(&mut self, mut c: Component) -> ComponentRemover {
        self.components.insert(self.comp_idx,c);
        ComponentRemover(self.comp_idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    pub fn make_leafcomps(&self, leaf: Leaf) -> Vec<LeafComponent> {
        let mut lcomps = Vec::<LeafComponent>::new();        
        for (k,c) in &self.components {
            lcomps.push(c.make_leafcomp(&leaf));
        }
        lcomps
    }    
}

pub struct Compositor {
    current_sc: ScaleCompositor,
    future_sc: Option<ScaleCompositor>,
    bp_per_screen: f64,
    updated: bool,
    last_updated: Option<f64>,
    components: ComponentManager
}

pub struct ComponentRemover(u32);

impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            current_sc: ScaleCompositor::new(0),
            future_sc: None,
            components: ComponentManager::new(),
            bp_per_screen: 1.,
            updated: true,
            last_updated: None
        }
    }
    
    pub fn set_screen_width(&mut self, width: i32) {
        debug!("trains","set width {}",width);
    }

    pub fn future_is_waiting(&mut self) -> bool {
        let mut ready = false;
        if let Some(ref mut future_sc) = self.future_sc {
            if future_sc.is_done() {
                ready = true;
            }
        }
        if ready {
            self.current_sc = self.future_sc.take().unwrap();
            self.future_sc = None;
            console!("future is ready at {}",self.current_sc.get_vscale());
        }
        ready
    }

    pub fn tick(&mut self, t: f64) {
        if self.future_is_waiting() || self.updated {
            if let Some(prev_t) = self.last_updated {
                if t-prev_t < MS_PER_UPDATE { return; }
            }
            self.current_sc.manage_leafs(&mut self.components);
            if let Some(ref mut future_sc) = self.future_sc {
                future_sc.manage_leafs(&mut self.components);
            }
            self.updated = false;
            self.last_updated = Some(t);
        }
    }

    pub fn set_position(&mut self, position_bp: f64) {
        self.current_sc.set_position(position_bp);
        if let Some(ref mut future_sc) = self.future_sc {
            future_sc.set_position(position_bp);
        }
        self.updated = true;
    }
    
    fn new_future(&mut self, vscale: i32) {
        console!("preparing future at {}",vscale);
        let f = self.current_sc.duplicate(&mut self.components,vscale);
        self.future_sc = Some(f);
    }
    
    fn end_future(&mut self) {
        self.future_sc = None;
    }
    
    fn maybe_new_scale(&mut self) {
        let best = best_vscale(self.bp_per_screen);
        let mut end_future = false;
        let mut new_future = false;
        if best != self.current_sc.get_vscale() {
            if let Some(ref mut future_sc) = self.future_sc {
                if best != future_sc.get_vscale() {
                    end_future = true;
                    new_future = true;
                }
            } else {
                new_future = true;
            }
        }
        if end_future { self.end_future(); }
        if new_future { self.new_future(best); }
        console!("best {}",best);
    }

    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = bp_per_screen;
        self.current_sc.set_zoom(bp_per_screen);
        if let Some(ref mut future_sc) = self.future_sc {
            future_sc.set_zoom(bp_per_screen);
        }
        self.maybe_new_scale();
        self.updated = true;
    }

    pub fn get_current_sc(&mut self) -> &mut ScaleCompositor {
        &mut self.current_sc
    }
    
    pub fn add_component(&mut self, mut c: Component) -> ComponentRemover {
        self.components.prepare(&mut c);
        self.current_sc.add_component(&c);
        if let Some(ref mut future_sc) = self.future_sc {
            future_sc.add_component(&c);
        }
        self.components.add(c)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(k);
    }    
}
