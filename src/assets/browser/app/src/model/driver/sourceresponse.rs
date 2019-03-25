use composit::{ Leaf, StateValue, SourceResponseData };

pub trait SourceResponse {
    fn check(&self) -> bool;
    fn set_state(&mut self, state: StateValue);
    fn set(&mut self, result: SourceResponseData);
    fn source_response_clone(&self) -> Box<SourceResponse>;
    fn destroy(&mut self);
}
