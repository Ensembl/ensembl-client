use std::collections::HashMap;
use composit::{ Leaf, ActiveSource };
use composit::{ ComponentRedo, StateManager };
use model::driver::{ Printer, PrinterManager };
use super::Traveller;

pub struct Carriage {
    pm: PrinterManager,
    travellers: Vec<Traveller>,
    needs_rebuild: bool,
    leaf: Leaf
}

impl Carriage {
    pub(in super) fn new(pm: &PrinterManager,leaf: &Leaf) -> Carriage {
        let mut out = Carriage {
            pm: pm.clone(),
            travellers: Vec::<Traveller>::new(),
            needs_rebuild: false,
            leaf: leaf.clone()
        };
        out.pm.add_leaf(leaf);
        out
    }    
    
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    
    pub(in super) fn set_needs_rebuild(&mut self) {
        self.needs_rebuild = true;
    }
    
    pub(in super) fn add_traveller(&mut self, traveller: Traveller) {
        self.travellers.push(traveller);
    }
        
    pub fn all_travellers(&self) -> Vec<&Traveller> {
        self.travellers.iter().collect()
    }

    pub fn all_travellers_mut(&mut self) -> Vec<&mut Traveller> {
        self.travellers.iter_mut().collect()
    }
    
    pub(in super) fn is_done(&mut self) -> bool {
        for c in &self.travellers {
            if !c.is_done() { return false; }
        }
        return true;
    }
    
    pub fn update_state(&mut self, oom: &StateManager) -> ComponentRedo {
        /* Any change due to component changes? */
        let mut redo = ComponentRedo::None;
        for t in &mut self.all_travellers_mut() {
            redo = redo | t.update_state(oom);
        }
        /* Any change due to availability? */
        if self.is_done() {
            if self.needs_rebuild {
                self.needs_rebuild = false;
                console!("redraw {:?}",self.leaf.get_short_spec());
                return ComponentRedo::Major;
            }
        }
        redo
    }
}

impl Drop for Carriage {
    fn drop(&mut self) {
        self.pm.remove_leaf(&self.leaf);
    }
}
