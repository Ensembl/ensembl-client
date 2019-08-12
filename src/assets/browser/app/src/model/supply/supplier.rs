use super::PendingOrder;

pub trait Supplier {
    fn supply(&self, lc: PendingOrder);
    fn get_lid(&self) -> usize;
}
