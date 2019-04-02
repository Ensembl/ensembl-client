use std::rc::Rc;
use tánaiste::Value;

use data::{ XferRequest, BackendBytecode };

pub trait XferConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, data: Vec<Value>);
    fn abandon(&mut self);
}

pub trait XferClerk {
    fn satisfy(&mut self, request: XferRequest, consumer: Box<XferConsumer>);
}
