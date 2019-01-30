use composit::{ Leaf, SourceResponse };

pub trait Source {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf);
}
