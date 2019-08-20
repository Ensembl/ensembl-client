use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::hash_map::Entry;
use std::rc::Rc;

use composit::AllLandscapes;
use controller::global::WindowState;
use model::driver::PrinterManager;
use model::item::{ UnpackedSubassembly, UnpackedProduct};
use model::supply::{ Product, PurchaseOrder };
use super::{ CarriageId, Traveller };

use composit::Leaf;

#[derive(Clone)]
pub struct TravellerCreator {
    pm: PrinterManager,
    components: Rc<RefCell<HashMap<String,Product>>>
}

impl TravellerCreator {
    pub fn new(pm: &PrinterManager) -> TravellerCreator {
        TravellerCreator {
            pm: pm.clone(),
            components: Rc::new(RefCell::new(HashMap::<String,Product>::new()))
        }
    }
    
    pub fn add_source(&mut self, c: Product) {
        let name = c.get_product_name().to_string();
        if let Entry::Vacant(e) = self.components.borrow_mut().entry(name) {
            e.insert(c);
        }
    }

    pub fn remove_source(&mut self, k: &str) {
        self.components.borrow_mut().remove(k);
    }
    
    pub fn make_travellers_for_source(&mut self, product: &mut Product, leaf: &Leaf, carriage_id: &CarriageId) -> Vec<Traveller> {
        let focus = carriage_id.get_train_id().get_context().get_focus();
        let po = PurchaseOrder::new(product,leaf,focus);
        let mut travellers = Vec::new();
        for sa in product.list_subassemblies() {
            let trd = UnpackedSubassembly::new(leaf);
            let mut traveller = Traveller::new(&mut self.pm,sa,&leaf,carriage_id);
            travellers.push(traveller.clone());
        }
        product.get_supplier().supply(po);
        travellers
    }
    
    pub fn make_travellers_for_leaf(&mut self, leaf: &Leaf, carriage_id: &CarriageId) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        let mut comps : Vec<Product> = self.components.borrow_mut().values().cloned().collect();
        for c in &mut comps {
            lcomps.append(&mut self.make_travellers_for_source(c,leaf,carriage_id));
        }
        lcomps
    }    
}
