use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use url::Url;

use super::{ 
    XferClerk, XferConsumer, XferRequest, XferResponse, 
    HttpResponseConsumer, xfer_marshal, HttpManager, BackendConfig
};

struct PendingDataRequest {
    code: String,
    request: Option<XferRequest>,
    consumer: Box<XferConsumer>
}

impl HttpResponseConsumer for PendingDataRequest {
    fn consume(&mut self, req: XmlHttpRequest) {
        let value : ArrayBuffer = req.raw_response().try_into().ok().unwrap();
        let value : TypedArray<u8> = value.into();
        let mut data = xfer_marshal(value.to_vec());
        let xfrr = XferResponse::new(self.request.take().unwrap(),self.code.clone(),data);
        self.consumer.consume(xfrr);
    }
}

struct HttpXferConfigConsumer {
    clerk: HttpXferClerk
}

impl HttpResponseConsumer for HttpXferConfigConsumer {
    fn consume(&mut self,req: XmlHttpRequest) {
        let value = req.response_text().ok().unwrap().unwrap();
        self.clerk.set_config(BackendConfig::from_json_string(&value).expect("couldn't get remote config"));
    }
}

pub struct HttpXferClerkImpl {
    http_manager: HttpManager,
    remote_backend_config: Option<BackendConfig>,
    base: Url,
    paused: Vec<(XferRequest,Box<XferConsumer>)>
    
}

impl HttpXferClerkImpl {
    pub fn new(http_manager: HttpManager, base: &Url) -> HttpXferClerkImpl {
        HttpXferClerkImpl {
            http_manager: http_manager,
            base: base.clone(),
            remote_backend_config: None,
            paused: Vec::<(XferRequest,Box<XferConsumer>)>::new()
        }
    }    

    fn get_config(&mut self, hxcc: HttpXferConfigConsumer) {
        let xhr = XmlHttpRequest::new();
        xhr.set_response_type(XhrResponseType::Text);
        xhr.open("GET",&self.base.as_str());
        self.http_manager.add_request(xhr,None,Box::new(hxcc));
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        console!("setting BackendConfig");
        self.remote_backend_config = Some(bc);
        let paused : Vec<(XferRequest,Box<XferConsumer>)> = self.paused.drain(..).collect();
        for (request,consumer) in paused {
            console!("running delayed");
            self.run_request(request,consumer);
        }
    }
    
    pub fn run_request(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        let (url,code) = {
            let compo = request.get_source_name();
            let leaf = request.get_leaf().clone();
            let endpoint = self.remote_backend_config.as_ref().unwrap().endpoint_for(compo,&leaf);
            if endpoint.is_err() {
                console!("No data for {:?}: {}",
                            request.get_leaf().clone(),
                            endpoint.unwrap_err());
                consumer.abandon();
                return;
            }
            let endpoint = endpoint.unwrap();
            (endpoint.get_url(),endpoint.get_code())
        };
        let leaf = request.get_leaf().clone();
        if let Some(ref url) = url {
            console!("base={} url={}",self.base,url);
            let mut url = self.base.join(url).ok().unwrap();
            {
                let mut path = url.path_segments_mut().ok().unwrap();
                let leaf_url = format!("{}:{}-{}",leaf.get_stick().get_name(),leaf.get_start(),leaf.get_end());
                path.push(&leaf_url);
            }
            console!("url={}",url);
            //let url = format!("{}:{}-{}",leaf.get_stick().get_name(),leaf.get_start(),leaf.get_end());
            let pdr = PendingDataRequest {
                code: code.to_string(),
                request: Some(request),
                consumer: consumer
            };
            let xhr = XmlHttpRequest::new();
            xhr.set_response_type(XhrResponseType::ArrayBuffer);
            xhr.open("GET",&url.as_str());
            self.http_manager.add_request(xhr,None,Box::new(pdr));
        } else {
            let xrr = XferResponse::new(request,code.to_string(),vec!{});
            consumer.consume(xrr);
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
    pub fn new(http_manager: HttpManager, base: &Url) -> HttpXferClerk {
        let mut out = HttpXferClerk(Rc::new(RefCell::new(HttpXferClerkImpl::new(http_manager,base))));
        out.get_config();
        out
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        self.0.borrow_mut().set_config(bc);
    }

    fn get_config(&mut self) {
        let hxcc = HttpXferConfigConsumer { clerk: self.clone() };
        self.0.borrow_mut().get_config(hxcc);        
    }
}

impl XferClerk for HttpXferClerk {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        self.0.borrow_mut().satisfy(request,consumer);
    }
}
