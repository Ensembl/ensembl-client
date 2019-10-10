use std::rc::Rc;
use std::sync::{ Arc, Mutex };
use stdweb::web::{ XmlHttpRequest, XhrResponseType };
use url::Url;

use serde_json::Value as JSONValue;

use composit::{ Stick, StickManager };
use controller::animate::{ action_zhoosh_pos, PendingActions, action_zhoosh_zoom, action_zhoosh_bang };
use controller::global::App;
use controller::input::Action;
use dom::domutil::browser_time;
use types::{ Dot,LEFT, RIGHT };
use model::stage::{ Position, bp_to_zoomfactor };
use model::train::TrainManager;

use misc_algorithms::marshal::{ json_str, json_obj_get, json_f64, json_bool };
use zhoosh::{ Zhoosh, ZhooshStep };

const ZHOOSH_TIME : f64 = 500.; /* ms */
const ZHOOSH_PAUSE : f64 = 200.; /* ms */

/*

THIS CODE IS OUT-OF-DATE AND WILL NOT WORK, BUT IT'S KEPT HERE BECAUSE IT INCLUDES LOGIC NOT YET MIGRATED TO THE ZHOOSH-LIBRARY 

#[derive(Clone)]
pub struct JumpZhoosh {
    stick: Option<String>,
    phase_start_time: Option<f64>,
    start: (Dot<f64,f64>,f64),
    dest: (Dot<f64,f64>,f64),
    phase: u32
}

fn jumping_animation(app: &mut App) {

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

    fn stick(&mut self, _t: f64, actions: &mut Vec::<Action>) -> bool {
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
        if self.phase != 0 && t - self.phase_start_time.unwrap() < ZHOOSH_PAUSE { return true; }
        let zoom_first = self.dest.1 < self.start.1;
        let mut actions = Vec::new();
        let mut more = true;
        let phase_more = match self.phase {
            0 => { if self.stick(t,&mut actions) { more = false; } false },
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
*/

#[derive(Clone)]
pub struct Jumper {
    location_zhoosh: Zhoosh<PendingActions,Dot<f64,f64>>,
    zoom_zhoosh: Zhoosh<PendingActions,f64>,
    bang_zhoosh: Zhoosh<PendingActions,Option<(String,Dot<f64,f64>,f64)>>,
    settled_zhoosh: Zhoosh<PendingActions,bool>
}

lazy_static! {
    static ref JUMPER : Arc<Mutex<Jumper>> = Arc::new(Mutex::new(Jumper::new()));
}

impl Jumper {
    fn new() -> Jumper {
        let location_zhoosh = action_zhoosh_pos(ZHOOSH_TIME,0.,ZHOOSH_PAUSE,|act,pos| {
            act.add(Action::Pos(pos,None));
        });
        let zoom_zhoosh = action_zhoosh_zoom(ZHOOSH_TIME,0.,ZHOOSH_PAUSE,|act,pos| {
            act.add(Action::ZoomTo(pos));
        });
        let bang_zhoosh = action_zhoosh_bang(0.,|act,value| {
            if let Some((stick,pos,zoom)) = value {
                act.add(Action::SetStick(stick));
                act.add(Action::Pos(pos,None));
                act.add(Action::ZoomTo(zoom));
            }
        });
        let settled_zhoosh = action_zhoosh_bang(0.,|act,value| {
            if value {
                act.add(Action::Settled);
            }
        });
        Jumper {
            location_zhoosh, zoom_zhoosh, bang_zhoosh, settled_zhoosh
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

    fn do_offscreen_jump(&mut self, app: &mut App, stick: &str, dest_pos: Dot<f64,f64>, dest_size: f64) {
        let animator = app.get_window().get_animator();
        let dest_zoom = Position::unlimited_best_zoom_screen_bp(dest_size);
        let mut seq = animator.new_sequence();
        let bang_z = animator.new_step(&mut seq,&self.bang_zhoosh,None,Some((stick.to_string(),dest_pos,dest_zoom)));
        let mut all_z = animator.new_step(&mut seq,&self.settled_zhoosh,false,true);
        seq.add_trigger(&all_z,&bang_z,1.);
        animator.run(seq);
    }

    fn do_onscreen_jump(&mut self, app: &mut App, current_position: &Position, dest_pos: Dot<f64,f64>, dest_size:f64) {
        let animator = app.get_window().get_animator();
        let current_middle = current_position.get_middle();
        let current_zoom = bp_to_zoomfactor(current_position.get_screen_in_bp());
        let dest_zoom = Position::unlimited_best_zoom_screen_bp(dest_size);
        let mut seq = animator.new_sequence();
        let pos_z = animator.new_step(&mut seq,&self.location_zhoosh,current_middle,dest_pos);
        let mut zoom_z = animator.new_step(&mut seq,&self.zoom_zhoosh,current_zoom,dest_zoom);
        let mut all_z = animator.new_step(&mut seq,&self.settled_zhoosh,false,true);
        if dest_zoom < current_zoom {
            seq.add_trigger(&pos_z,&zoom_z,1.);
            seq.add_trigger(&all_z,&pos_z,1.);
        } else {
            seq.add_trigger(&zoom_z,&pos_z,1.);
            seq.add_trigger(&all_z,&zoom_z,1.);
        }
        animator.run(seq);
    }

    fn jump(&mut self, mut app: &mut App, stick: &str, dest_pos: f64, dest_size: f64) {
        let train_manager = app.get_window().get_train_manager();
        if let (Some(src_stick),Some(src_position)) = (train_manager.get_desired_stick(),train_manager.get_desired_position()) {
            if !self.is_offscreen_jump(&src_stick,&src_position,stick,dest_pos,dest_size) {
                self.do_onscreen_jump(&mut app,&src_position,Dot(dest_pos,0.),dest_size);
                return;
            }
        }
        self.do_offscreen_jump(&mut app,stick,Dot(dest_pos,0.),dest_size);
    }
}

pub fn animate_jump_to(mut app: &mut App, stick: &str, dest_pos: f64, dest_size: f64) {
    JUMPER.lock().unwrap().jump(app,stick,dest_pos,dest_size);
}