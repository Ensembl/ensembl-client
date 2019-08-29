use composit::{ Stick, Scale };

use super::TrainContext;

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct TrainId {
    stick: Stick,
    scale: Scale,
    context: TrainContext
}

impl TrainId {
    pub fn new(stick: &Stick, scale: &Scale, context: &TrainContext) -> TrainId {
        TrainId {
            stick: stick.clone(),
            scale: scale.clone(),
            context: context.clone()
        }
    }

    pub fn get_stick(&self) -> &Stick { &self.stick }
    pub fn get_context(&self) -> &TrainContext { &self.context }
    pub fn get_scale(&self) -> &Scale { &self.scale }
}
