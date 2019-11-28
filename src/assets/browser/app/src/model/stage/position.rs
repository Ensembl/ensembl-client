use super::Screen;
use composit::{ Stick, Wrapping };
use controller::output::{ Report, ViewportReport };
use types::{ Dot, Direction, LEFT, RIGHT, UP, DOWN, IN, OUT, AxisSense };

pub fn bp_to_zoomfactor(bp: f64) -> f64 {
    -bp.log10()
}

pub fn zoomfactor_to_bp(zoomfactor: f64) -> f64 {
    10.0_f64.powf(-zoomfactor)
}

fn px_to_bp(px: f64, screen: &Screen, screen_in_bp: f64) -> f64 {
    px / screen.get_size().0 as f64 * screen_in_bp
}

#[derive(Clone,Debug,PartialEq)]
pub struct Position {
    stick: Stick,
    x_pos: f64,
    screen_in_bp: f64,
}

const MAX_LIMIT_BP : f64 = 50.;

impl Position {
    pub fn new(stick: &Stick, x_pos: f64, screen_in_bp: f64) -> Position {
        let mut out = Position {
            stick: stick.clone(),
            x_pos,
            screen_in_bp
        };
        out.maybe_nudge_x_to_fit_limits();
        out
    }
    
    fn max_bp(&self) -> f64 {
        let min_x = 0.; /* kept here as reminder for circular chromosomes */
        let max_x = self.stick.length() as f64;
        max_x - min_x + 1.
    }

    pub fn new_with_screen_bp(&self, bp: f64) -> Position {
        Position::new(&self.stick,self.x_pos,bp)
    }

    pub fn new_with_middle(&self, x_pos: f64) -> Position {
        Position::new(&self.stick,x_pos,self.screen_in_bp)
    }
        
    pub fn get_screen_in_bp(&self) -> f64 { self.screen_in_bp }

    pub fn get_bumped_screen_in_bp(&self, screen: &Screen) -> f64 {
        let x_bumpers = screen.get_x_bumpers();
        let delta = px_to_bp(x_bumpers.0,screen,self.screen_in_bp) + 
                    px_to_bp(x_bumpers.1,screen,self.screen_in_bp);
        self.screen_in_bp+delta
    }

    pub fn get_left_edge(&self) -> f64 {
        self.x_pos - self.get_screen_in_bp()/2.
    }

    pub fn get_right_edge(&self) -> f64 {
        self.x_pos + self.get_screen_in_bp()/2.
    }

    pub fn get_stick(&self) -> &Stick { &self.stick }

    pub fn get_x_pos(&self) -> f64 { self.x_pos }

    pub fn get_bumped_middle(&self, screen: &Screen) -> f64 {
        let x_bumpers = screen.get_x_bumpers();
        let left_bp = px_to_bp(x_bumpers.0,screen,self.screen_in_bp);
        let right_bp = px_to_bp(x_bumpers.1,screen,self.screen_in_bp);
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
        self.x_pos+(right_bp-left_bp)/2.
    }

    fn maybe_nudge_x_to_fit_limits(&mut self) {
        let min_x = 0.; /* kept here as reminder for circular chromosomes */
        let max_x = self.stick.length() as f64;
        self.screen_in_bp = self.screen_in_bp.min(self.max_bp()).max(MAX_LIMIT_BP);
        /* minima always "win" when in conflict => max fn's called first */  
        self.x_pos = self.x_pos
            .min(max_x - self.screen_in_bp/2.)
            .max(min_x + self.screen_in_bp/2.);
    }

    pub fn get_pos_prop_bp(&self, prop: f64) -> f64 {
        let start = self.get_x_pos() - self.get_screen_in_bp() / 2.;
        start + prop * self.get_screen_in_bp()
    }

    pub fn pos_prop_bp_to_origin(&self, pos: f64, prop: f64) -> f64 {
        let start = pos - prop * self.get_screen_in_bp();
        start + self.get_screen_in_bp()/2.
    }

    pub fn update_reports(&self, screen: &Screen, report: &Report) {
        let min_x = 0.; /* kept here as reminder for circular chromosomes */
        let max_x = self.stick.length() as f64;
        let max_y = screen.get_max_y() as f64;
        report.set_status_bool("bumper-left",self.get_left_edge() <= min_x);
        report.set_status_bool("bumper-right",self.get_right_edge() >= max_x);
        report.set_status_bool("bumper-top",screen.get_top_edge() <= 0.);
        report.set_status_bool("bumper-bottom",screen.get_bottom_edge() >= max_y);
        report.set_status_bool("bumper-in",self.screen_in_bp <= MAX_LIMIT_BP);
        report.set_status_bool("bumper-out",self.screen_in_bp >= self.max_bp());
        let (aleft,aright) = (self.get_left_edge(),self.get_right_edge());
        report.set_status("a-start",&aleft.floor().to_string());
        report.set_status("a-end",&aright.ceil().to_string());
    }

    pub fn update_viewport_report(&self, screen: &Screen, report: &ViewportReport) {
        report.set_delta_y(-screen.get_top_edge() as i32);
    }
}
