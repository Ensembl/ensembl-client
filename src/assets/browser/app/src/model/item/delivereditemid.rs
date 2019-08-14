use composit::Leaf;
use model::supply::Product;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct DeliveredItemId {
    product: Product,
    leaf: Leaf,
    focus: Option<String>
}

impl DeliveredItemId {
    pub fn new(product: &Product, leaf: &Leaf, focus: &Option<String>) -> DeliveredItemId {
        DeliveredItemId {
            product: product.clone(),
            leaf: leaf.clone(),
            focus: focus.clone()
        }
    }

    pub fn get_product(&self) -> &Product { &self.product }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}