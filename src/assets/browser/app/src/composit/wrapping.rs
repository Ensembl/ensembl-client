use types::{ Direction, LEFT, RIGHT };

pub struct Wrapping {
    min_x_bumper: f64,
    max_x_bumper: f64
}

impl Wrapping {
    pub fn new(min_x_bumper: f64, max_x_bumper: f64) -> Wrapping {
        Wrapping { min_x_bumper, max_x_bumper }
    }
    
    pub fn get_bumper(&self, which: &Direction) -> f64 {
        match *which {
            LEFT =>  self.min_x_bumper,
            RIGHT => self.max_x_bumper,
            _ => 0.
        }
    }
}
