use std::fmt;

use composit::Zoom;
use types::{ Dot, Direction, LEFT, RIGHT, UP, DOWN };

pub struct Position {
    pos: Dot<f64,f64>,
    zoom: Zoom,
    screen_size: Dot<i32,i32>,
    max_y: i32,
    min_x: f64,
    max_x: f64,
    min_x_bumper: f64,
    max_x_bumper: f64,
}

impl Position {
    pub fn new(pos: Dot<f64,f64>, screen_size: Dot<i32,i32>) -> Position {
        Position {
            screen_size, pos,
            zoom: Zoom::new(0.),
            max_y: 0, min_x: 0., max_x: 0.,
            min_x_bumper: 0.,
            max_x_bumper: 0.
        }
    }
        
    pub fn inform_screen_size(&mut self, screen_size: &Dot<i32,i32>) {
        self.screen_size = *screen_size;
        self.check_own_limits();
    }
    
    pub fn set_middle(&mut self, pos: &Dot<f64,f64>) {
        self.pos = *pos;
        self.check_own_limits();
    }
    
    pub fn get_zoom(&self) -> f64 {
        self.zoom.get_zoom()
    }

    pub fn get_linear_zoom(&self) -> f64 {
        self.zoom.get_linear_zoom()
    }
    
    pub fn get_screen_in_bp(&self) -> f64 {
        self.zoom.get_screen_in_bp()
    }
    
    pub fn set_zoom(&mut self, z: f64) {
        self.zoom.set_zoom(z);
    }
    
    pub fn settle(&mut self) {
        self.pos.1 = self.pos.1.round();
    }

    pub fn get_edge(&self, which: &Direction) -> f64 {
        let bp = self.get_screen_in_bp();
        match *which {
            LEFT =>  self.pos.0 - bp/2. + self.px_to_bp(self.min_x_bumper),
            RIGHT => self.pos.0 + bp/2. - self.px_to_bp(self.max_x_bumper),
            UP =>    self.pos.1 - self.screen_size.1 as f64/2.,
            DOWN =>  self.pos.1 + self.screen_size.1 as f64/2.
        }
    }

    pub fn get_limit_of_middle(&self, which: &Direction) -> f64 {
        let hw_bp = self.zoom.get_screen_in_bp()/2.;
        let hh_px = self.screen_size.1 as f64/2.;
        match *which {
            LEFT => self.min_x + hw_bp - self.px_to_bp(self.min_x_bumper),
            RIGHT => self.max_x - hw_bp + self.px_to_bp(self.min_x_bumper),
            UP => hh_px,
            DOWN => self.max_y as f64 - hh_px
        }
    }

    pub fn get_limit_of_edge(&self, which: &Direction) -> f64 {
        let hw_bp = self.zoom.get_screen_in_bp()/2.;
        let hh_px = self.screen_size.1 as f64/2.;
        match *which {
            LEFT => self.min_x,
            RIGHT => self.max_x,
            UP => 0.,
            DOWN => self.max_y as f64
        }
    }

    pub fn get_middle(&self) -> Dot<f64,f64> {
        Dot(self.pos.0,self.pos.1)
    }

    fn px_to_bp(&self, px: f64) -> f64 {
        px / self.screen_size.0 as f64 * self.zoom.get_screen_in_bp()
    }

    fn set_limit_min_zoom(&mut self) {
        let max_bp = /* maximum "displayed" bp is ... */
            self.max_x-self.min_x+1. /* ... available bp on stick ... */
            + (self.min_x_bumper+self.max_x_bumper) /* ... plus x bumpers (in px) ... */
               / self.screen_size.0 as f64    /* ... px->screen ... */
               * self.zoom.get_screen_in_bp() /* ... screen->bp... */
        ;        
        self.zoom.set_max_bp(max_bp);
    }

    pub fn set_limit(&mut self, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x = val,
            RIGHT => self.max_x = val,
            UP => (),
            DOWN => self.max_y = val as i32
        }
        self.set_limit_min_zoom();
        self.check_own_limits();
    }
    
    pub fn set_bumper(&mut self, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x_bumper = val,
            RIGHT => self.max_x_bumper = val,
            _ => ()
        }
        self.set_limit_min_zoom();
        self.check_own_limits();
    }
    
    fn check_limits(&self, pos: &mut Dot<f64,f64>) {
        /* minima always "win" when in conflict => max fn's called first */
        pos.0 = pos.0.min(self.get_limit_of_middle(&RIGHT));
        pos.0 = pos.0.max(self.get_limit_of_middle(&LEFT));
        pos.1 = pos.1.min(self.get_limit_of_middle(&DOWN));
        pos.1 = pos.1.max(self.get_limit_of_middle(&UP));
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
