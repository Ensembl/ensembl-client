use composit::{ Leaf, Stage };

use types::{ Placement, Dot };

struct ZMenuItem {
    placement: Placement,
    id: String
}

pub struct ZMenuLeaf {
    items: Vec<ZMenuItem>,
    leaf: Leaf,
    redrawn: bool
}

impl ZMenuLeaf {
    pub fn new(leaf: &Leaf) -> ZMenuLeaf {
        ZMenuLeaf {
            items: Vec::new(),
            leaf: leaf.clone(), 
            redrawn: false
        }
    }
    
    pub fn redrawn(&mut self) {
        self.redrawn = true;
    }
    
    pub fn merge(&mut self, other: &mut ZMenuLeaf) {
        self.redrawn |= other.redrawn;
        self.items.append(&mut other.items);
    }
    
    fn fix_leaf_offset(&self, zbox: &Placement) -> Placement {
        self.leaf.fix_placement(zbox)
    }
    
    pub fn add_box(&mut self, id: &str, zbox: &Placement) {
        bb_log!("zmenu","add_box({:?},{:?})",id,zbox);
        self.items.push(ZMenuItem { id: id.to_string(), placement: self.fix_leaf_offset(zbox) });
    }
    
    pub(in super) fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub(in super) fn was_redrawn(&self) -> bool { self.redrawn }
    
    pub(in super) fn intersects(&self, stage: &Stage, pos: Dot<i32,i32>) {
        for item in &self.items {
            bb_log!("zmenu","zml: item pos={:?} placement={:?}",pos,&item.placement);
            if stage.intersects(pos,&item.placement) {
                console!("intersects {:?}",item.id);
            }
        }
    }
}

pub struct ZMenuLeafSet {
    zml: Vec<ZMenuLeaf>
}

impl ZMenuLeafSet {
    pub fn new() -> ZMenuLeafSet {
        ZMenuLeafSet { zml: Vec::new() }
    }
     
    pub fn register_leaf(&mut self, zml: ZMenuLeaf) {
        self.zml.push(zml);
    }
    
    pub(in super) fn take_leafs(&mut self) -> Vec<ZMenuLeaf> {
        self.zml.drain(..).collect()
    }
}
