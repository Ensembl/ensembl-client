use composit::Leaf;
use model::supply::Product;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub enum FocusSpecificity {
    Specific(Option<String>),
    Agnostic
}

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct DeliveredItemId {
    product: Product,
    leaf: Leaf,
    focus: FocusSpecificity
}

impl DeliveredItemId {
    pub fn new(product: &Product, leaf: &Leaf, focus: &FocusSpecificity) -> DeliveredItemId {
        DeliveredItemId {
            product: product.clone(),
            leaf: leaf.clone(),
            focus: focus.clone()
        }
    }

    pub fn get_product(&self) -> &Product { &self.product }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus_specificity(&self) -> &FocusSpecificity { &self.focus }
}