use std::collections::HashMap;

use model::zmenu::ZMenuLeaf;
use model::driver::{ Printer, PrinterManager };
use model::train::{ Traveller, TravellerResponse, TravellerResponseData };
use composit::Leaf;

use super::{ PurchaseOrder, Subassembly };

pub struct PendingOrder {
    purchase_order: PurchaseOrder,
    travellers: HashMap<Subassembly,Traveller>
}

impl PendingOrder {
    pub fn new(pm: &mut PrinterManager, po: PurchaseOrder, tt: &mut Vec<Traveller>) -> PendingOrder {
        let mut travs = HashMap::new();
        for t in tt.iter() {
            travs.insert(t.get_subassembly().clone(),t.clone());
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
    
    pub fn get_purchase_order(&self) -> &PurchaseOrder { &self.purchase_order }

    pub fn get_purchaser(&mut self, part: &Option<String>) -> &mut Traveller {
        let sa = Subassembly::new_matching(self.purchase_order.get_product(),part);
        unwrap!(self.travellers.get_mut(&sa))
    }
            
    pub fn done(&mut self) {
        for (_,t) in &mut self.travellers {
            t.set_response();
        }
    }
}
