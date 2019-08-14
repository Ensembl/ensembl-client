use std::collections::HashMap;
use std::collections::hash_map::Entry;

use composit::AllLandscapes;
use controller::global::WindowState;
use model::driver::PrinterManager;
use model::item::{ UnpackedSubassembly, UnpackedProduct};
use model::supply::{ Product, PurchaseOrder, RequestedRegion };
use super::{ CarriageId, Traveller };

use composit::Leaf;

pub struct TravellerCreator {
    pm: PrinterManager,
    window: WindowState,
    components: HashMap<String,Product>
}

impl TravellerCreator {
    pub fn new(pm: &PrinterManager, window: &WindowState) -> TravellerCreator {
        TravellerCreator {
            pm: pm.clone(),
            window: window.clone(),
            components: HashMap::<String,Product>::new()
        }
    }
    
    pub fn add_source(&mut self, c: Product) {
        let name = c.get_product_name().to_string();
        if let Entry::Vacant(e) = self.components.entry(name) {
            e.insert(c);
        }
    }

    pub fn remove_source(&mut self, k: &str) {
        self.components.remove(k);
    }
    
    pub fn make_travellers_for_source(&mut self, product: &mut Product, leaf: &Leaf, focus: &Option<String>,carriage_id: &CarriageId) -> Vec<Traveller> {
        let po = PurchaseOrder::new(product,&RequestedRegion::Leaf(leaf.clone()),focus);
        let mut travellers = Vec::new();
        for sa in product.list_subassemblies() {
            let trd = UnpackedSubassembly::new(leaf);
            let mut traveller = Traveller::new(&mut self.pm,&self.window,sa,&leaf,carriage_id);
            travellers.push(traveller.clone());
        }
        product.get_supplier().supply(po);
        travellers
    }
    
    pub fn make_travellers_for_leaf(&mut self, leaf: &Leaf, focus: &Option<String>, carriage_id: &CarriageId) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        let mut comps : Vec<Product> = self.components.values().cloned().collect();
        for c in &mut comps {
            lcomps.append(&mut self.make_travellers_for_source(c,leaf,focus,carriage_id));
        }
        lcomps
    }    
}
