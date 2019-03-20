use std::collections::HashMap;
use composit::{ Leaf, ActiveSource };
use composit::{ ComponentRedo, StateManager };
use super::Traveller;

#[derive(Debug)]
pub struct Carriage {
    travellers: HashMap<(ActiveSource,Option<String>),Traveller>,
    needs_rebuild: bool,
    leaf: Leaf
}

impl Carriage {
    pub(in super) fn new(leaf: &Leaf) -> Carriage {
        Carriage {
            travellers: HashMap::<(ActiveSource,Option<String>),Traveller>::new(),
            needs_rebuild: false,
            leaf: leaf.clone()
        }
    }
    
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    
    pub(in super) fn set_needs_rebuild(&mut self) {
        self.needs_rebuild = true;
    }
    
    pub(in super) fn set_rebuild_pending(&mut self) {
        self.needs_rebuild = false;
    }
    
    pub(in super) fn needs_rebuild(&self) -> bool {
        self.needs_rebuild
    }
    
    pub(in super) fn add_traveller(&mut self, traveller: Traveller) {
        self.travellers.insert((traveller.get_source().clone(),
                               traveller.get_part().clone()),traveller);
    }
        
    pub fn all_travellers(&self) -> Vec<&Traveller> {
        self.travellers.values().collect()
    }

    pub fn all_travellers_mut(&mut self) -> Vec<&mut Traveller> {
        self.travellers.values_mut().collect()
    }
    
    pub(in super) fn is_done(&mut self) -> bool {
        for c in self.travellers.values() {
            if !c.is_done() { return false; }
        }
        return true;
    }
    
    pub fn calc_level(&mut self, oom: &StateManager) -> ComponentRedo {
        /* Any change due to component changes? */
        let mut redo = ComponentRedo::None;
        for t in &mut self.all_travellers_mut() {
            redo = redo | t.update_state(oom);
        }
        if redo == ComponentRedo::Major && self.is_done() {
            self.needs_rebuild = false;
        }
        if redo != ComponentRedo::None {
            console!("redo {:?}",redo);
        }
        /* Any change due to availability? */
        if self.is_done() {
            if self.needs_rebuild {
                self.needs_rebuild = false;
                debug!("redraw","stale {:?}",self.leaf);
                return ComponentRedo::Major;
            }
        }
        redo
    }

}
