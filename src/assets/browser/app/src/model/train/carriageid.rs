use composit::Leaf;
use super::TrainId;

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct CarriageId {
    leaf: Leaf,
    train_id: TrainId
}

impl CarriageId {
    pub fn new(leaf: &Leaf, train_id: &TrainId) -> CarriageId {
        CarriageId {
            leaf: leaf.clone(),
            train_id: train_id.clone()
        }
    }

    pub fn get_train_id(&self) -> &TrainId { &self.train_id }
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
}