use std::collections::HashMap;
use std::collections::hash_map::Entry;

use model::driver::PrinterManager;
use composit::source::{ SourceResponse, PurchaseOrder };
use super::Traveller;

use composit::{
    ActiveSource, Leaf
};

pub struct TravellerCreator {
    pm: PrinterManager,
    components: HashMap<String,ActiveSource>
}

impl TravellerCreator {
    pub fn new(pm: &PrinterManager) -> TravellerCreator {
        TravellerCreator {
            pm: pm.clone(),
            components: HashMap::<String,ActiveSource>::new()
        }
    }
       
    pub fn add_source(&mut self, c: ActiveSource) {
        let name = c.get_name().to_string();
        if let Entry::Vacant(e) = self.components.entry(name) {
            e.insert(c);
        }
    }

    pub fn remove_source(&mut self, k: &str) {
        self.components.remove(k);
    }
    
    pub fn make_travellers_for_source(&mut self, acs: &mut ActiveSource, leaf: &Leaf, focus: &Option<String>) -> Vec<Traveller> {
        let mut tt = acs.make_travellers(leaf);
        let po = PurchaseOrder::new(acs.get_name(),leaf,focus);
        let source_response = SourceResponse::new(&mut self.pm,po.clone(),&mut tt);
        acs.request_data(source_response,&po);
        tt
    }
    
    pub fn make_travellers_for_leaf(&mut self, leaf: &Leaf, focus: &Option<String>) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        let mut comps : Vec<ActiveSource> = self.components.values().cloned().collect();
        for c in &mut comps {
            lcomps.append(&mut self.make_travellers_for_source(c,leaf,focus));
        }
        lcomps
    }    
}
