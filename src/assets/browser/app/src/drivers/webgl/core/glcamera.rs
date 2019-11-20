use model::stage::{ Viewpoint, Screen };

#[derive(Clone)]
pub(super) struct GLCamera {
    opacity: f64,
    screen: Screen,
    viewpoint: Viewpoint
}

impl GLCamera {
    pub(super) fn new(opacity: f64, screen: &Screen, viewpoint: &Viewpoint) -> GLCamera {
        GLCamera {
            opacity,
            screen: screen.clone(),
            viewpoint: viewpoint.clone()
        }
    }

    pub(super) fn get_opacity(&self) -> f64 { self.opacity }
    pub(super) fn get_viewpoint(&self) -> &Viewpoint { &self.viewpoint }
    pub(super) fn get_screen(&self) -> &Screen { &self.screen }
}

impl PartialEq for GLCamera {
    fn eq(&self, other: &Self) -> bool {
        self.opacity == other.opacity &&
        self.viewpoint == other.viewpoint &&
        self.screen.get_size() == other.screen.get_size()
    }
}