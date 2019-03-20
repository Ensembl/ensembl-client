use std::collections::HashMap;
use composit::{ Leaf, ActiveSource };
use super::Traveller;

#[derive(Debug)]
pub struct Carriage {
    travellers: HashMap<(ActiveSource,Option<String>),Traveller>,
    needs_rebuild: bool
}

impl Carriage {
    pub(in super) fn new() -> Carriage {
        Carriage {
            travellers: HashMap::<(ActiveSource,Option<String>),Traveller>::new(),
            needs_rebuild: false
        }
    }
    
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
        
    pub(in super) fn all_travellers(&self) -> Vec<&Traveller> {
        self.travellers.values().collect()
    }

    pub(in super) fn all_travellers_mut(&mut self) -> Vec<&mut Traveller> {
        self.travellers.values_mut().collect()
    }
    
    pub(in super) fn is_done(&mut self) -> bool {
        for c in self.travellers.values() {
            if !c.is_done() { return false; }
        }
        return true;
    }
}
