use std::collections::HashMap;
use std::collections::hash_map::Entry;

use model::driver::PrinterManager;
use model::supply::{ PendingOrder, Product, PurchaseOrder };
use super::Traveller;

use composit::Leaf;

pub struct TravellerCreator {
    pm: PrinterManager,
    components: HashMap<String,Product>
}

impl TravellerCreator {
    pub fn new(pm: &PrinterManager) -> TravellerCreator {
        TravellerCreator {
            pm: pm.clone(),
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
    
    pub fn make_travellers_for_source(&mut self, product: &mut Product, leaf: &Leaf, focus: &Option<String>) -> Vec<Traveller> {
        let mut tt = Vec::<Traveller>::new();
        for sa in product.list_subassemblies() {            
            tt.push(Traveller::new(sa,&leaf));
        }
        let po = PurchaseOrder::new(product,leaf,focus);
        let pending_order = PendingOrder::new(&mut self.pm,po.clone(),&mut tt);
        product.get_supplier().supply(pending_order);
        tt
    }
    
    pub fn make_travellers_for_leaf(&mut self, leaf: &Leaf, focus: &Option<String>) -> Vec<Traveller> {
        let mut lcomps = Vec::<Traveller>::new();
        let mut comps : Vec<Product> = self.components.values().cloned().collect();
        for c in &mut comps {
            lcomps.append(&mut self.make_travellers_for_source(c,leaf,focus));
        }
        lcomps
    }    
}
