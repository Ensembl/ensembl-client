use std::rc::Rc;

use composit::Leaf;
use data::BackendBytecode;
use super::{ Product, PurchaseOrder, RequestedRegion };
use tánaiste::Value;

#[derive(Clone,Debug)]
pub struct DeliveredItem {
    bytecode: Rc<BackendBytecode>,
    product: Product,
    leaf: Leaf,
    focus: Option<String>,
    values: Vec<Value>
}

impl DeliveredItem {
    pub fn new(bytecode: Rc<BackendBytecode>, product: &Product, leaf: &Leaf, focus: &Option<String>, values: Vec<Value>) -> DeliveredItem {
        DeliveredItem {
            bytecode: bytecode.clone(),
            product: product.clone(),
            leaf: leaf.clone(),
            focus: focus.clone(),
            values
        }
    }

    pub fn get_product(&self) -> &Product { &self.product }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
    pub fn get_bytecode(&self) -> &Rc<BackendBytecode> { &self.bytecode }
    pub fn get_data(&self) -> &Vec<Value> { &self.values }

    /* XXX temporary */
    pub fn xxx_purchase_order(&self) -> PurchaseOrder {
        PurchaseOrder::new(&self.product,&RequestedRegion::Leaf(self.leaf.clone()),&self.focus)
    }
}