use composit::{ Stick, Scale };

use super::FocusObjectId;

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct TrainId {
    stick: Stick,
    scale: Scale,
    focus_object_id: FocusObjectId
}

impl TrainId {
    pub fn new(stick: &Stick, scale: &Scale, focus_object_id: &FocusObjectId) -> TrainId {
        TrainId {
            stick: stick.clone(),
            scale: scale.clone(),
            focus_object_id: focus_object_id.clone()
        }
    }

    pub fn get_stick(&self) -> &Stick { &self.stick }
    pub fn get_focus_object_id(&self) -> &FocusObjectId { &self.focus_object_id }
    pub fn get_scale(&self) -> &Scale { &self.scale }
}
