use composit::{ Leaf, ActiveSource };
use composit::source::{ PurchaseOrder, SourceResponse };

pub trait Source {
    fn request_data(&self, acs: &ActiveSource, lc: SourceResponse, po: &PurchaseOrder);
}
