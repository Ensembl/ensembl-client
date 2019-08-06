use std::collections::HashMap;

use model::zmenu::ZMenuLeaf;
use model::driver::{ Printer, PrinterManager };
use model::train::{ Traveller, TravellerResponse, TravellerResponseData };
use composit::Leaf;

use super::PurchaseOrder;

pub struct SourceResponse {
    purchase_order: PurchaseOrder,
    travellers: HashMap<Option<String>,Traveller>
}

impl SourceResponse {
    pub fn new(pm: &mut PrinterManager, po: PurchaseOrder, tt: &mut Vec<Traveller>) -> SourceResponse {
        let mut travs = HashMap::new();
        for t in tt.iter() {
            travs.insert(t.get_part().clone(),t.clone());
        }
        let mut out = SourceResponse {
            purchase_order: po.clone(),
            travellers: travs,
        };
        for t in tt {
            t.set_visuals(pm.make_traveller_response(&po));
        }
        out
    }
    
    pub fn update_zml<F>(&mut self, part: &Option<String>, cb: F) where F: FnOnce(&mut ZMenuLeaf) {
        self.travellers.get_mut(part).unwrap().update_zml(cb);
    }
    
    pub fn update_data<F>(&mut self,  part: &Option<String>, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        unwrap!(self.travellers.get_mut(part)).update_data(cb);
    }
        
    pub fn done(&mut self) {
        for (_,t) in &mut self.travellers {
            t.set_response();
        }
    }
}
