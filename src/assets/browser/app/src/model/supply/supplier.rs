use super::PurchaseOrder;

pub trait Supplier {
    fn supply(&self, po: PurchaseOrder);
}
