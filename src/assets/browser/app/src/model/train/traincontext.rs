#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct TrainContext {
    focus: Option<String>
}

impl TrainContext {
    pub fn new(focus: &Option<String>) -> TrainContext {
        TrainContext {
            focus: focus.clone()
        }
    }

    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}