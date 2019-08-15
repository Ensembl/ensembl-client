use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use model::zmenu::ZMenuLeaf;
use model::driver::{ DriverTraveller, Printer, PrinterManager };
use model::supply::{ PurchaseOrder, Subassembly };
use model::train::Traveller;
use composit::Leaf;

use super::UnpackedSubassembly;

#[derive(Clone,Debug)]
pub struct UnpackedProduct{
    data: HashMap<Subassembly,Rc<RefCell<UnpackedSubassembly>>>
}

impl UnpackedProduct{
    pub fn new() -> UnpackedProduct{
        UnpackedProduct{
            data: HashMap::new()
        }
    }

    pub fn add_subassembly(&mut self, sa: &Subassembly, trd: UnpackedSubassembly) {
        self.data.insert(sa.clone(),Rc::new(RefCell::new(trd)));
    }
    
    pub fn update_data<F>(&mut self, sa: &Subassembly, cb: F) where F: FnOnce(&mut UnpackedSubassembly) {
        if let Some(ref mut ic) = self.data.get_mut(sa) {
            cb(&mut ic.borrow_mut());
        }
    }
    
    pub fn get_contents(&self, sa: &Subassembly) -> Option<&Rc<RefCell<UnpackedSubassembly>>> {
        self.data.get(sa)
    }
}
