use commander::Agent;
use std::hash::Hash;
use std::sync::{ Arc, Mutex };
use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use url::Url;

use crate::dom::domutil::browser_time;
use crate::util::get_instance_id;
use blackbox::{ blackbox_config, blackbox_disable_all, blackbox_integration, blackbox_take_json, Integration };

use crate::data::{ BackendConfig, HttpManager, HttpResponseConsumer };

const INTERVAL : f64 = 10000.;

pub struct BlackboxIntegration{}

impl Integration for BlackboxIntegration {
    fn get_time(&self) -> f64 {
        browser_time()
    }

    fn get_instance_id(&self) -> String {
        get_instance_id()
    }

    fn get_time_units(&self) -> String { "ms".to_string() }
}

struct BlackBoxResponseConsumer{}

impl BlackBoxResponseConsumer {
    fn try_consume(&mut self, req: XmlHttpRequest) -> Result<(),String> {
        let value : ArrayBuffer = ok!(req.raw_response().try_into());
        let value : TypedArray<u8> = value.into();
        let data = String::from_utf8(value.to_vec()).map_err(|s| s.to_string())?;
        let data : SerdeValue = serde_json::from_str(&data).map_err(|s| s.to_string())?;
        match blackbox_config(&data) {
            true => Ok(()),
            false => Err("config rejected".to_string())
        }
    }
}

impl HttpResponseConsumer for BlackBoxResponseConsumer {
    fn consume(&mut self, req: XmlHttpRequest, agent: &Agent) {
        let res = self.try_consume(req);
        if let Err(s) = res {
            console!("bad response from debug endpoint (don't worry): {}",s);
        }
    }
}

// XXX get rid when we have a proper scheduler
struct BlackboxSenderImpl {
    last_sent: Option<f64>,
    config: BackendConfig
}

impl BlackboxSenderImpl {
    fn new(config: &BackendConfig) -> BlackboxSenderImpl {
        blackbox_disable_all();
        BlackboxSenderImpl {
            last_sent: None,
            config: config.clone()
        }
    }

    fn config_url(&self) -> Result<&String,String> {
        self.config.get_debug_url().as_ref().ok_or("no debug endpoint specified".to_string())
    }

    fn try_send(&mut self, http_manager: &HttpManager) -> Result<(),String> {
        let data = blackbox_take_json();
        let xhr = XmlHttpRequest::new();
        xhr.open("POST",&self.config_url()?.as_str()).map_err(|e| e.to_string());
        xhr.set_request_header("Content-Type", "application/json").map_err(|e| e.to_string())?;
        xhr.set_response_type(XhrResponseType::ArrayBuffer).map_err(|e| e.to_string())?;
        let consumer = Box::new(BlackBoxResponseConsumer{});
        http_manager.add_request(xhr,Some(data.to_string().as_bytes()),consumer);
        Ok(())
    }

    fn send(&mut self, http_manager: &HttpManager, now: f64) {
        if self.last_sent.map(|prev| now-prev > INTERVAL).unwrap_or(true) {
            self.last_sent = Some(now);
            let res = self.try_send(http_manager);
            if let Err(s) = res {
                console!("bad send to debug endpoint (don't worry): {}",s);
            }
        }
    }
}

#[derive(Clone)]
pub struct BlackboxSender(Arc<Mutex<BlackboxSenderImpl>>,String);

impl PartialEq for BlackboxSender {
    fn eq(&self, other: &Self) -> bool {
        self.1 == other.1
    }
}

impl std::hash::Hash for BlackboxSender {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.1.hash(state);
    }
}

impl Eq for BlackboxSender {}

impl BlackboxSender {
    pub fn new(config: &BackendConfig) -> Result<BlackboxSender,String> {
        let state = BlackboxSenderImpl::new(config);
        let config_url = state.config_url()?.to_string();
        Ok(BlackboxSender(Arc::new(Mutex::new(state)),config_url))
    }

    pub fn send(&self, http_manager: &HttpManager, now: f64) {
        ok!(self.0.lock()).send(http_manager,now);
    }
}
