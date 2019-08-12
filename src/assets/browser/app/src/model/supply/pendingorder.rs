use std::collections::HashMap;

use model::zmenu::ZMenuLeaf;
use model::driver::{ Printer, PrinterManager };
use model::train::{ Traveller, TravellerResponse, TravellerResponseData };
use composit::Leaf;

use super::{ PurchaseOrder, Subassembly };

#[derive(Clone)]
pub struct PendingOrder {
    purchase_order: PurchaseOrder,
    travellers: HashMap<Subassembly,Traveller>
}

impl PendingOrder {
    pub fn new(po: &PurchaseOrder) -> PendingOrder {
        PendingOrder {
            purchase_order: po.clone(),
            travellers: HashMap::new(),
        }
    }

    pub fn add_traveller(&mut self, pm: &mut PrinterManager, traveller: &mut Traveller) {
        self.travellers.insert(traveller.get_subassembly().clone(),traveller.clone());
        traveller.set_visuals(pm.make_traveller_response(&self.purchase_order));
    }
    
    pub fn get_travellers(&mut self) -> impl Iterator<Item=&Traveller> {
        self.travellers.values()
    }
    pub fn get_purchase_order(&self) -> &PurchaseOrder { &self.purchase_order }

    pub fn get_traveller(&mut self, part: &Option<String>) -> &mut Traveller {
        let sa = Subassembly::new_matching(self.purchase_order.get_product(),part);
        unwrap!(self.travellers.get_mut(&sa))
    }
            
    pub fn done(&mut self) {
        for (_,t) in &mut self.travellers {
            t.set_response();
        }
    }
}
