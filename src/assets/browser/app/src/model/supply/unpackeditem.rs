use std::collections::HashMap;

use model::zmenu::ZMenuLeaf;
use model::driver::{ DriverTraveller, Printer, PrinterManager };
use model::train::Traveller;
use composit::Leaf;

use super::{ ItemContents, PurchaseOrder, Subassembly };

#[derive(Clone)]
pub struct UnpackedItem {
    travellers: HashMap<Subassembly,Traveller>,
    data: HashMap<Subassembly,ItemContents>
}

impl UnpackedItem {
    pub fn new() -> UnpackedItem {
        UnpackedItem {
            travellers: HashMap::new(),
            data: HashMap::new()
        }
    }

    pub fn add_traveller(&mut self, traveller: &mut Traveller, trd: ItemContents) {
        let sa = traveller.get_id().get_subassembly().clone();
        self.travellers.insert(sa.clone(),traveller.clone());
        self.data.insert(sa.clone(),trd);
    }
    
    pub fn update_data<F>(&mut self, sa: &Subassembly, cb: F) where F: FnOnce(&mut ItemContents) {
        cb(unwrap!(self.data.get_mut(sa)));
    }
    
    pub fn get_contents(&self, sa: &Subassembly) -> Option<&ItemContents> {
        self.data.get(sa)
    }

    pub fn done(&mut self) {
        for kv in self.travellers.iter_mut() {
            if let Some(data) = self.data.get(kv.0) {
                kv.1.set_contents(data.clone());
            }
        }
    }
}
