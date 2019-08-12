use super::{ PurchaseOrder };
use tánaiste::Value;

#[derive(Clone)]
pub struct DeliveredItem {
    codename: String,
    purchase_order: PurchaseOrder,
    values: Vec<Value>
}

impl DeliveredItem {
    pub fn new(codename: &str, purchase_order: &PurchaseOrder, values: Vec<Value>) -> DeliveredItem {
        DeliveredItem {
            codename: codename.to_string(),
            purchase_order: purchase_order.clone(),
            values
        }
    }

    pub fn get_purchase_order(&self) -> &PurchaseOrder { &self.purchase_order }
    pub fn get_bytecode_name(&self) -> &str { &self.codename }
    pub fn get_data(&self) -> &Vec<Value> { &self.values }
}