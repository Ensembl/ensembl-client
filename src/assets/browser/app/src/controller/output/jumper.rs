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
use zhoosh::{ Zhoosh, ZhooshSequenceControl, ZhooshStep };

const ZHOOSH_TIME : f64 = 500.; /* ms */
const ZHOOSH_PAUSE : f64 = 200.; /* ms */

struct Jumper {
    control: Option<ZhooshSequenceControl>,
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
            act.add(Action::PosAnim(pos,None));
        });
        let zoom_zhoosh = action_zhoosh_zoom(ZHOOSH_TIME,0.,ZHOOSH_PAUSE,|act,pos| {
            act.add(Action::ZoomToAnim(pos));
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
            location_zhoosh, zoom_zhoosh, bang_zhoosh, settled_zhoosh,
            control: None
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
        self.control = Some(animator.run(seq));
    }

    fn jump(&mut self, mut app: &mut App, stick: &str, dest_pos: f64, dest_size: f64) {
        if let Some(ref mut control) = self.control {
            control.abandon();
        }
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