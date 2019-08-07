use std::rc::Rc;
use tánaiste::Value;

use data::BackendBytecode;
use model::supply::PurchaseOrder;

pub trait XferConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, data: Vec<Value>);
    fn abandon(&mut self);
}

pub trait XferClerk {
    fn satisfy(&mut self, po: &PurchaseOrder, prime: bool, consumer: Box<XferConsumer>);
}
