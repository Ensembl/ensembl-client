use composit::Stick;
use model::focus::FocusObjectId;
use types::Dot;

#[derive(Clone,PartialEq)]
pub struct Viewpoint {
    stick: Stick,
    middle: Dot<f64,f64>,
    zoom: f64,
    focus_object: FocusObjectId
}

impl Viewpoint {
    pub fn new(stick: &Stick, middle: Dot<f64,f64>, zoom: f64, focus_object: &FocusObjectId) -> Viewpoint {
        Viewpoint {
            stick: stick.clone(),
            middle, zoom,
            focus_object: focus_object.clone()
        }
    }

    pub fn get_stick(&self) -> &Stick { &self.stick }
    pub fn get_middle(&self) -> &Dot<f64,f64> { &self.middle }
    pub fn get_zoom(&self) -> f64 { self.zoom }
    pub fn get_focus_object_id(&self) -> &FocusObjectId { &self.focus_object }

    pub fn as_fragment(&self) -> ViewpointFragment {
        ViewpointFragment {
            stick: Some(self.stick),
            middle: Some(self.middle),
            zoom: Some(self.zoom),
            focus_object: Some(self.focus_object)
        }
    }
}

pub struct ViewpointFragment {
    stick: Option<Stick>,
    middle: Option<Dot<f64,f64>>,
    zoom: Option<f64>,
    focus_object: Option<FocusObjectId>
}

impl ViewpointFragment {
    pub fn new_empty() -> ViewpointFragment {
        ViewpointFragment {
            stick: None,
            middle: None,
            zoom: None,
            focus_object: None
        }
    }

    pub fn new_stick(stick: &Stick) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.stick = Some(stick.clone());
        out
    }

    pub fn new_middle(middle: Dot<f64,f64>) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.middle = Some(middle.clone());
        out
    }

    pub fn new_zoom(zoom: f64) -> ViewpointFragment {
        let mut out = ViewpointFragment::new_empty();
        out.zoom = Some(zoom.clone());
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
        if other.zoom.is_some() { self.zoom = other.zoom.clone(); }
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
        if let (Some(stick),Some(middle),Some(zoom)) = (self.stick.as_ref(),self.middle,self.zoom) {
            Some(Viewpoint::new(stick,middle,zoom,&focus_object))
        } else {
            None
        }
    }
}
