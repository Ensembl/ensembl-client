use composit::Leaf;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct PurchaseOrder {
    source: String,
    leaf: Leaf,
    focus: Option<String>
}

impl PurchaseOrder {
    pub fn new(source: &str, leaf: &Leaf, focus: &Option<String>) -> PurchaseOrder {
        PurchaseOrder {
            source: source.to_string(),
            leaf: leaf.clone(),
            focus: focus.as_ref().map(|v| v.clone())
        }
    }

    pub fn get_source_name(&self) -> &str { &self.source }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}