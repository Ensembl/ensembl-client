use composit::Leaf;

// XXX no clone!
#[derive(Clone)]
pub struct XferRequest {
    source_name: String,
    leaf: Leaf
}

impl XferRequest {
    pub fn new(source_name: &str, leaf: &Leaf) -> XferRequest {
        XferRequest {
            source_name: source_name.to_string(),
            leaf: leaf.clone()
        }
    }
}
