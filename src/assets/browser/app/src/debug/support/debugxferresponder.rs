use composit::Leaf;
use data::{ XferRequest, XferResponse };
use super::DebugSourceType;

pub trait DebugXferResponder {
    fn respond(&self, request: XferRequest, type_: DebugSourceType, leaf: &Leaf) -> XferResponse;
}
