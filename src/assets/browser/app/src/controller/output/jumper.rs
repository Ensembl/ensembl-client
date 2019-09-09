use composit::Stick;
use controller::global::App;
use controller::input::Action;
use dom::domutil::browser_time;
use types::{ Dot,LEFT, RIGHT };
use model::stage::{ Position, bp_to_zoomfactor };

const ZHOOSH_TIME : f64 = 500.; /* ms */
const ZHOOSH_PAUSE : f64 = 250.; /* ms */

#[derive(Clone)]
pub struct JumpZhoosh {
    stick: Option<String>,
    phase_start_time: Option<f64>,
    start: (Dot<f64,f64>,f64),
    dest: (Dot<f64,f64>,f64),
    phase: u32
}

impl JumpZhoosh {
    pub fn new(stick: &Option<String>, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64)) -> JumpZhoosh {
        let out = JumpZhoosh {
            stick: stick.clone(),
            start, dest,
            phase_start_time: None,
            phase: 0
        };
        out
    }

    fn prop_phase(&self, t: f64) -> f64 {
        ((t - self.phase_start_time.unwrap() - ZHOOSH_PAUSE)/ZHOOSH_TIME).max(0.).min(1.)
    }

    fn centre(&self, t: f64, actions: &mut Vec::<Action>) -> bool {
        let pos_prop = self.prop_phase(t);
        let here = self.start.0 + (self.dest.0-self.start.0)*Dot(pos_prop,pos_prop);
        actions.push(Action::Pos(here,None));
        if pos_prop < 1. { return true; }
        false
    }

    fn zoom(&self, t: f64, actions: &mut Vec::<Action>) -> bool {
        let zoom_prop = self.prop_phase(t);
        let here = self.start.1 + (self.dest.1-self.start.1)*zoom_prop;
        actions.push(Action::ZoomTo(here));
        if zoom_prop < 1. { return true; }
        false
    }

    fn stick(&mut self, t: f64, actions: &mut Vec::<Action>) -> bool {
        if let Some(ref stick) = self.stick {
            actions.push(Action::SetStick(stick.to_string()));
            actions.push(Action::Pos(self.start.0,None));
            actions.push(Action::ZoomTo(self.start.1));
            self.stick = None;
            return true;
        }
        false
    }

    pub fn tick(&mut self, app: &mut App, t: f64) -> bool {
        if self.phase_start_time.is_none() {
            self.phase_start_time = Some(browser_time());
        }
        if t - self.phase_start_time.unwrap() < ZHOOSH_PAUSE { return true; }
        let zoom_first = self.dest.1 < self.start.1;
        let mut actions = Vec::new();
        let mut more = true;
        let phase_more = match self.phase {
            0 => self.stick(t,&mut actions),
            1 => if zoom_first { self.zoom(t,&mut actions) } else { self.centre(t,&mut actions) },
            2 => if zoom_first { self.centre(t,&mut actions) } else { self.zoom(t,&mut actions) },
            _ => { actions.push(Action::Settled); more = false; true }
        };
        if !phase_more {
            self.phase += 1;
            console!("phase={}",self.phase);
            self.phase_start_time = None;
        }
        app.run_actions(&actions,None);
        more
    }
}

#[derive(Clone)]
pub struct Jumper {
    zhoosh: Option<JumpZhoosh>
}

impl Jumper {
    pub fn new() -> Jumper {
        Jumper {
            zhoosh: None
        }
    }

    fn is_offscreen_jump(&self, current_stick: &Stick, current_position: &Position, stick: &str, dest_pos: f64, dest_size: f64) -> bool {
        let dest_start = dest_pos - dest_size/2.;
        let dest_end = dest_pos + dest_size/2.;
        if  stick != current_stick.get_name() {
            return true;
        }
        let screen_left = current_position.get_edge(&LEFT,true);
        let screen_right = current_position.get_edge(&RIGHT,true);
        return dest_end < screen_left || dest_start > screen_right;
    }

    pub fn tick(&mut self, app: &mut App, t: f64) {
        let mut keep = false;
        if let Some(ref mut zhoosh) = self.zhoosh {
            keep = zhoosh.tick(app,t);
        }
        if !keep {
            self.zhoosh = None;
        }
    }

    fn do_offscreen_jump(&mut self, app: &mut App, stick: &str, dest_pos: Dot<f64,f64>, dest_size: f64) {
        let dest_zoom = Position::unlimited_best_zoom_screen_bp(dest_size);
        self.zhoosh = Some(JumpZhoosh::new(
            &Some(stick.to_string()),
            (dest_pos,dest_zoom),
            (dest_pos,dest_zoom)));
    }

    fn do_onscreen_jump(&mut self, app: &mut App, current_position: &Position, dest_pos: Dot<f64,f64>, dest_size: f64) {
        let dest_zoom = Position::unlimited_best_zoom_screen_bp(dest_size);
        self.zhoosh = Some(JumpZhoosh::new(
            &None,
            (current_position.get_middle(),bp_to_zoomfactor(current_position.get_screen_in_bp())),
            (dest_pos,dest_zoom)));
    }

    pub fn jump(&mut self, mut app: &mut App, stick: &str, dest_pos: f64, dest_size: f64) {
        if self.zhoosh.is_some() {
            app.intend_here();
            self.zhoosh = None;
        }
        let train_manager = app.get_window().get_train_manager();
        let desired_stick = train_manager.get_desired_stick();
        if let (Some(src_stick),Some(src_position)) = (train_manager.get_desired_stick(),train_manager.get_desired_position()) {
            if !self.is_offscreen_jump(&src_stick,&src_position,stick,dest_pos,dest_size) {
                self.do_onscreen_jump(&mut app,&src_position,Dot(dest_pos,0.),dest_size);
                return;
            }
        }
        self.do_offscreen_jump(&mut app,stick,Dot(dest_pos,0.),dest_size);
    }
}
