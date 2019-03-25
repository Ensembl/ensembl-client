use composit::{ Leaf, StateValue };

pub trait SourceResponse {
    fn check(&self) -> bool;
    fn set_state(&mut self, state: StateValue);
    fn destroy(&mut self);
}
