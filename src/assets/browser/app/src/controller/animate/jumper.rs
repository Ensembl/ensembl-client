use std::rc::Rc;
use std::sync::{ Arc, Mutex };
use stdweb::web::{ XmlHttpRequest, XhrResponseType };
use url::Url;

use serde_json::Value as JSONValue;

use composit::{ Stick, StickManager };
use controller::animate::{ ActionAnimator, action_zhoosh_pos, PendingActions, action_zhoosh_zoom, action_zhoosh_bang, action_zhoosh_fade };
use controller::global::App;
use controller::input::Action;
use dom::domutil::browser_time;
use types::{ Dot,LEFT, RIGHT };
use model::stage::{ Position, Screen, bp_to_zoomfactor, zoomfactor_to_bp };
use model::train::TrainManager;

use super::crossfade::{ CrossFade, CrossFader };

use misc_algorithms::marshal::{ json_str, json_obj_get, json_f64, json_bool };
use zhoosh::{ Zhoosh, ZhooshSequenceControl, ZhooshStep };

const ZHOOSH_TIME : f64 = 1000.; /* ms */
const ZHOOSH_PAUSE : f64 = 100.; /* ms */
const ZHOOSH_MIN_ZOOM : f64 = 3.; /* minimum zoom which should require full ZHOOSH_TIME */
const ZHOOSH_MIN_MOVE : f64 = 0.25; /* minimum screenfulls which should require full ZHOOSH_TIME */
const MS_FADE_FAST : f64 = 250.;
const MS_FADE_SLOW : f64 = 2000.;
const CROSSFADE_WHITENESS : f64 = 0.6; /* [0,1]. lower value => more dip to white */

struct Jumper {
    /* where should we be animating to right now? */
    jump_control: Option<ZhooshSequenceControl>,
    /* the individual zhooshes */
    zoom_zhoosh: Zhoosh<PendingActions,f64>,
    bang_zhoosh: Zhoosh<PendingActions,Option<(String,Dot<f64,f64>,f64)>>,
    settled_zhoosh: Zhoosh<PendingActions,bool>,
    slow_fade_zhoosh: Zhoosh<PendingActions,CrossFade>,
    fast_fade_zhoosh: Zhoosh<PendingActions,CrossFade>,
    fade_done_zhoosh: Zhoosh<PendingActions,()>
}

lazy_static! {
    static ref JUMPER : Arc<Mutex<Jumper>> = Arc::new(Mutex::new(Jumper::new()));
}

fn fade_cb(act: &mut PendingActions, cf: CrossFade) {
    act.add(Action::TrainTransitionOpacity(cf.get_prop_down(),false));
    act.add(Action::TrainTransitionOpacity(cf.get_prop_up(),true));
}

impl Jumper {
    fn new() -> Jumper {
        let zoom_zhoosh = action_zhoosh_zoom(ZHOOSH_TIME,ZHOOSH_MIN_ZOOM,0.,|act,pos| {
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
        let slow_fade_zhoosh = action_zhoosh_fade(MS_FADE_SLOW,CrossFader(CROSSFADE_WHITENESS,1.0),fade_cb);
        let fast_fade_zhoosh = action_zhoosh_fade(MS_FADE_FAST,CrossFader(1.0,0.0),fade_cb);
        let fade_done_zhoosh = action_zhoosh_bang(0.,|act,_| {
            act.add(Action::TrainTransitionComplete);
        });
        Jumper {
            zoom_zhoosh, bang_zhoosh, settled_zhoosh, slow_fade_zhoosh, fast_fade_zhoosh,
            fade_done_zhoosh,
            jump_control: None
        }
    }

    fn new_location_zhoosh_for_scale(&self, current_zoomfactor: f64, dest_zoomfactor: f64) -> Zhoosh<PendingActions,Dot<f64,f64>> {
        let current_bp = zoomfactor_to_bp(current_zoomfactor);
        let dest_bp = zoomfactor_to_bp(dest_zoomfactor);
        let bp_per_screen = current_bp.max(dest_bp);
        let bp_min_speed = bp_per_screen * ZHOOSH_MIN_MOVE;
        action_zhoosh_pos(ZHOOSH_TIME,bp_min_speed,0.,|act,pos| {
            act.add(Action::PosAnim(pos,None));
        })
    }

    fn is_offscreen_jump(&self, current_stick: &Stick, current_position: &Position, stick: &str, dest_pos: f64, dest_size: f64, screen: &Screen) -> bool {
        let dest_start = dest_pos - dest_size/2.;
        let dest_end = dest_pos + dest_size/2.;
        if  stick != current_stick.get_name() {
            return true;
        }
        let screen_left = current_position.get_edge(screen,&LEFT);
        let screen_right = current_position.get_edge(screen,&RIGHT);
        return dest_end < screen_left || dest_start > screen_right;
    }

    fn do_offscreen_jump(&mut self, animator: &mut ActionAnimator, stick: &str, dest_pos: Dot<f64,f64>, dest_size: f64) {
        let dest_zoom = bp_to_zoomfactor(dest_size);
        let mut seq = animator.new_sequence();
        let bang_z = animator.new_step(&mut seq,&self.bang_zhoosh,None,Some((stick.to_string(),dest_pos,dest_zoom)));
        let mut all_z = animator.new_step(&mut seq,&self.settled_zhoosh,false,true);
        seq.add_trigger(&all_z,&bang_z,1.,0.);
        animator.run(seq,false);
    }

    fn do_onscreen_jump(&mut self, animator: &mut ActionAnimator, current_position: &Position, dest_pos: Dot<f64,f64>, dest_size:f64) {
        let current_middle = current_position.get_middle();
        let current_zoom = bp_to_zoomfactor(current_position.get_screen_in_bp());
        let dest_zoom = bp_to_zoomfactor(dest_size);
        let mut seq = animator.new_sequence();
        let location_zhoosh = self.new_location_zhoosh_for_scale(current_zoom,dest_zoom);
        let pos_z = animator.new_step(&mut seq,&location_zhoosh,current_middle,dest_pos);
        let mut zoom_z = animator.new_step(&mut seq,&self.zoom_zhoosh,current_zoom,dest_zoom);
        let mut all_z = animator.new_step(&mut seq,&self.settled_zhoosh,false,true);
        if dest_zoom < current_zoom {
            seq.add_trigger(&pos_z,&zoom_z,1.,ZHOOSH_PAUSE);
            seq.add_trigger(&all_z,&pos_z,1.,0.);
        } else {
            seq.add_trigger(&zoom_z,&pos_z,1.,ZHOOSH_PAUSE);
            seq.add_trigger(&all_z,&zoom_z,1.,0.);
        }
        self.jump_control = Some(animator.run(seq,false));
    }

    fn jump(&mut self, src_stick: &Option<Stick>, src_position: &Option<Position>, animator: &mut ActionAnimator, stick: &str, dest_pos: f64, dest_size: f64, screen: &Screen) {
        if let Some(ref mut control) = self.jump_control {
            //control.abandon();
        }
        if let (Some(src_stick),Some(src_position)) = (src_stick,src_position) {
            if !self.is_offscreen_jump(&src_stick,&src_position,stick,dest_pos,dest_size,screen) {
                self.do_onscreen_jump(animator,&src_position,Dot(dest_pos,0.),dest_size);
                return;
            }
        }
        self.do_offscreen_jump(animator,stick,Dot(dest_pos,0.),dest_size);
    }

    fn fade(&mut self, app: &mut App, fast: bool) {
        let animator = app.get_window().get_animator();
        // XXX abandoning cleanly
        if let Some(ref mut control) = self.jump_control {
            //control.abandon();
        }
        let mut seq = animator.new_sequence();
        let fade_z = if fast { &self.fast_fade_zhoosh } else { &self.slow_fade_zhoosh };
        let fade_zs = animator.new_step(&mut seq,&fade_z,CrossFade::start(),CrossFade::end());
        let end_zs = animator.new_step(&mut seq,&self.fade_done_zhoosh,(),());
        seq.add_trigger(&end_zs,&fade_zs,1.,0.);
        animator.run(seq,true);
        //self.control = Some(animator.run(seq));
    }
}

pub fn animate_jump_to(src_stick: &Option<Stick>, src_position: &Option<Position>, animator: &mut ActionAnimator, stick: &str, dest_pos: f64, dest_size: f64, screen: &Screen) {
    JUMPER.lock().unwrap().jump(src_stick,src_position,animator,stick,dest_pos,dest_size,screen);
}

pub fn animate_fade(mut app: &mut App, fast: bool) {
    JUMPER.lock().unwrap().fade(app,fast);
}
