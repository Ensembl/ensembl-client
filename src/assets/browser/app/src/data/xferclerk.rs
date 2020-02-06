use model::item::{ DeliveredItem, ItemUnpacker };
use model::supply::PurchaseOrder;

pub trait XferConsumer {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker);
}

pub trait XferClerk {
    fn satisfy(&mut self, po: &PurchaseOrder, prime: bool, consumer: Box<dyn XferConsumer>);
}
