use composit::Leaf;
use super::Product;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct PurchaseOrder {
    product: Product,
    leaf: Leaf,
    focus: Option<String>
}

impl PurchaseOrder {
    pub fn new(product: &Product, leaf: &Leaf, focus: &Option<String>) -> PurchaseOrder {
        PurchaseOrder {
            product: product.clone(),
            leaf: leaf.clone(),
            focus: focus.as_ref().map(|v| v.clone())
        }
    }

    pub fn get_product(&self) -> &Product { &self.product }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}