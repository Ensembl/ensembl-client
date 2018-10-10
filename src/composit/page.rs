#[derive(Clone,PartialEq,Eq,Hash)]
pub struct Leaf {
    svc_num: i32
}

pub struct Page {
    leaves: Vec<Leaf>
}

impl Page {
    pub fn new() -> Page {
        Page {
            leaves: Vec::<Leaf>::new()
        }
    }
    
    pub fn add(&mut self, leaf: Leaf) {
        self.leaves.push(leaf);
    }
    
    pub fn remove(&mut self, leaf: &Leaf) {
        let index = self.leaves.iter().position(|x| x.svc_num == leaf.svc_num);
        if let Some(index) = index {
            self.leaves.remove(index);
        }
    }
}

impl Leaf {
    pub fn new(svc_num: i32) -> Leaf {
        Leaf { svc_num }
    }
}
