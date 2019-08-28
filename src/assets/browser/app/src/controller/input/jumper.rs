use std::sync::{ Arc, Mutex };
use stdweb::web::{ XmlHttpRequest, XhrResponseType };
use url::Url;

use serde_json::Value as JSONValue;

use composit::Stick;
use controller::global::{ App, AppRunner };
use controller::input::Action;
use data::{ HttpManager, HttpResponseConsumer, BackendConfig };
use dom::domutil::browser_time;
use types::{ Dot, ddiv, LEFT, RIGHT };
use model::stage::{ Position, bp_to_zoomfactor };
use model::train::TrainManager;

use misc_algorithms::marshal::{ json_str, json_obj_get, json_f64, json_bool };

const ZHOOSH_TIME : f64 = 500.; /* ms */
const ZHOOSH_PAUSE : f64 = 250.; /* ms */

pub struct JumpZhoosh {
    ar: AppRunner,
    stick: Option<String>,
    phase_start_time: Option<f64>,
    start: (Dot<f64,f64>,f64),
    dest: (Dot<f64,f64>,f64),
    phase: u32,
    set_id: Option<String>
}

impl JumpZhoosh {
    pub fn new(ar: &AppRunner, stick: &Option<String>, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64), set_id: &Option<String>) -> JumpZhoosh {
        let out = JumpZhoosh {
            ar: ar.clone(),
            stick: stick.clone(),
            start, dest,
            phase_start_time: None,
            phase: 0,
            set_id: set_id.clone()
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
        if let Some(id) = self.set_id.as_ref() {
            actions.push(Action::SetFocus(id.clone()));
        }
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

pub struct JumperConsumer {
    ar: AppRunner,
    set_id: Option<String>
}

impl JumperConsumer {
    pub fn new(ar: &AppRunner, set_id: Option<String>) -> JumperConsumer {
        JumperConsumer {
            ar: ar.clone(),
            set_id
        }
    }

    fn is_offscreen_jump(&self, current_stick: &Option<Stick>, current_position: &Option<Position>, stick: &str, dest_start: f64, dest_end: f64) -> bool {
        if current_stick.is_none() || stick != current_stick.as_ref().unwrap().get_name() {
            return true;
        }
        if let Some(desired) = current_position {
            let screen_left = desired.get_edge(&LEFT,true);
            let screen_right = desired.get_edge(&RIGHT,true);
            return dest_end < screen_left || dest_start > screen_right;
        } else {
            return false;
        }
    }

    fn do_offscreen_jump(&self, app: &mut App, stick: &str, dest_pos: Dot<f64,f64>, dest_zoom: f64) {
        app.with_jumper(|j|
            j.zhoosh_to(
                &Some(stick.to_string()),
                (dest_pos,dest_zoom),
                (dest_pos,dest_zoom),
                &self.set_id));
    }

    fn do_onscreen_jump(&self, app: &mut App, current_position: &Position, dest_pos: Dot<f64,f64>, dest_zoom: f64) {
        app.with_jumper(|j| j.zhoosh_to(
            &None,
            (current_position.get_middle(),bp_to_zoomfactor(current_position.get_screen_in_bp())),
            (dest_pos,dest_zoom),
            &self.set_id));
    }

    fn select_jump(&self, stick: &str, dest_start: f64, dest_end: f64) {
        let mut app_ref = self.ar.state();
        let mut app = app_ref.lock().unwrap();
        let mut train_manager = app.get_window().get_train_manager();
        let desired_stick = train_manager.get_desired_stick();
        let desired_position = train_manager.get_desired_position();
        let dest_size = dest_end-dest_start+1.;
        let dest_zoom = if let Some(ref position) = desired_position {
            position.best_zoom_screen_bp(dest_size)
        } else {
            Position::unlimited_best_zoom_screen_bp(dest_size)
        };
        let dest_pos = Dot((dest_start+dest_end)/2.,0.);
        if self.is_offscreen_jump(&desired_stick,&desired_position,stick,dest_start,dest_end) {
            self.do_offscreen_jump(&mut app,stick,dest_pos,dest_zoom);
        } else {
            self.do_onscreen_jump(&mut app,desired_position.as_ref().unwrap(),dest_pos,dest_zoom);
        }
    }

    fn jump(&mut self, req: XmlHttpRequest) -> Result<(),()> {
        let in_ = req.response_text().map_err(|_|())?;
        let data : JSONValue = serde_json::from_str(&unwrap!(in_)).map_err(|_|())?;
        let stick = json_str(json_obj_get(&data,"stick")?)?;
        let f : Result<f64,_> = json_str(json_obj_get(&data,"start")?)?.parse();
        let dest_start = json_f64(json_obj_get(&data,"start")?)?;
        let dest_end = json_f64(json_obj_get(&data,"end")?)?;
        let found = json_bool(json_obj_get(&data,"found")?)?;
        if found {
            self.select_jump(&stick,dest_start,dest_end);
        }
        Ok(())
    }
}

impl HttpResponseConsumer for JumperConsumer {
    fn consume(&mut self, req: XmlHttpRequest) {
        match self.jump(req) {
            Ok(()) => (),
            Err(s) => {
                console!("jump error");
            }
        }
    }
}

pub struct JumperImpl {
    ar: AppRunner,
    manager: HttpManager,
    url: Option<Url>,
    zhoosh: Option<JumpZhoosh>
}

impl JumperImpl {
    pub fn new(ar: &AppRunner, manager: &HttpManager, base: &Url, bc: &BackendConfig) -> JumperImpl {
        let url = bc.get_jumper_url().as_ref().and_then(|v| base.join(v).ok());
        JumperImpl {
            ar: ar.clone(),
            manager: manager.clone(),
            url: url.clone(),
            zhoosh: None
        }
    }

    pub fn zhoosh_to(&mut self, stick: &Option<String>, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64), set_id: &Option<String>) {
        self.zhoosh = Some(JumpZhoosh::new(&self.ar,stick,start,dest,set_id));
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

    pub fn jump(&mut self, id: &str, combined: bool) -> Result<(),String> {
        let new_id = if combined { Some(id.to_string()) } else { None };
        let consumer = Box::new(JumperConsumer::new(&self.ar,new_id));
        let xhr = XmlHttpRequest::new();
        if let Some(ref url) = self.url {
            let mut url = url.clone();
            {
                let mut path = url.path_segments_mut().map_err(|_| "Cannot parse locale url".to_string())?;
                path.push(id);
            }
            xhr.open("GET",&url.as_str()).map_err(|e| e.to_string());
            self.manager.add_request(xhr,None,consumer);
            console!("jump set to {:?}",id);
            Ok(())
        } else {
            console!("no jumper URL");
            Err("no jumper URL".to_string())
        }
    }
}

#[derive(Clone)]
pub struct Jumper(Arc<Mutex<JumperImpl>>);

impl Jumper {
    pub fn new(ar: &mut AppRunner, manager: &HttpManager, base: &Url, bc: &BackendConfig) -> Jumper {
        let j = Jumper(Arc::new(Mutex::new(JumperImpl::new(ar,manager,base,bc))));
        let j2 = j.clone();
        ar.add_timer("jumper",move |cg,t,_| { j2.clone().tick(cg,t); vec!{} },1);
        j
    }

    pub fn tick(&mut self, app: &mut App, t: f64) {
        self.0.lock().unwrap().tick(app,t);
    }

    pub fn zhoosh_to(&mut self, stick: &Option<String>, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64), set_id: &Option<String>) {
        self.0.lock().unwrap().zhoosh_to(stick,start,dest,set_id);
    }

    pub fn jump(&mut self, id: &str, combined: bool) -> Result<(),String> {
        self.0.lock().unwrap().jump(id,combined)
    }
}
