use std::sync::{ Arc, Mutex };
use stdweb::web::{ XmlHttpRequest, XhrResponseType };
use url::Url;

use serde_json::Value as JSONValue;

use controller::global::{ App, AppRunner };
use controller::input::Action;
use data::{ HttpManager, HttpResponseConsumer, BackendConfig };
use data::parse_jsonxferresponse;
use dom::domutil::browser_time;
use types::{ Dot, ddiv };

const ZHOOSH_TIME : f64 = 2000.; /* ms */

pub struct JumpZhoosh {
    stick: Option<String>,
    start_time: f64,
    start: (Dot<f64,f64>,f64),
    dest: (Dot<f64,f64>,f64)
}

impl JumpZhoosh {
    pub fn new(stick: &str, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64)) -> JumpZhoosh {
        JumpZhoosh {
            stick: Some(stick.to_string()),
            start, dest,
            start_time: browser_time()
        }
    }

    pub fn tick(&mut self, app: &mut App, t: f64) -> bool {
        let mut more = false;
        let mut actions = Vec::<Action>::new();
        let prop = ((t-self.start_time)/ZHOOSH_TIME).max(0.).min(1.);
        /* stick */
        if let Some(ref stick) = self.stick {
            actions.push(Action::SetStick(stick.to_string()));
            more = true;
        }
        self.stick = None;
        /* position */
        let pos_prop = ((prop-0.25)*4.).min(1.).max(0.);
        let here = self.start.0 + (self.dest.0-self.start.0)*Dot(pos_prop,pos_prop);
        actions.push(Action::Pos(here,None));
        /* zoom */
        let zoom_prop = ((prop-0.75)*4.).min(1.).max(0.);
        let here = self.start.1 + (self.dest.1-self.start.1)*zoom_prop;
        actions.push(Action::ZoomTo(here));
        /* do it! */
        if prop < 1. {
            more = true;
        } else {
            actions.push(Action::Settled);
        }
        app.run_actions(&actions,None);
        more
    }
}

pub struct JumperConsumer {
    ar: AppRunner
}

impl JumperConsumer {
    pub fn new(ar: &AppRunner) -> JumperConsumer {
        JumperConsumer {
            ar: ar.clone()
        }
    }

    fn jump(&mut self, req: XmlHttpRequest) -> Result<(),String> {
        let in_ = req.response_text().map_err(|_| "Cannot parse json".to_string())?;
        if in_.is_none() {
            return Err("bad response".to_string());
        }
        let data : JSONValue = serde_json::from_str(&unwrap!(in_)).map_err(|_| "Cannot parse json".to_string())?;
        if let JSONValue::Object(ref obj) = data {
            if obj.get("found").and_then(|x| x.as_bool()).unwrap_or(false) {
                let stick = obj.get("stick").and_then(|x| x.as_str());
                let start = obj.get("start").and_then(|x| x.as_str());
                let end = obj.get("end").and_then(|x| x.as_str());
                if let (Some(stick),Some(start),Some(end)) = (stick,start,end) {
                    console!("got result! {:?}/{:?}/{:?}",stick,start,end);
                    let mut app_ref = self.ar.state();
                    let mut app = app_ref.lock().unwrap();
                    let start : f64 = start.parse().unwrap();
                    let end : f64 = end.parse().unwrap();
                    let (src, dest) = app.with_stage(|stage| {
                        let dest_pos = Dot((start+end)/2.,0.);
                        let dest_zoom = stage.best_zoom_screen_bp(end-start+1.);
                        ((stage.get_pos_middle(),stage.get_zoom()),(dest_pos,dest_zoom))
                    });
                    app.with_jumper(|j| j.zhoosh_to(stick,src,dest));
                }
                if let Some(ref payload) = obj.get("payload") {
                    for resp in parse_jsonxferresponse(payload) {
                        console!("got payload {:?}",payload);
                    }
                }
            }
        }
        Ok(())
    }
}

impl HttpResponseConsumer for JumperConsumer {
    fn consume(&mut self, req: XmlHttpRequest) {
        match self.jump(req) {
            Ok(()) => (),
            Err(s) => {
                console!("jump error: {}",s);
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

    pub fn zhoosh_to(&mut self, stick: &str, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64)) {
        self.zhoosh = Some(JumpZhoosh::new(stick,start,dest));
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

    pub fn jump(&mut self, id: &str) -> Result<(),String> {
        let consumer = Box::new(JumperConsumer::new(&self.ar));
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

    pub fn zhoosh_to(&mut self, stick: &str, start: (Dot<f64,f64>,f64), dest: (Dot<f64,f64>,f64)) {
        self.0.lock().unwrap().zhoosh_to(stick,start,dest);
    }

    pub fn jump(&mut self, id: &str) -> Result<(),String> {
        self.0.lock().unwrap().jump(id)
    }
}
