use commander::Agent;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{XmlHttpRequest, XhrResponseType };
use url::Url;
use crate::util::API_VERSION;

use super::{ BackendConfig, HttpManager, HttpResponseConsumer };

pub struct BackendConfigBootstrapImpl {
    config: Option<BackendConfig>,
    callbacks: Vec<Box<dyn Fn(&BackendConfig,&Agent)>>
}

impl BackendConfigBootstrapImpl {
    fn new() -> BackendConfigBootstrapImpl {
        BackendConfigBootstrapImpl {
            config: None,
            callbacks: Vec::new()
        }
    }
    
    fn add_callback(&mut self, cb: Box<dyn Fn(&BackendConfig,&Agent)>) {
        self.callbacks.push(cb)
    }
}

impl HttpResponseConsumer for BackendConfigBootstrapImpl {
    fn consume(&mut self, req: XmlHttpRequest, agent: &Agent) {
        let value = req.response_text().ok().unwrap().unwrap();
        let backend = BackendConfig::from_json_string(&value).expect("couldn't get remote config");
        for cb in self.callbacks.drain(..) {
            cb(&backend,&agent);
        }
    }
}

#[derive(Clone)]
pub struct BackendConfigBootstrap(Rc<RefCell<BackendConfigBootstrapImpl>>,Url);

impl BackendConfigBootstrap {
    pub fn new(http_manager: &HttpManager, base: &Url, callback: Box<dyn Fn(&BackendConfig,&Agent)>) -> BackendConfigBootstrap {
        let mut imp = BackendConfigBootstrapImpl::new();
        imp.add_callback(callback);
        let out = BackendConfigBootstrap(Rc::new(RefCell::new(imp)),base.clone());
        let xhr = XmlHttpRequest::new();
        xhr.set_response_type(XhrResponseType::Text);
        let mut base = base.clone();
        ok!(base.path_segments_mut()).push(&API_VERSION.to_string());
        xhr.open("GET",&base.as_str());
        http_manager.add_request(xhr,None,Box::new(out.clone()));
        out
    }
        
    pub fn get_base(&self) -> &Url { &self.1 }
}

impl HttpResponseConsumer for BackendConfigBootstrap {
    fn consume(&mut self, req: XmlHttpRequest, agent: &Agent) {
        self.0.borrow_mut().consume(req,agent);
    }
}
