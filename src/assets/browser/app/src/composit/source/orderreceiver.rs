use composit::{ Leaf, ActiveSource };
use composit::source::{ PurchaseOrder, PendingOrder };

pub trait OrderReceiver {
    fn receive_order(&self, acs: &ActiveSource, lc: PendingOrder);
}
