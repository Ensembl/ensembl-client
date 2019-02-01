use std::cmp::{ max, min };
use std::collections::HashSet;

use composit::{
    Leaf, Carriage, StateManager, vscale_bp_per_leaf,
    ComponentManager, ActiveSource, Stick, CarriageSet, StaleCarriages
};
use composit::state::ComponentRedo;

const MAX_FLANK : i32 = 2;

pub struct Train {
    carriages: CarriageSet,
    stale: StaleCarriages,
    stick: Stick,
    vscale: i32,
    train_flank: i32,
    middle_leaf: i64,    
}

impl Train {
    pub fn new(stick: &Stick, vscale: i32) -> Train {
        Train {
            stick: stick.clone(),
            vscale,
            train_flank: 10,
            middle_leaf: 0,
            carriages: CarriageSet::new(),
            stale: StaleCarriages::new(),
        }
    }
        
    /* *****************************************************************
     * Methods for TRAINMANAGER to call when the user changes something.
     * *****************************************************************
     */
        
    /* which scale are we (ie which train)? */
    pub fn get_vscale(&self) -> i32 { self.vscale }
    
    /* called when position changes, to update carriages */
    pub fn set_position(&mut self, position_bp: f64) {
        self.middle_leaf = (position_bp / vscale_bp_per_leaf(self.vscale) as f64).floor() as i64;
    }
    
    /* called when zoom changes, to update flank */
    pub fn set_zoom(&mut self, bp_per_screen: f64) {
        let leaf_per_screen = bp_per_screen / vscale_bp_per_leaf(self.vscale);
        self.train_flank = min(max((2. * leaf_per_screen) as i32,1),MAX_FLANK);
        debug!("trains","set  bp_per_screen={} bp_per_leaf={} leaf_per_screen={} flank={}",
            bp_per_screen,vscale_bp_per_leaf(self.vscale),leaf_per_screen,self.train_flank);
    }
    
    /* add component to leaf */
    pub fn add_component(&mut self, cm: &mut ComponentManager, c: &ActiveSource) {
        for leaf in self.leafs() {
            let lcomps = vec! { cm.make_carriage(c,&leaf) };
            self.add_carriages_to_leaf(leaf,lcomps);
        }
        self.stale.all_stale();
    }

    /* *****************************************************************
     * manage_leafs is called by COMPOSITOR on a tick if we've moved to 
     * allow leafs to scroll in and out of view, and by TRAINMANAGER on
     * creating new scales. Adds and removes carriages corresponging to 
     * the relevant leafs.
     * *****************************************************************
     */

    /* add leafs created below */
    fn add_carriages_to_leaf(&mut self, leaf: Leaf, mut cc: Vec<Carriage>) {
        for lc in cc.drain(..) {
            self.carriages.add_carriage(&leaf,lc);
        }
    }
    
    /* make leafs to be added */
    fn get_missing_leafs(&mut self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        for idx in -self.train_flank..self.train_flank+1 {
            let hindex = self.middle_leaf + idx as i64;
            let leaf = Leaf::new(&self.stick,hindex,self.vscale);
            if !self.carriages.contains_leaf(&leaf) {
                debug!("trains","adding {}",hindex);
                out.push(leaf);
            }
        }
        return out;
    }
    
    /* remove leafs out of scope */
    fn remove_unused_leafs(&mut self) {
        let mut doomed = HashSet::new();
        for leaf in self.carriages.all_leafs() {
            if (leaf.get_index()-self.middle_leaf).abs() > self.train_flank as i64 {
                doomed.insert(leaf.clone());
            }
        }
        for d in doomed {
            debug!("trains","removing {}",d.get_index());
            self.carriages.remove_leaf(&d);
        }
    }

    /* manage_leafs entry point */
    pub fn manage_leafs(&mut self, cm: &mut ComponentManager) {
        self.remove_unused_leafs();
        for leaf in self.get_missing_leafs() {
            let cc = cm.make_carriages(leaf.clone());
            self.add_carriages_to_leaf(leaf,cc);
        }
    }

    /* ***********************************************************
     * Aggregate information about our carriages for TRAINMANAGER.
     * ***********************************************************
     */
    
    /* used by TRAINMANAGER to generate all_printing_leafs for printer,
     * and by PRINTER to work out what needs preparing.
     */
    pub fn leafs(&self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        for leaf in self.carriages.all_leafs() {
            out.push(leaf.clone());
        }
        out
    }
    
    /* Are all the carriages done? */
    pub fn is_done(&mut self) -> bool {
        for c in self.carriages.all_carriages() {
            if !c.is_done() { return false; }
        }
        return true;
    }
    
    /* used in LEAFPRINTER to get actual data to print from components */
    pub fn get_carriages(&mut self, leaf: &Leaf) -> Option<Vec<&mut Carriage>> {
        if !self.is_done() { return None; }
        Some(self.carriages.leaf_carriages(leaf))
    }
    
    /* Maximum y of all carriages (for y endstop) */
    pub fn get_max_y(&self) -> i32 {
        let mut max = 0;
        for c in self.carriages.all_carriages() {
            let y = c.get_max_y();
            if y > max { max = y; }
        }
        max
    }

    /* how much redrawing is needed? */
    pub fn calc_level(&mut self, leaf: &Leaf, oom: &StateManager) -> ComponentRedo {
        /* Any change due to component changes? */
        let mut redo = ComponentRedo::None;
        for c in self.carriages.leaf_carriages(leaf) {
            redo = redo | c.update_state(oom);
        }
        if redo == ComponentRedo::Major && self.is_done() {
            self.stale.not_stale(&leaf);
        }
        if redo != ComponentRedo::None {
            debug!("redraw","{:?} {:?}",leaf,redo);
        }
        /* Any change due to availability? */
        if self.stale.is_stale(&leaf) {
            if self.is_done() {
                self.stale.not_stale(&leaf);
                debug!("redraw","stale {:?}",leaf);
                return ComponentRedo::Major;
            }
        }
        redo
    }
}
