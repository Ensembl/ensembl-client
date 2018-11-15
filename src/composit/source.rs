use composit::{ Leaf, LCBuilder };

pub trait Source {
    fn populate(&self, lc: &mut LCBuilder, leaf: &Leaf);
}
