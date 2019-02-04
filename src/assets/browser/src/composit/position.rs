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
    
    fn limit_min_y(&self, pos: &mut Dot<f64,f64>) {
        let min_dy = (self.screen_size.1 as f64/2.).max(0.);
        pos.1 = pos.1.max(min_dy);
    }

    fn limit_max_y(&self, pos: &mut Dot<f64,f64>) {
        let max_dy = (self.max_y as f64 - self.screen_size.1 as f64/2.).max(0.);
        pos.1 = pos.1.min(max_dy);
    }

    fn limit_min_x(&self, pos: &mut Dot<f64,f64>) {
        let min_dx = /* minimum x-coordinate in bp for centre is ... */
            /* ... specified min (in bp, wrt left edge) ... */
            self.min_x
            /* ... moved to centre ... */
            + self.zoom.get_screen_in_bp()/2.
            /* ... minus left bumper (in px) ... */
            - self.min_x_bumper
               / self.screen_size.0 as f64    /* ... px->screen ... */
               * self.zoom.get_screen_in_bp() /* ... screen->bp */
        ;
        pos.0 = pos.0.max(min_dx);
    }
    
    fn limit_max_x(&self, pos: &mut Dot<f64,f64>) {
        let max_dx = /* maximum x-coordinate in bp for centre is ... */
            /* ... specified max (in bp, wrt right edge) ... */
            self.max_x
            /* ... moved to centre ... */
            - self.zoom.get_screen_in_bp()/2.
            /* ... plus right bumper (in px) ... */
            + self.max_x_bumper
               / self.screen_size.0 as f64    /* ... px->screen ... */
               * self.zoom.get_screen_in_bp() /* ... screen->bp */
        ;
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
