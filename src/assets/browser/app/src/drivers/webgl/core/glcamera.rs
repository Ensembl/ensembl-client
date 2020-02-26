use crate::model::stage::{ Position, Screen };

#[derive(Clone)]
pub(super) struct GLCamera {
    opacity: f64,
    screen: Screen,
    pos: Position
}

impl GLCamera {
    pub(super) fn new(opacity: f64, screen: &Screen, pos: &Position) -> GLCamera {
        GLCamera {
            opacity,
            screen: screen.clone(),
            pos: pos.clone()
        }
    }

    pub(super) fn get_opacity(&self) -> f64 { self.opacity }
    pub(super) fn get_position(&self) -> &Position { &self.pos }
    pub(super) fn get_screen(&self) -> &Screen { &self.screen }
}

impl PartialEq for GLCamera {
    fn eq(&self, other: &Self) -> bool {
        self.opacity == other.opacity && self.pos.get_x_pos() == other.pos.get_x_pos() && 
        self.screen.get_y_pos() == other.screen.get_y_pos() &&
        self.pos.get_screen_in_bp() == other.pos.get_screen_in_bp() &&
        self.screen.get_size() == other.screen.get_size()
    }
}