use std::rc::Rc;
use tánaiste::Value;

use data::BackendBytecode;
use model::supply::{ DeliveredItem, PurchaseOrder };

pub trait XferConsumer {
    fn consume(&mut self, item: &DeliveredItem);
}

pub trait XferClerk {
    fn satisfy(&mut self, po: &PurchaseOrder, prime: bool, consumer: Box<XferConsumer>);
}
