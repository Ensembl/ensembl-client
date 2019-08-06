use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use itertools::Itertools;
use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use tánaiste::Value;
use url::Url;

use super::{ 
    XferClerk, XferConsumer, XferRequest, XferCache, XferUrlBuilder,
    HttpResponseConsumer, HttpManager, BackendConfig
};
use super::jsonxferresponse::parse_jsonxferresponse_str;
use composit::source::CatalogueCode;

use super::backendconfig::BackendBytecode;

struct XferPaceManagerImpl {
    limit: i32,
    underway: i32
}

impl XferPaceManagerImpl {
    pub fn new(limit: i32) -> XferPaceManagerImpl {
        XferPaceManagerImpl {
            limit, underway: 0
        }
    }
    
    pub fn preflight(&mut self) -> bool {
        if self.underway < self.limit {
            self.underway += 1;
            true
        } else {
            false
        }
    }
    
    pub fn land(&mut self) {
        self.underway -= 1;
    }
}

#[derive(Clone)]
struct XferPaceManager(Arc<Mutex<XferPaceManagerImpl>>);

impl XferPaceManager {
    pub fn new(limit: i32) -> XferPaceManager {
        XferPaceManager(Arc::new(Mutex::new(XferPaceManagerImpl::new(limit))))
    }
    
    pub fn preflight(&self) -> bool {
        self.0.lock().unwrap().preflight()
    }
    
    pub fn land(&mut self) {
        self.0.lock().unwrap().land();
    }
}

struct PendingXferRequest {
    consumer: Box<XferConsumer>
}

impl PendingXferRequest {
    fn go(&mut self, bytecode: Rc<BackendBytecode>, data: Vec<Value>) {
        self.consumer.consume(bytecode,data);
    }
}

struct PendingXferBatch {
    config: BackendConfig,
    requests: HashMap<CatalogueCode,Vec<PendingXferRequest>>,
    pace: XferPaceManager,
    base: Url,
    cache: XferCache
}

impl PendingXferBatch {
    pub fn new(config: &BackendConfig, base: &Url, pace: &XferPaceManager, cache: &XferCache) -> PendingXferBatch {
        PendingXferBatch {
            config: config.clone(),
            requests: HashMap::new(),
            pace: pace.clone(),
            base: base.clone(),
            cache: cache.clone()
        }
    }
    
    pub fn add_request(&mut self, key: &CatalogueCode, consumer: Box<XferConsumer>) {
        self.requests.entry(key.clone()).or_insert_with(|| {
            Vec::<PendingXferRequest>::new()
        }).push(PendingXferRequest {
            consumer
        });
    }

    pub fn empty(&self) -> bool { self.requests.len() == 0 }

    pub fn fire(self, http_manager: &mut HttpManager) {
        let mut url = self.base.clone();
        let mut url_builder = XferUrlBuilder::new();
        for key in self.requests.keys() {
            url_builder.add(key);
        }
        {
            let mut path = url.path_segments_mut().unwrap();
            path.push(&url_builder.emit());
        }
        let xhr = XmlHttpRequest::new();
        xhr.set_response_type(XhrResponseType::ArrayBuffer);
        xhr.open("GET",&url.as_str());
        http_manager.add_request(xhr,None,Box::new(self));
    }
}

impl HttpResponseConsumer for PendingXferBatch {
    fn consume(&mut self, req: XmlHttpRequest) {
        let value : ArrayBuffer = ok!(req.raw_response().try_into());
        let value : TypedArray<u8> = value.into();
        let data = ok!(String::from_utf8(value.to_vec()));
        for resp in parse_jsonxferresponse_str(&data) {
            if let Some(mut requests) = self.requests.remove(&resp.key) {
                let bytecode = ok!(self.config.get_bytecode(&resp.codename)).clone();
                let recv = (resp.codename,resp.values);
                self.cache.put(&resp.key,recv.clone());
                for mut req in requests.drain(..) {
                    req.go(bytecode.clone(),recv.1.clone());
                }
            }
        }
        self.pace.land();
    }
}

struct XferBatchScheduler {
    config: BackendConfig,
    http_manager: HttpManager,
    cache: XferCache,
    url: Url,
    batch: Option<PendingXferBatch>,
    prime_batch: Option<PendingXferBatch>,
    pace: XferPaceManager    
}

impl XferBatchScheduler {
    pub fn new(config: &BackendConfig, http_manager: &HttpManager, cache: &XferCache, 
               url: &Url, pace: i32) -> XferBatchScheduler {
        XferBatchScheduler {
            config: config.clone(),
            http_manager: http_manager.clone(),
            cache: cache.clone(),
            url: url.clone(),
            batch: None,
            prime_batch: None,
            pace: XferPaceManager::new(pace),
        }
    }
    
    fn set_batch(&mut self) {
        self.batch = Some(PendingXferBatch::new(&self.config,&self.url,&self.pace,&self.cache));
    }
    
    pub fn tick(&mut self) -> bool {
        if !self.batch.as_ref().unwrap().empty() && self.pace.preflight() {
            let batch = self.batch.take().unwrap();
            batch.fire(&mut self.http_manager);
            self.set_batch();
            true
        } else {
            false
        }
    }
    
    pub fn add_request(&mut self, key: &CatalogueCode, consumer: Box<XferConsumer>) {
        if let Some(ref mut batch) = self.batch {
            batch.add_request(&key,consumer);
        }
    }
}

pub struct HttpXferClerkImpl {
    http_manager: HttpManager,
    config: Option<BackendConfig>,
    base: Url,
    paused: Vec<(XferRequest,Box<XferConsumer>)>,
    batch: Option<XferBatchScheduler>,
    prime_batch: Option<XferBatchScheduler>,
    cache: XferCache
}

impl HttpXferClerkImpl {
    pub fn new(http_manager: &HttpManager, base: &Url, xfercache: &XferCache) -> HttpXferClerkImpl {
        HttpXferClerkImpl {
            http_manager: http_manager.clone(),
            config: None,
            base: base.clone(),
            paused: Vec::<(XferRequest,Box<XferConsumer>)>::new(),
            batch: None,
            prime_batch: None,
            cache: xfercache.clone()
        }
    }

    pub fn tick(&mut self) -> bool {
        let mut any = false;
        if let Some(ref mut batch) = self.batch {
            any |= batch.tick();
        }
        if let Some(ref mut batch) = self.prime_batch {
            any |= batch.tick();
        }
        any
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        let url = self.base.join(bc.get_data_url()).ok().unwrap();        
        self.config = Some(bc.clone());
        self.batch = Some(XferBatchScheduler::new(&bc,&self.http_manager,&self.cache,&url,5));
        self.prime_batch = Some(XferBatchScheduler::new(&bc,&self.http_manager,&self.cache,&url,1));
        self.batch.as_mut().unwrap().set_batch();
        self.prime_batch.as_mut().unwrap().set_batch();
        /* run requests accumulated during startup */
        let paused : Vec<(XferRequest,Box<XferConsumer>)> = self.paused.drain(..).collect();
        for (request,consumer) in paused {
            self.run_request(request,consumer,false);
        }
    }
    
    fn fix_key(&self, in_: &CatalogueCode) -> CatalogueCode {
        let mut out = in_.clone();
        if out.wire != "ff" {
            out.focus = None;
        }
        out
    }

    pub fn run_request(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>, prime: bool) {
        let key = CatalogueCode::try_new(&self.config.as_ref().unwrap(),request.get_purchase_order());
        if let Some(key) = key {
            let key = self.fix_key(&key);
            if let Some(recv) = self.cache.get(&key) {
                let bytecode = {
                    let cfg = self.config.as_ref().unwrap().clone();
                    ok!(cfg.get_bytecode(&recv.0)).clone()
                };
                consumer.consume(bytecode,recv.1);
            } else {
                let batch = if prime { &mut self.prime_batch } else { &mut self.batch };
                if let Some(ref mut batch) = batch {
                    batch.add_request(&key,consumer);
                }
            }
        } else {
            consumer.consume(Rc::new(BackendBytecode::noop()),vec!{});
        }
    }
    
    pub fn get_base(&self) -> &Url { &self.base }
}

impl XferClerk for HttpXferClerkImpl {
    fn satisfy(&mut self, request: XferRequest, consumer: Box<XferConsumer>) {
        if self.batch.is_some() {
            let prime = request.get_prime();
            self.run_request(request,consumer,prime);
        } else {
            self.paused.push((request,consumer));
        }
    }
}

#[derive(Clone)]
pub struct HttpXferClerk(Rc<RefCell<HttpXferClerkImpl>>);

impl HttpXferClerk {
    pub fn new(http_manager: &HttpManager, config: &BackendConfig, base: &Url, xfercache: &XferCache) -> HttpXferClerk {
        let mut out = HttpXferClerk(Rc::new(RefCell::new(
            HttpXferClerkImpl::new(http_manager,&base,xfercache))));
        out.set_config(config.clone());
        out
    }

    pub fn set_config(&mut self, bc: BackendConfig) {
        self.0.borrow_mut().set_config(bc);
    }
    
    pub fn tick(&mut self) -> bool {
        self.0.borrow_mut().tick()
    }
}

impl XferClerk for HttpXferClerk {
    fn satisfy(&mut self, request: XferRequest, consumer: Box<XferConsumer>) {
        self.0.borrow_mut().satisfy(request,consumer);
    }
}

