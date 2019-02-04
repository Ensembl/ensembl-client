use std::fmt;

use composit::Zoom;
use types::{ Dot, Direction, LEFT, RIGHT, UP, DOWN };

pub struct Position {
    pos: Dot<f64,f64>,
    zoom: Zoom,
    screen_size:Dot<i32,i32>,
    max_y: i32,
    min_x: f64,
    max_x: f64
}

impl Position {
    pub fn new(pos: Dot<f64,f64>, screen_size: Dot<i32,i32>) -> Position {
        Position {
            screen_size, pos,
            zoom: Zoom::new(0.),
            max_y: 0, min_x: 0., max_x: 0.
        }
    }
     
    pub fn inform_zoom(&mut self, z: &Zoom) {
        self.zoom = z.clone();
        self.check_own_limits();
    }
        
    pub fn inform_screen_size(&mut self, screen_size: &Dot<i32,i32>) {
        self.screen_size = *screen_size;
        self.check_own_limits();
    }
    
    pub fn set_middle(&mut self, pos: &Dot<f64,f64>) {
        self.pos = *pos;
        self.check_own_limits();
    }
    
    pub fn settle(&mut self) {
        self.pos.1 = self.pos.1.round();
    }

    pub fn get_edge(&self, which: &Direction) -> f64 {
        match *which {
            LEFT =>  self.pos.0 - self.screen_size.0 as f64/2.,
            RIGHT => self.pos.0 + self.screen_size.0 as f64/2.,
            UP =>    self.pos.1 - self.screen_size.1 as f64/2.,
            DOWN =>  self.pos.1 + self.screen_size.1 as f64/2.
        }
    }

    pub fn get_middle(&self) -> Dot<f64,f64> {
        Dot(self.pos.0,self.pos.1)
    }

    pub fn set_limit(&mut self, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x = val,
            RIGHT => self.max_x = val,
            UP => (),
            DOWN => self.max_y = val as i32
        }
        self.check_own_limits();
    }
    
    fn limit_min_y(&self, pos: &mut Dot<f64,f64>) {
        let min_dy = (self.screen_size.1 as f64/2.).max(0.);
        pos.1 = pos.1.max(min_dy);
    }

    fn limit_max_y(&self, pos: &mut Dot<f64,f64>) {
        let max_dy = (self.max_y as f64 - self.screen_size.1 as f64/2.).max(0.);
        pos.1 = pos.1.min(max_dy);
    }

    fn limit_min_x(&self, pos: &mut Dot<f64,f64>) {
        let min_dx = (self.min_x + self.zoom.get_screen_in_bp()/2.).max(0.);
        pos.0 = pos.0.max(min_dx);
    }
    
    fn limit_max_x(&self, pos: &mut Dot<f64,f64>) {
        let max_dx = (self.max_x - self.zoom.get_screen_in_bp()/2.).max(0.);
        pos.0 = pos.0.min(max_dx);
    }
    
    fn check_limits(&self, pos: &mut Dot<f64,f64>) {
        /* minima always "win" when in conflict => max fn's called first */
        self.limit_max_x(pos);
        self.limit_min_x(pos);
        self.limit_max_y(pos);
        self.limit_min_y(pos);
    }
    
    fn check_own_limits(&mut self) {
        let mut pos = self.pos;
        self.check_limits(&mut pos);
        self.pos = pos;
    }
}

impl fmt::Debug for Position {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"p{:?}",self.pos)
    }
}
