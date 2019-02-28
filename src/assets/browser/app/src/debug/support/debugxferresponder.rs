use composit::Leaf;
use data::{ XferRequest, XferResponse };

pub trait DebugXferResponder {
    fn respond(&self, request: XferRequest, name: &str, leaf: &Leaf) -> XferResponse;
}
