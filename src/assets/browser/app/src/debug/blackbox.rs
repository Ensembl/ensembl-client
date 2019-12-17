use std::sync::{ Arc, Mutex };
use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use url::Url;

use dom::domutil::browser_time;
use util::get_instance_id;
use blackbox::{ blackbox_config, blackbox_integration, blackbox_take_json, Integration };

use data::{ BackendConfig, HttpManager, HttpResponseConsumer };

const INTERVAL : f64 = 10000.;

struct BlackboxIntegration{}

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
    fn consume(&mut self, req: XmlHttpRequest) {
        let res = self.try_consume(req);
        if let Err(s) = res {
            console!("bad response from debug endpoint (don't worry): {}",s);
        }
    }
}

// XXX get rid when we have a proper scheduler
struct BlackboxSenderImpl {
    last_sent: Option<f64>
}

impl BlackboxSenderImpl {
    fn new() -> BlackboxSenderImpl {
        BlackboxSenderImpl {
            last_sent: None
        }
    }

    fn try_send(&mut self, http_manager: &HttpManager, config: &BackendConfig) -> Result<(),String> {
        let data = blackbox_take_json();
        let debug_url = config.get_debug_url().as_ref().ok_or("no debug endpoint specified".to_string())?;
        console!("blackbox send {:?} to {:?}",data,debug_url);
        let xhr = XmlHttpRequest::new();
        xhr.open("POST",&debug_url.as_str()).map_err(|e| e.to_string())?;
        xhr.set_request_header("Content-Type", "application/json").map_err(|e| e.to_string())?;
        xhr.set_response_type(XhrResponseType::ArrayBuffer).map_err(|e| e.to_string())?;
        let consumer = Box::new(BlackBoxResponseConsumer{});
        http_manager.add_request(xhr,Some(data.to_string().as_bytes()),consumer);
        Ok(())
    }

    pub fn send(&mut self, http_manager: &HttpManager, config: &BackendConfig, now: f64) {
        if self.last_sent.map(|prev| now-prev > INTERVAL).unwrap_or(true) {
            self.last_sent = Some(now);
            let res = self.try_send(http_manager,config);
            if let Err(s) = res {
                console!("bad send to debug endpoint (don't worry): {}",s);
            }
        }
    }
}

#[derive(Clone)]
pub struct BlackboxSender(Arc<Mutex<BlackboxSenderImpl>>);

impl BlackboxSender {
    pub fn new() -> BlackboxSender {
        blackbox_integration(BlackboxIntegration{});
        BlackboxSender(Arc::new(Mutex::new(BlackboxSenderImpl::new())))
    }

    pub fn send(&mut self, http_manager: &HttpManager, config: &BackendConfig, now: f64) {
        ok!(self.0.lock()).send(http_manager,config,now);
    }
}
