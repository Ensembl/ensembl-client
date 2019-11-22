use super::zoom::{ Zoom, bp_to_zoomfactor };
use composit::Wrapping;
use controller::output::{ Report, ViewportReport };
use types::{ Dot, Direction, LEFT, RIGHT, UP, DOWN, IN, OUT, AxisSense };

const DELTA : f64 = 0.25; /* equal to the nearest */

#[derive(Clone,Debug)]
pub struct Position {
    pos: Dot<f64,f64>,
    zoom: Zoom,
    screen_size: Dot<f64,f64>,
    max_y: i32,
    min_x: f64,
    max_x: f64,
    min_x_bumper: f64,
    max_x_bumper: f64
}

impl Position {
    pub fn new() -> Position {
        Position {
            screen_size: Dot(0.,0.),
            pos: Dot(0.,0.),
            zoom: Zoom::new(),
            max_y: 0, min_x: 0., max_x: 0.,
            min_x_bumper: 0.,
            max_x_bumper: 0.
        }
    }
    
    pub fn location_match(&self, other: &Position) -> bool {
        (self.pos.0-other.pos.0).abs() < DELTA && 
        (self.zoom.get_screen_in_bp()-other.zoom.get_screen_in_bp()).abs() < DELTA
    }

    pub fn inform_screen_size(&mut self, screen_size: &Dot<f64,f64>) {
        self.screen_size = *screen_size;
        self.check_own_limits();
    }
    
    pub fn set_middle(&mut self, pos: &Dot<f64,f64>) {
        bb_log!("resize","set_middle");
        self.pos = *pos;
        self.check_own_limits();
    }
        
    pub fn get_screen_in_bp(&self) -> f64 {
        self.zoom.get_screen_in_bp()
    }

    pub fn get_bumped_screen_in_bp(&self) -> f64 {
        let delta = self.px_to_bp(self.min_x_bumper) + self.px_to_bp(self.max_x_bumper);
        self.zoom.get_screen_in_bp()+delta
    }
    
    pub fn set_screen_in_bp(&mut self, zoom: f64) {
        self.zoom.set_screen_in_bp(zoom);
    }
        
    pub fn settle(&mut self) {
        return; /* temporary, degrades visual output but buggy */
        bb_log!("resize","settle: screen width {}bp {}px",self.get_screen_in_bp(),self.screen_size.0);
        if self.screen_size.0 > 0. {
            let screen_px = self.screen_size.0.round() as i32;
            let x_round = self.get_screen_in_bp() / screen_px as f64;
            bb_log!("resize","round to {:?}bp",x_round);
            self.pos.0 = (self.pos.0 / x_round).round() * x_round;
        }
        self.pos.1 = self.pos.1.round();
    }

    pub fn best_zoom_screen_bp(&self, bp: f64) -> f64 {
        self.zoom.best_zoom_screen_bp(bp)
    }

    pub fn unlimited_best_zoom_screen_bp(bp: f64) -> f64 {
        Zoom::unlimited_best_zoom_screen_bp(bp)
    }

    pub fn middle_to_edge(&self, which: &Direction, bump: bool) -> f64 {
        let bp = self.get_screen_in_bp();
        let (bump_min,bump_max) = if bump {
            (self.px_to_bp(self.min_x_bumper),self.px_to_bp(self.max_x_bumper))
        } else {
            (0.,0.)
        };
        match *which {
            LEFT =>  - bp/2. + bump_min,
            RIGHT => bp/2. - bump_max,
            UP =>    - self.screen_size.1 as f64/2.,
            DOWN =>  self.screen_size.1 as f64/2.,
            IN|OUT => 0.
        }
    }

    pub fn get_edge(&self, which: &Direction, bump: bool) -> f64 {
        let delta = self.middle_to_edge(which,bump);
        match *which {
            LEFT|RIGHT => self.pos.0 + delta,
            UP|DOWN    => self.pos.1 + delta,
            IN|OUT     => bp_to_zoomfactor(self.zoom.get_screen_in_bp())
        }
    }

    fn get_limit_of_middle(&self, which: &Direction) -> f64 {
        self.get_limit_of_edge(which) -  self.middle_to_edge(which,false)
    }

    pub fn get_limit_of_edge(&self, which: &Direction) -> f64 {
        match *which {
            LEFT => self.min_x,
            RIGHT => self.max_x,
            DOWN => self.max_y as f64,
            UP => 0.,
            IN  => self.zoom.get_limit(&AxisSense::Max),
            OUT => self.zoom.get_limit(&AxisSense::Min),
        }
    }

    pub fn get_middle(&self) -> Dot<f64,f64> {
        bb_log!("resize","get_middle={:?}",self.pos);
        Dot(self.pos.0,self.pos.1)
    }

    pub fn get_bumped_middle(&self) -> Dot<f64,f64> {
        let left_bp = self.px_to_bp(self.min_x_bumper);
        let right_bp = self.px_to_bp(self.max_x_bumper);
        /*
        inner centre is at self.pos.0
        inner left is at self.pos.0 - bp_per_sc/2
        inner right is at self.pos.0 + bp_per_sc/2
        outer left is at self.pos.0 - bp_per_sc/2 - left_bp
        outer right is at self.pos.0 + bp_per_sc/2 + right_bp
        outer middle is at mean, ie (self.pos.0 - bp_per_sc/2 - left_bp + self.pos.0 + bp_per_sc/2 + right_bp)/2
        so outer middle is at self.pos.0 + (right_bp-left_bp)/2
        correction is to add (right_bp-left_bp)/2
        */
        Dot(self.pos.0+(right_bp-left_bp)/2.,self.pos.1)
    }

    fn px_to_bp(&self, px: f64) -> f64 {
        px / self.screen_size.0 as f64 * self.zoom.get_screen_in_bp()
    }

    fn set_limit_min_zoom(&mut self) {
        let max_bp =
            self.get_limit_of_edge(&RIGHT) - self.get_limit_of_edge(&LEFT)
            + 1.
            + self.px_to_bp(self.min_x_bumper)
            + self.px_to_bp(self.max_x_bumper);
        self.zoom.set_max_bp(max_bp);
    }

    pub fn set_limit(&mut self, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x = val,
            RIGHT => self.max_x = val,
            DOWN => self.max_y = val as i32,
            _ => (),
        }
        self.set_limit_min_zoom();
        self.check_own_limits();
    }
    
    fn set_bumper(&mut self, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x_bumper = val,
            RIGHT => self.max_x_bumper = val,
            _ => ()
        }
        self.set_limit_min_zoom();
        self.check_own_limits();
    }
    
    fn check_limits(&mut self, pos: &mut Dot<f64,f64>) {
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

    pub fn get_pos_prop_bp(&self, prop: f64) -> f64 {
        let start = self.get_middle().0 - self.get_screen_in_bp() / 2.;
        start + prop * self.get_screen_in_bp()
    }

    pub fn pos_prop_bp_to_origin(&self, pos: f64, prop: f64) -> f64 {
        let start = pos - prop * self.get_screen_in_bp();
        start + self.get_screen_in_bp()/2.
    }

    fn bumped(&self, direction: &Direction) -> bool {
        let mul : f64 = direction.1.into();
        self.get_edge(direction,true).floor() * mul >= self.get_limit_of_edge(direction).floor() * mul
    }

    pub fn update_reports(&self, report: &Report) {
        report.set_status_bool("bumper-left",self.bumped(&LEFT));
        report.set_status_bool("bumper-right",self.bumped(&RIGHT));
        report.set_status_bool("bumper-top",self.bumped(&UP));
        report.set_status_bool("bumper-bottom",self.bumped(&DOWN));
        report.set_status_bool("bumper-in",self.bumped(&IN));
        report.set_status_bool("bumper-out",self.bumped(&OUT));
        let (aleft,aright) = (self.get_edge(&LEFT,false),self.get_edge(&RIGHT,false));
        report.set_status("a-start",&aleft.floor().to_string());
        report.set_status("a-end",&aright.ceil().to_string());
    }

    pub fn update_viewport_report(&self, report: &ViewportReport) {
        report.set_delta_y(-self.get_edge(&UP,false) as i32);
    }

    pub fn set_wrapping(&mut self, w: &Wrapping) {
        self.set_bumper(&LEFT,w.get_bumper(&LEFT));
        self.set_bumper(&RIGHT,w.get_bumper(&RIGHT));
    }
}
