use super::zoom::{ Zoom, bp_to_zoomfactor };
use super::Screen;
use composit::Wrapping;
use controller::output::{ Report, ViewportReport };
use types::{ Dot, Direction, LEFT, RIGHT, UP, DOWN, IN, OUT, AxisSense };

#[derive(Clone,Debug)]
pub struct Position {
    pos: Dot<f64,f64>,
    zoom: Zoom,
    min_x: f64,
    max_x: f64,
}

impl Position {
    pub fn new() -> Position {
        Position {
            pos: Dot(0.,0.),
            zoom: Zoom::new(),
            min_x: 0., max_x: 0.,
        }
    }
        
    pub fn set_middle(&mut self, pos: &Dot<f64,f64>, screen: &Screen) {
        self.pos = *pos;
        self.maybe_nudge_to_fit_limits(screen);
    }
        
    pub fn get_screen_in_bp(&self) -> f64 {
        self.zoom.get_screen_in_bp()
    }

    pub fn get_bumped_screen_in_bp(&self, screen: &Screen) -> f64 {
        let x_bumpers = screen.get_x_bumpers();
        let delta = self.px_to_bp(x_bumpers.0,screen) + self.px_to_bp(x_bumpers.1,screen);
        self.zoom.get_screen_in_bp()+delta
    }
    
    pub fn set_screen_in_bp(&mut self, zoom: f64) {
        self.zoom.set_screen_in_bp(zoom);
    }
        
    pub fn best_zoom_screen_bp(&self, bp: f64) -> f64 {
        self.zoom.best_zoom_screen_bp(bp)
    }

    pub fn unlimited_best_zoom_screen_bp(bp: f64) -> f64 {
        Zoom::unlimited_best_zoom_screen_bp(bp)
    }

    fn middle_to_edge(&self, which: &Direction, screen: &Screen, bump: bool) -> f64 {
        let bp = self.get_screen_in_bp();
        let x_bumpers = screen.get_x_bumpers();
        let (bump_min,bump_max) = if bump {
            (self.px_to_bp(x_bumpers.0,screen),self.px_to_bp(x_bumpers.1,screen))
        } else {
            (0.,0.)
        };
        let screen_y_height = screen.get_size().1;
        match *which {
            LEFT =>  - bp/2. + bump_min,
            RIGHT => bp/2. - bump_max,
            UP =>    - screen_y_height as f64/2.,
            DOWN =>  screen_y_height as f64/2.,
            IN|OUT => 0.
        }
    }

    pub fn get_edge(&self, screen: &Screen, which: &Direction, bump: bool) -> f64 {
        let delta = self.middle_to_edge(which,screen,bump);
        match *which {
            LEFT|RIGHT => self.pos.0 + delta,
            UP|DOWN    => self.pos.1 + delta,
            IN|OUT     => bp_to_zoomfactor(self.zoom.get_screen_in_bp())
        }
    }

    fn get_limit_of_middle(&self, screen: &Screen, which: &Direction) -> f64 {
        self.get_limit_of_edge(which) -  self.middle_to_edge(which,screen,false)
    }

    fn get_limit_of_edge(&self, which: &Direction) -> f64 {
        match *which {
            LEFT => self.min_x,
            RIGHT => self.max_x,
            DOWN => 0.,
            UP => 0.,
            IN  => self.zoom.get_limit(&AxisSense::Max),
            OUT => self.zoom.get_limit(&AxisSense::Min),
        }
    }

    pub fn get_middle(&self) -> Dot<f64,f64> {
        Dot(self.pos.0,self.pos.1)
    }

    pub fn get_bumped_middle(&self, screen: &Screen) -> Dot<f64,f64> {
        let x_bumpers = screen.get_x_bumpers();
        let left_bp = self.px_to_bp(x_bumpers.0,screen);
        let right_bp = self.px_to_bp(x_bumpers.1,screen);
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

    fn px_to_bp(&self, px: f64, screen: &Screen) -> f64 {
        px / screen.get_size().0 as f64 * self.zoom.get_screen_in_bp()
    }

    fn set_limit_min_zoom(&mut self, screen: &Screen) {
        let x_bumpers = screen.get_x_bumpers();
        let max_bp =
            self.get_limit_of_edge(&RIGHT) - self.get_limit_of_edge(&LEFT)
            + 1.
            + self.px_to_bp(x_bumpers.0,screen)
            + self.px_to_bp(x_bumpers.1,screen);
        self.zoom.set_max_bp(max_bp);
    }

    pub fn set_limit(&mut self, screen: &Screen, which: &Direction, val: f64) {
        match *which {
            LEFT => self.min_x = val,
            RIGHT => self.max_x = val,
            _ => (),
        }
        self.maybe_nudge_to_fit_limits(screen);
    }
        
    fn check_limits(&mut self, pos: &mut Dot<f64,f64>, screen: &Screen) {
        /* minima always "win" when in conflict => max fn's called first */        
        pos.0 = pos.0.min(self.get_limit_of_middle(screen,&RIGHT));
        pos.0 = pos.0.max(self.get_limit_of_middle(screen,&LEFT));
        pos.1 = pos.1.min(self.get_limit_of_middle(screen,&DOWN));
        pos.1 = pos.1.max(self.get_limit_of_middle(screen,&UP));
    }
    
    pub fn maybe_nudge_to_fit_limits(&mut self, screen: &Screen) {
        let mut pos = self.pos;
        self.set_limit_min_zoom(screen);
        self.check_limits(&mut pos,screen);
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

    fn bumped(&self, screen: &Screen, direction: &Direction) -> bool {
        let mul : f64 = direction.1.into();
        self.get_edge(screen,direction,true).floor() * mul >= self.get_limit_of_edge(direction).floor() * mul
    }

    pub fn update_reports(&self, screen: &Screen, report: &Report) {
        report.set_status_bool("bumper-left",self.bumped(screen,&LEFT));
        report.set_status_bool("bumper-right",self.bumped(screen,&RIGHT));
        report.set_status_bool("bumper-top",self.bumped(screen,&UP));
        report.set_status_bool("bumper-bottom",self.bumped(screen,&DOWN));
        report.set_status_bool("bumper-in",self.bumped(screen,&IN));
        report.set_status_bool("bumper-out",self.bumped(screen,&OUT));
        let (aleft,aright) = (self.get_edge(screen,&LEFT,false),self.get_edge(screen,&RIGHT,false));
        report.set_status("a-start",&aleft.floor().to_string());
        report.set_status("a-end",&aright.ceil().to_string());
    }

    pub fn update_viewport_report(&self, screen: &Screen, report: &ViewportReport) {
        report.set_delta_y(-self.get_edge(screen,&UP,false) as i32);
    }
}
