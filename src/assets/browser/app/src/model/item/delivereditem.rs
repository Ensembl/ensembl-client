use std::rc::Rc;

use data::BackendBytecode;
use tánaiste::Value;

use super::DeliveredItemId;

#[derive(Clone,Debug)]
pub struct DeliveredItem {
    bytecode: Rc<BackendBytecode>,
    id: DeliveredItemId,
    values: Vec<Value>
}

impl DeliveredItem {
    pub fn new(id: &DeliveredItemId, bytecode: Rc<BackendBytecode>, values: Vec<Value>) -> DeliveredItem {
        DeliveredItem {
            bytecode: bytecode.clone(),
            id: id.clone(),
            values
        }
    }

    pub fn get_id(&self) -> &DeliveredItemId { &self.id }
    pub fn get_bytecode(&self) -> &Rc<BackendBytecode> { &self.bytecode }
    pub fn get_data(&self) -> &Vec<Value> { &self.values }
}
