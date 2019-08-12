use std::collections::HashMap;

use super::{ Supplier, PendingOrder, RequestedRegion };

pub struct SupplierChooser {
    backend_source: Box<Supplier>,
    per_stick_sources: HashMap<String,Box<Supplier>>,
}

impl SupplierChooser {
    pub fn new(backend_source: Box<Supplier>) -> SupplierChooser {
        SupplierChooser {
            backend_source,
            per_stick_sources: HashMap::<String,Box<Supplier>>::new()
        }
    }
    
    pub fn add_per_stick(&mut self, name: &str, source: Box<Supplier>) {
        let name = name.to_string();
        self.per_stick_sources.insert(name.clone(),source);
    }
}

impl Supplier for SupplierChooser {
    fn supply(&self, lc: PendingOrder) {
        if let RequestedRegion::Leaf(leaf) = lc.get_purchase_order().get_region() {
            let stick_name = leaf.get_stick().get_name();
            if let Some(source) = self.per_stick_sources.get(&stick_name) {
                source.supply(lc);
                return;
            }
        }
        self.backend_source.supply(lc);
    }

    fn get_lid(&self) -> usize {
        self.backend_source.get_lid()
    }
}
