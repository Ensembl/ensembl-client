use tánaiste::Value;

use data::{ XferRequest };

pub trait XferConsumer {
    fn consume(&mut self, code: String, data: Vec<Value>);
    fn abandon(&mut self);
}

pub trait XferClerk {
    fn satisfy(&mut self, request: XferRequest, consumer: Box<XferConsumer>);
}
