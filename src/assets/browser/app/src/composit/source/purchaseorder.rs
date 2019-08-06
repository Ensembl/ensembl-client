use composit::Leaf;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct PurchaseOrder {
    leaf: Leaf,
    focus: Option<String>
}

impl PurchaseOrder {
    pub fn new(leaf: &Leaf, focus: &Option<String>) -> PurchaseOrder {
        PurchaseOrder {
            leaf: leaf.clone(),
            focus: focus.as_ref().map(|v| v.clone())
        }
    }

    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}