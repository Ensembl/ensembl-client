#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct Leaf {
    svc_num: i32
}

impl Leaf {
    pub fn new(svc_num: i32) -> Leaf {
        Leaf { svc_num }
    }
}
