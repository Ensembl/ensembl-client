use composit::Leaf;
use super::Product;
use model::item::DeliveredItemId;

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub enum RequestedRegion {
    Leaf(Leaf),
    //Focus
}

#[derive(Clone,Debug,PartialEq,Eq,Hash)]
pub struct PurchaseOrder {
    product: Product,
    region: RequestedRegion,
    focus: Option<String>
}

impl PurchaseOrder {
    pub fn new(product: &Product, region: &RequestedRegion, mut focus: &Option<String>) -> PurchaseOrder {
        /* XXX */
        if product.get_product_name() == "gene-feat" {
            focus = &None;
        }
        PurchaseOrder {
            product: product.clone(),
            region: region.clone(),
            focus: focus.as_ref().map(|v| v.clone())
        }
    }

    pub fn get_product(&self) -> &Product { &self.product }
    pub fn get_region(&self) -> &RequestedRegion { &self.region }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }

    pub fn xxx_make_delivered_item_id(&self) -> DeliveredItemId {
        match &self.region {
            RequestedRegion::Leaf(leaf) => DeliveredItemId::new(&self.product,&leaf,&self.focus)
        }
    }
}