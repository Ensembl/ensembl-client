#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct Leaf {
    svc_num: i32
}

impl Leaf {
    pub fn new(svc_num: i32) -> Leaf {
        Leaf { svc_num }
    }
    
    pub fn get_offset(&self) -> f32 {
        self.svc_num as f32 * 150.
    }
}
