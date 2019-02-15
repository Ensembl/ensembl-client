use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use tánaiste::Value;

use data::{ XferClerk, XferConsumer, XferRequest, XferResponse };
use super::{ DebugSourceType, DebugXferResponder, FakeData };

#[derive(Clone)]
pub struct DebugXferClerk {
    fakedata: Rc<FakeData>,
}

impl DebugXferClerk {
    pub fn new() -> DebugXferClerk {
        let fd = FakeData::new();
        DebugXferClerk {
            fakedata: Rc::new(fd),
        }
    }
}

impl XferClerk for DebugXferClerk {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        let type_ = DebugSourceType::from_name(request.get_source_name()).unwrap();
        let leaf = request.get_leaf().clone();
        // XXX errors
        if let Some(res) = self.fakedata.satisfy(request) {
            consumer.consume(res);
        }
    }
}
