use composit::{ Leaf, ActiveSource };
use model::train::PartyResponses;

pub trait Source {
    fn populate(&self, acs: &ActiveSource, lc: PartyResponses, leaf: &Leaf);
}
