use super::{ PurchaseOrder, UnpackedItem };

pub trait Supplier {
    fn supply(&self, lc: UnpackedItem, po: PurchaseOrder);
    fn get_lid(&self) -> usize;
}
