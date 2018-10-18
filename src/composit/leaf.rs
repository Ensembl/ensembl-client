#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct Leaf {
    hindex: i32
}

impl Leaf {
    pub fn new(hindex: i32) -> Leaf {
        Leaf { hindex }
    }
    
    pub fn get_offset(&self) -> f64 {
        self.hindex as f64
    }
}
