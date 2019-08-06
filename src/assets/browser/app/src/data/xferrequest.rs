use composit::Leaf;
use composit::source::PurchaseOrder;
// XXX no clone!
#[derive(Clone,Debug)]
pub struct XferRequest {
    po: PurchaseOrder,
    prime: bool
}

impl XferRequest {
    pub fn new(po: &PurchaseOrder, prime: bool) -> XferRequest {
        XferRequest {
            po: po.clone(),
            prime
        }
    }
    
    pub fn get_prime(&self) -> bool { self.prime }
    pub fn get_purchase_order(&self) -> &PurchaseOrder { &self.po }
}
