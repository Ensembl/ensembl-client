use composit::{ Leaf, AllSourceResponseBuilder, ActiveSource };

pub trait Source {
    fn populate(&self, acs: &ActiveSource, lc: AllSourceResponseBuilder, leaf: &Leaf);
}
