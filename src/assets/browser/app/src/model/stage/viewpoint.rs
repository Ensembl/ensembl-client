use composit::Stick;
use model::focus::FocusObjectId;
use types::Dot;

use super::Position;

#[derive(Clone,PartialEq)]
pub struct Viewpoint {
    position: Position,
    focus_object: FocusObjectId
}

impl Viewpoint {
    pub fn new(position: &Position, focus_object: &FocusObjectId) -> Viewpoint {
        Viewpoint {
            position: position.clone(),
            focus_object: focus_object.clone()
        }
    }

    pub fn get_position(&self) -> &Position { &self.position }
    pub fn get_focus_object_id(&self) -> &FocusObjectId { &self.focus_object }

    pub fn as_fragment(&self) -> ViewpointFragment {
        ViewpointFragment {
            position: Some(self.position.clone()),
            focus_object: Some(self.focus_object.clone())
        }
    }
}

pub struct ViewpointFragment {
    position: Option<Position>,
    focus_object: Option<FocusObjectId>
}

impl ViewpointFragment {
    pub fn new_empty() -> ViewpointFragment {
        ViewpointFragment {
            position: None,
            focus_object: None
        }
    }

    pub fn new_position(position: &Position) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.position = Some(position.clone());
        out
    }

    pub fn new_focus_object(focus: &FocusObjectId) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.focus_object = Some(focus.clone());
        out

    }

    fn merge_one(&mut self, other: &ViewpointFragment) {
        if other.position.is_some() { self.position = other.position.clone(); }
        if other.focus_object.is_some() { self.focus_object = other.focus_object.clone(); }
    }

    pub fn merge(&self, other: &ViewpointFragment) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.merge_one(self);
        out.merge_one(other);
        out
    }

    pub fn get_viewpoint(&self) -> Option<Viewpoint> {
        let focus_object = match &self.focus_object {
            Some(focus) => focus.clone(),
            None => FocusObjectId::new(&None)
        };
        if let Some(ref position) = self.position {
            Some(Viewpoint::new(position,&focus_object))
        } else {
            None
        }
    }
}
