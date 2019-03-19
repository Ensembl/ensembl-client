use std::collections::{ HashMap, HashSet };

use composit::{
    Leaf, Traveller, StateManager, Scale,
    ComponentManager, ActiveSource, Stick, Carriage
};
use composit::state::ComponentRedo;

const MAX_FLANK : i32 = 3;

pub struct Train {
    carriages: HashMap<Leaf,Carriage>,
    stick: Stick,
    scale: Scale,
    ideal_flank: i32,
    middle_leaf: i64,
    preload: bool,
    position_bp: Option<f64>,
    active: bool
}

impl Train {
    pub fn new(stick: &Stick, scale: Scale) -> Train {
        Train {
            stick: stick.clone(),
            scale, preload: true,
            ideal_flank: 0,
            middle_leaf: 0,
            carriages: HashMap::<Leaf,Carriage>::new(),
            position_bp: None,
            active: true
        }
    }
        
    /* *****************************************************************
     * Methods for TRAINMANAGER to call when the user changes something.
     * *****************************************************************
     */
    
    /* are we active (ie should we scan around as the user does?) */
    pub(in super) fn set_active(&mut self, yn: bool) {
        self.active = yn;
        if yn { console!("{:?} is active",self.scale); } else { console!("{:?} is inactive",self.scale); }
    }
    
    /* which scale are we (ie which train)? */
    pub(in super) fn get_scale(&self) -> &Scale { &self.scale }
    
    /* called when position changes, to update carriages */
    pub(in super) fn set_position(&mut self, position_bp: f64) {
        self.middle_leaf = (position_bp / self.scale.total_bp()).floor() as i64;
        self.position_bp = Some(position_bp);
    }
    
    /* called when no-longer preload, so flanks should be expanded */
    pub(in super) fn enter_service(&mut self) {
        self.preload = false;
    }
    
    /* called when zoom changes, to update flank */
    pub(in super) fn set_zoom(&mut self, bp_per_screen: f64) {
        self.ideal_flank = (bp_per_screen / self.scale.total_bp()) as i32;
        /* reset middle leaf after zoom */
        if let Some(pos) = self.position_bp {
            self.set_position(pos);
        }
    }
    
    /* add component to leaf */
    pub fn add_component(&mut self, cm: &mut ComponentManager, c: &ActiveSource) {
        for leaf in self.leafs() {
            let lcomps = cm.make_comp_carriages(c,&leaf);
            self.add_carriages_to_leaf(leaf,lcomps);
        }
        for c in self.carriages.values_mut() {
            c.set_needs_rebuild();
        }
    }

    /* *****************************************************************
     * manage_leafs is called by COMPOSITOR on a tick if we've moved to 
     * allow leafs to scroll in and out of view, and by TRAINMANAGER on
     * creating new scales. Adds and removes carriages corresponging to 
     * the relevant leafs.
     * *****************************************************************
     */

    /* flank to use taking into account train status */
    fn true_flank(&self) -> i32 {
        let mut f = self.ideal_flank.min(MAX_FLANK);
        if !self.preload { f = f.max(1); }
        f
    }

    /* add leafs created below */
    fn add_carriages_to_leaf(&mut self, leaf: Leaf, mut cc: Vec<Traveller>) {
        if !self.carriages.contains_key(&leaf) {
            self.carriages.insert(leaf.clone(),Carriage::new());
        }
        let mut ts = self.carriages.get_mut(&leaf).unwrap();
        for lc in cc.drain(..) {
            ts.add_traveller(lc);
        }
    }
    
    /* make leafs to be added */
    fn get_missing_leafs(&mut self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        let flank = self.true_flank();
        for idx in -flank..flank+1 {
            let hindex = self.middle_leaf + idx as i64;
            let leaf = Leaf::new(&self.stick,hindex,&self.scale);
            if !self.carriages.contains_key(&leaf) {
                //debug!("trains","adding {}",hindex);
                out.push(leaf);
            }
        }
        return out;
    }
    
    /* remove leafs out of scope */
    fn remove_unused_leafs(&mut self) {
        let mut doomed = HashSet::new();
        let flank = self.true_flank();
        for leaf in self.carriages.keys() {
            if (leaf.get_index()-self.middle_leaf).abs() > flank as i64 {
                doomed.insert(leaf.clone());
            }
        }
        for d in doomed {
            debug!("trains","removing {}",d.get_index());
            self.carriages.remove(&d);
        }
    }

    /* manage_leafs entry point */
    pub fn manage_leafs(&mut self, cm: &mut ComponentManager) {
        if !self.active { return; }
        self.remove_unused_leafs();
        for leaf in self.get_missing_leafs() {
            let cc = cm.make_leaf_carriages(leaf.clone());
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
        for leaf in self.carriages.keys() {
            out.push(leaf.clone());
        }
        out
    }
    
    /* Are all the carriages done? */
    pub(in super) fn is_done(&mut self) -> bool {
        for c in self.carriages.values_mut() {
            if !c.is_done() { return false; }
        }
        return true;
    }
    
    /* used in LEAFPRINTER to get actual data to print from components */
    pub fn get_travellers(&mut self, leaf: &Leaf) -> Option<Vec<&mut Traveller>> {
        if !self.is_done() { return None; }
        self.carriages.get_mut(leaf).map(|x| x.all_travellers_mut())
    }
    
    /* how much redrawing is needed? */
    pub fn calc_level(&mut self, leaf: &Leaf, oom: &StateManager) -> ComponentRedo {
        /* Any change due to component changes? */
        let mut redo = ComponentRedo::None;
        for t in &mut self.get_travellers(leaf).unwrap_or(vec!{}).iter_mut() {
            redo = redo | t.update_state(oom);
        }
        if redo == ComponentRedo::Major && self.is_done() {
            if let Some(c) = self.carriages.get_mut(&leaf) {
                c.set_rebuild_pending();
            }
        }
        if redo != ComponentRedo::None {
            console!("redo {:?}",redo);
        }
        /* Any change due to availability? */
        if self.is_done() {
            if let Some(c) = self.carriages.get_mut(&leaf) {
                if c.needs_rebuild() {
                    c.set_rebuild_pending();
                    debug!("redraw","stale {:?}",leaf);
                    return ComponentRedo::Major;
                }
            }
        }
        redo
    }
}
