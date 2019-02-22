use composit::{ Leaf, SourceResponse, ActiveSource };

pub trait Source {
    fn populate(&self, acs: &ActiveSource, lc: &mut SourceResponse, leaf: &Leaf);
}
