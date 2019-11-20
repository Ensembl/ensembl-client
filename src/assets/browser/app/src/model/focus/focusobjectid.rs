#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct FocusObjectId {
    focus: Option<String>
}

impl FocusObjectId {
    pub fn new(focus: &Option<String>) -> FocusObjectId {
        FocusObjectId {
            focus: focus.clone()
        }
    }

    pub fn get_focus(&self) -> &Option<String> { &self.focus }
}