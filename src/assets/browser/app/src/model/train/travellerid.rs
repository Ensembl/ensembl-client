use model::supply::Subassembly;
use super::CarriageId;

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct TravellerId {
    carriage_id: CarriageId,
    subassembly: Subassembly
}

impl TravellerId {
    pub fn new(carriage_id: &CarriageId, sa: &Subassembly) -> TravellerId {
        TravellerId {
            carriage_id: carriage_id.clone(),
            subassembly: sa.clone()
        }
    }

    pub fn get_carriage_id(&self) -> &CarriageId { &self.carriage_id }
    pub fn get_subassembly(&self) -> &Subassembly { &self.subassembly }
}