use composit::{ Leaf, ActiveSource };
use composit::source::{ PurchaseOrder, PendingOrder };

pub trait Source {
    fn request_data(&self, acs: &ActiveSource, lc: PendingOrder, po: &PurchaseOrder);
}
