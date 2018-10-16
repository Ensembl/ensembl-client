use composit::{ Leaf, LeafComponent };
use shape::{ ShapeSpec };

pub trait Source {
    fn populate(&self, lc: &mut LeafComponent, leaf: &Leaf);
}
