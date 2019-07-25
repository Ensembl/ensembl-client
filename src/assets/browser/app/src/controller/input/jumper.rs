use stdweb::web::{ XmlHttpRequest, XhrResponseType };
use url::Url;

use serde_json::Value as JSONValue;

use controller::global::AppRunner;
use controller::input::Action;
use data::{ HttpManager, HttpResponseConsumer, BackendConfig };

pub struct Jumper {
    ar: AppRunner,
    manager: HttpManager,
    url: Option<Url>
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
                    let mut app = self.ar.state();
                    app.lock().unwrap().run_actions(&vec![
                        Action::SetStick(stick.to_string()),
                        Action::PosRange(start.parse().unwrap(),end.parse().unwrap(),0.),
                        Action::Settled
                    ],None);
                    console!("got result! {:?}/{:?}/{:?}",stick,start,end);
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

impl Jumper {
    pub fn new(ar: &AppRunner, manager: &HttpManager, base: &Url, bc: &BackendConfig) -> Jumper {
        let url = bc.get_jumper_url().as_ref().and_then(|v| base.join(v).ok());
        Jumper {
            ar: ar.clone(),
            manager: manager.clone(),
            url: url.clone()
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