use crate::composit::Stick;
use crate::model::focus::FocusObjectId;
use crate::types::Dot;

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
            stick: Some(self.position.get_stick().clone()),
            middle: Some(self.position.get_x_pos().clone()),
            screen_in_bp: Some(self.position.get_screen_in_bp()),
            focus_object: Some(self.focus_object.clone())
        }
    }
}

#[derive(PartialEq)]
pub struct ViewpointFragment {
    stick: Option<Stick>,
    middle: Option<f64>,
    screen_in_bp: Option<f64>,
    focus_object: Option<FocusObjectId>
}

impl ViewpointFragment {
    pub fn new_empty() -> ViewpointFragment {
        ViewpointFragment {
            stick: None,
            middle: None,
            screen_in_bp: None,
            focus_object: None
        }
    }

    pub fn new_stick(stick: &Stick) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.stick = Some(stick.clone());
        out
    }

    pub fn new_middle(middle: f64) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.middle = Some(middle.clone());
        out
    }

    pub fn new_zoom(screen_in_bp: f64) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.screen_in_bp = Some(screen_in_bp);
        out

    }

    pub fn new_focus_object(focus: &FocusObjectId) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.focus_object = Some(focus.clone());
        out

    }

    fn merge_one(&mut self, other: &ViewpointFragment) {
        if other.stick.is_some() { self.stick = other.stick.clone(); }
        if other.middle.is_some() { self.middle = other.middle.clone(); }
        if other.screen_in_bp.is_some() { self.screen_in_bp = other.screen_in_bp.clone(); }
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
        if let (Some(stick),Some(middle),Some(screen_in_bp)) = (self.stick.as_ref(),self.middle,self.screen_in_bp) {
            let position = Position::new(stick,middle,screen_in_bp);
            Some(Viewpoint::new(&position,&focus_object))
        } else {
            None
        }
    }
}
