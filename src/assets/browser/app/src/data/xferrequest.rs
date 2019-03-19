use composit::Leaf;

// XXX no clone!
#[derive(Clone,Debug)]
pub struct XferRequest {
    source_name: String,
    leaf: Leaf,
    prime: bool
}

impl XferRequest {
    pub fn new(source_name: &str, leaf: &Leaf, prime: bool) -> XferRequest {
        XferRequest {
            source_name: source_name.to_string(),
            leaf: leaf.clone(),
            prime
        }
    }
    
    pub fn get_source_name(&self) -> &str { &self.source_name }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_prime(&self) -> bool { self.prime }
}
