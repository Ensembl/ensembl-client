use composit::{ Stick, Scale };

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct TrainId {
    stick: Stick,
    scale: Scale,
    focus: Option<String>
}

impl TrainId {
    pub fn new(stick: &Stick, scale: &Scale, focus: &Option<String>) -> TrainId {
        TrainId {
            stick: stick.clone(),
            scale: scale.clone(),
            focus: focus.clone()
        }
    }

    pub fn get_stick(&self) -> &Stick { &self.stick }
    pub fn get_focus(&self) -> &Option<String> { &self.focus }
    pub fn get_scale(&self) -> &Scale { &self.scale }
}
