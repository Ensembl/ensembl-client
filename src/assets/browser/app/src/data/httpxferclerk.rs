use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use tánaiste::Value;
use url::Url;

use super::{ 
    XferClerk, XferConsumer, XferRequest,
    HttpResponseConsumer, HttpManager, BackendConfig,
    BackendConfigBootstrap
};

use super::backendconfig::BackendBytecode;

struct PendingXferRequest {
    code: String,
    consumer: Box<XferConsumer>
}

impl PendingXferRequest {
    fn go(&mut self, recv: Vec<Value>) {
        self.consumer.consume(self.code.clone(),recv);
    }
}

struct PendingXferBatch {
    requests: HashMap<(String,String),Vec<PendingXferRequest>>,
    base: Url
}

impl PendingXferBatch {
    pub fn new(base: &Url) -> PendingXferBatch {
        PendingXferBatch {
            requests: HashMap::<(String,String),Vec<PendingXferRequest>>::new(),
            base: base.clone()
        }
    }
    
    pub fn add_request(&mut self, name: &str, leaf_spec: &str,
                       code: &str, consumer: Box<XferConsumer>) {
        let key = (name.to_string(),leaf_spec.to_string());
        self.requests.entry(key).or_insert_with(|| {
            Vec::<PendingXferRequest>::new()
        }).push(PendingXferRequest {
            code: code.to_string(),
            consumer
        });
    }    

    pub fn fire(self, http_manager: &mut HttpManager) {
        let mut url = self.base.clone();
        for (name,leaf_spec) in self.requests.keys() {
            let mut qp = url.query_pairs_mut();
            let part = format!("{}/{}",name,leaf_spec);
            qp.append_pair("parts",&part);
        }        
        let xhr = XmlHttpRequest::new();
        xhr.set_response_type(XhrResponseType::ArrayBuffer);
        xhr.open("GET",&url.as_str());
        http_manager.add_request(xhr,None,Box::new(self));
    }

    fn marshal(&mut self, data: &SerdeValue) -> Vec<Value> {
        let mut out = Vec::<Value>::new();
        for val in data.as_array().unwrap() {
            let mut row = Vec::<f64>::new();
            if val.is_array() {
                for cell in val.as_array().unwrap() {
                    if cell.is_f64() {
                        row.push(cell.as_f64().unwrap());
                    } else if cell.is_i64() {
                        row.push(cell.as_i64().unwrap() as f64);
                    } else if cell.is_boolean() {
                        row.push(if cell.as_bool().unwrap() { 1. } else { 0. } );
                    }
                }
                out.push(Value::new_from_float(row));
            } else if val.is_string() {
                out.push(Value::new_from_string(val.as_str().unwrap().to_string()));
            }            
        }
        out
    }
}

impl HttpResponseConsumer for PendingXferBatch {
    fn consume(&mut self, req: XmlHttpRequest) {
        let value : ArrayBuffer = req.raw_response().try_into().ok().unwrap();
        let value : TypedArray<u8> = value.into();
        let data = String::from_utf8(value.to_vec()).ok().unwrap();
        let data : SerdeValue = serde_json::from_str(&data).ok().unwrap();
        for resp in data.as_array().unwrap() {
            let key = (resp[0].as_str().unwrap().to_string(),
                       resp[1].as_str().unwrap().to_string());
            if let Some(mut requests) = self.requests.remove(&key) {
                let mut recv = self.marshal(&resp[2]);
                if requests.len() > 1 {
                    for mut req in requests.drain(..) {
                        req.go(recv.clone());
                    }
                } else {
                    requests.remove(0).go(recv);
                }
            }
        }
    }
}

pub struct HttpXferClerkImpl {
    http_manager: HttpManager,
    remote_backend_config: Option<BackendConfig>,
    base: Url,
    paused: Vec<(XferRequest,Box<XferConsumer>)>,
    batch_in_prep: Option<PendingXferBatch>
}

impl HttpXferClerkImpl {
    pub fn new(http_manager: &HttpManager, base: &Url) -> HttpXferClerkImpl {
        let mut out = HttpXferClerkImpl {
            http_manager: http_manager.clone(),
            remote_backend_config: None,
            base: base.clone(),
            paused: Vec::<(XferRequest,Box<XferConsumer>)>::new(),
            batch_in_prep: None
        };
        out
    }

    fn set_batch(&mut self) {
        let bc = self.remote_backend_config.as_ref().unwrap();
        let mut url = self.base.join(bc.get_data_url()).ok().unwrap();
        self.batch_in_prep = Some(PendingXferBatch::new(&url));
    }

    pub fn tick(&mut self) {
        self.batch_in_prep.take().unwrap().fire(&mut self.http_manager);
        self.set_batch();
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        console!("setting BackendConfig");
        self.remote_backend_config = Some(bc);
        self.set_batch();
        let paused : Vec<(XferRequest,Box<XferConsumer>)> = self.paused.drain(..).collect();
        for (request,consumer) in paused {
            console!("running delayed");
            self.run_request(request,consumer);
        }
    }
    
    pub fn run_request(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        let leaf = request.get_leaf().clone();
        let (name,code) = {
            let compo = request.get_source_name();
            let leaf = request.get_leaf().clone();
            let cfg =  self.remote_backend_config.as_ref().unwrap().clone();
            let endpoint = cfg.endpoint_for(compo,&leaf).clone();
            if endpoint.is_err() {
                console!("No data for {:?}: {}",
                            request.get_leaf().clone(),
                            endpoint.unwrap_err());
                consumer.abandon();
                return;
            }
            let endpoint = endpoint.as_ref().unwrap();
            (endpoint.get_url().map(|x| x.to_string().clone()),endpoint.get_code().clone())
        };
        let bc = self.remote_backend_config.as_ref().unwrap().clone();
        if let Some(name) = name {
            let mut url = self.base.join(bc.get_data_url()).ok().unwrap();
            {
                let mut qp = url.query_pairs_mut();
                let part = format!("{}/{}",name,leaf.get_spec());
                qp.append_pair("parts",&part);
            }
            self.batch_in_prep.as_mut().unwrap().add_request(&name,&leaf.get_spec(),&code.to_string(),consumer);
            self.tick();
        } else {
            consumer.consume(code.to_string(),vec!{});
        }
    }
    
    pub fn get_base(&self) -> &Url { &self.base }
}

impl XferClerk for HttpXferClerkImpl {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        if self.remote_backend_config.is_some() {
            self.run_request(request,consumer);
        } else {
            self.paused.push((request,consumer));
        }
    }
}

#[derive(Clone)]
pub struct HttpXferClerk(Rc<RefCell<HttpXferClerkImpl>>);

impl HttpXferClerk {
    pub fn new(http_manager: &HttpManager, config: &BackendConfig, base: &Url) -> HttpXferClerk {
        let mut out = HttpXferClerk(Rc::new(RefCell::new(
            HttpXferClerkImpl::new(http_manager,&base))));
        out.set_config(config.clone());
        out
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        self.0.borrow_mut().set_config(bc);
    }
    
    pub fn tick(&mut self) {
        self.0.borrow_mut().tick();
    }
}

impl XferClerk for HttpXferClerk {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        self.0.borrow_mut().satisfy(request,consumer);
    }
}
