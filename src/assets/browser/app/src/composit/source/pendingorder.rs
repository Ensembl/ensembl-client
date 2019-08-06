use std::collections::HashMap;

use model::zmenu::ZMenuLeaf;
use model::driver::{ Printer, PrinterManager };
use model::train::{ Traveller, TravellerResponse, TravellerResponseData };
use composit::Leaf;

use super::PurchaseOrder;

pub struct PendingOrder {
    purchase_order: PurchaseOrder,
    travellers: HashMap<Option<String>,Traveller>
}

impl PendingOrder {
    pub fn new(pm: &mut PrinterManager, po: PurchaseOrder, tt: &mut Vec<Traveller>) -> PendingOrder {
        let mut travs = HashMap::new();
        for t in tt.iter() {
            travs.insert(t.get_part().clone(),t.clone());
        }
        let mut out = PendingOrder {
            purchase_order: po.clone(),
            travellers: travs,
        };
        for t in tt {
            t.set_visuals(pm.make_traveller_response(&po));
        }
        out
    }
    
    pub fn get_traveller(&mut self, part: &Option<String>) -> &mut Traveller {
        unwrap!(self.travellers.get_mut(part))
    }
            
    pub fn done(&mut self) {
        for (_,t) in &mut self.travellers {
            t.set_response();
        }
    }
}
