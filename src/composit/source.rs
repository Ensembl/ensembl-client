use composit::{ Leaf, LeafComponent };

pub trait Source {
    fn populate(&self, lc: &mut LeafComponent, leaf: &Leaf);
}
