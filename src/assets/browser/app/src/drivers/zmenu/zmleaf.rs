use composit::Leaf;

pub struct ZMenuLeaf {
    leaf: Leaf,
    redrawn: bool
}

impl ZMenuLeaf {
    fn new(leaf: &Leaf) -> ZMenuLeaf {
        ZMenuLeaf { leaf: leaf.clone(), redrawn: false }
    }
    
    pub fn redrawn(&mut self) {
        self.redrawn = true;
    }
    
    pub(in super) fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub(in super) fn was_redrawn(&self) -> bool { self.redrawn }
}

pub struct ZMenuLeafSet {
    zml: Vec<ZMenuLeaf>
}

impl ZMenuLeafSet {
    pub fn new() -> ZMenuLeafSet {
        ZMenuLeafSet { zml: Vec::new() }
    }
 
    pub fn make_leaf(&mut self, leaf: &Leaf) -> ZMenuLeaf {
        ZMenuLeaf::new(leaf)
    }
    
    pub fn register_leaf(&mut self, zml: ZMenuLeaf) {
        self.zml.push(zml);
    }
    
    pub(in super) fn take_leafs(&mut self) -> Vec<ZMenuLeaf> {
        self.zml.drain(..).collect()
    }
}
