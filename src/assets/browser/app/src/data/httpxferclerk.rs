use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use controller::global::WindowState;
use itertools::Itertools;
use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use tánaiste::Value;
use url::Url;

use super::{ 
    XferClerk, XferConsumer, XferCache, XferUrlBuilder,
    HttpResponseConsumer, HttpManager, BackendConfig
};
use super::jsonxferresponse::parse_jsonxferresponse_str;
use model::supply::{ PurchaseOrder, ProductList };

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
    window: WindowState,
    requests: HashMap<PurchaseOrder,Vec<PendingXferRequest>>,
    pace: XferPaceManager,
    base: Url,
    cache: XferCache
}

impl PendingXferBatch {
    pub fn new(window: &WindowState, base: &Url, pace: &XferPaceManager, cache: &XferCache) -> PendingXferBatch {
        PendingXferBatch {
            window: window.clone(),
            requests: HashMap::new(),
            pace: pace.clone(),
            base: base.clone(),
            cache: cache.clone()
        }
    }
    
    pub fn add_request(&mut self, key: &PurchaseOrder, consumer: Box<XferConsumer>) {
        self.requests.entry(key.clone()).or_insert_with(|| {
            Vec::<PendingXferRequest>::new()
        }).push(PendingXferRequest {
            consumer
        });
    }

    pub fn empty(&self) -> bool { self.requests.len() == 0 }

    pub fn fire(mut self, http_manager: &mut HttpManager) {
        let mut url = self.base.clone();
        let mut url_builder = XferUrlBuilder::new();
        for key in self.requests.keys() {
            url_builder.add(&mut self.window,key);
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
        for resp in parse_jsonxferresponse_str(&mut self.window,&data) {
            if let Some(mut requests) = self.requests.remove(&resp.purchase_order) {
                let bytecode = ok!(self.window.get_backend_config().get_bytecode(&resp.codename)).clone();
                let recv = (resp.codename,resp.values);
                self.cache.put(&resp.purchase_order,recv.clone());
                for mut req in requests.drain(..) {
                    req.go(bytecode.clone(),recv.1.clone());
                }
            }
        }
        self.pace.land();
    }
}

struct XferBatchScheduler {
    window: WindowState,
    http_manager: HttpManager,
    cache: XferCache,
    url: Url,
    batch: Option<PendingXferBatch>,
    prime_batch: Option<PendingXferBatch>,
    pace: XferPaceManager    
}

impl XferBatchScheduler {
    pub fn new(window: &WindowState, http_manager: &HttpManager, cache: &XferCache, 
               url: &Url, pace: i32) -> XferBatchScheduler {
        XferBatchScheduler {
            window: window.clone(),
            http_manager: http_manager.clone(),
            cache: cache.clone(),
            url: url.clone(),
            batch: None,
            prime_batch: None,
            pace: XferPaceManager::new(pace),
        }
    }
    
    fn set_batch(&mut self) {
        self.batch = Some(PendingXferBatch::new(&self.window,&self.url,&self.pace,&self.cache));
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
    
    pub fn add_request(&mut self, key: &PurchaseOrder, consumer: Box<XferConsumer>) {
        if let Some(ref mut batch) = self.batch {
            batch.add_request(&key,consumer);
        }
    }
}

pub struct HttpXferClerkImpl {
    http_manager: HttpManager,
    config: Option<BackendConfig>,
    base: Url,
    paused: Vec<(PurchaseOrder,Box<XferConsumer>)>,
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
            paused: Vec::new(),
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

    pub fn set_window_state(&mut self, window: &mut WindowState) {
        let config = window.get_backend_config();
        let url = self.base.join(config.get_data_url()).ok().unwrap();        
        self.config = Some(config.clone());
        self.batch = Some(XferBatchScheduler::new(&window,&self.http_manager,&self.cache,&url,5));
        self.prime_batch = Some(XferBatchScheduler::new(&window,&self.http_manager,&self.cache,&url,1));
        self.batch.as_mut().unwrap().set_batch();
        self.prime_batch.as_mut().unwrap().set_batch();
        /* run requests accumulated during startup */
        let paused : Vec<(PurchaseOrder,Box<XferConsumer>)> = self.paused.drain(..).collect();
        for (request,consumer) in paused {
            self.run_request(&request,consumer,false);
        }
    }
    
    pub fn run_request(&mut self, po: &PurchaseOrder, mut consumer: Box<XferConsumer>, prime: bool) {
        if let Some(recv) = self.cache.get(po) {
            let bytecode = {
                let cfg = self.config.as_ref().unwrap().clone();
                ok!(cfg.get_bytecode(&recv.0)).clone()
            };
            consumer.consume(bytecode,recv.1);
        } else {
            let batch = if prime { &mut self.prime_batch } else { &mut self.batch };
            if let Some(ref mut batch) = batch {
                batch.add_request(po,consumer);
            }
        }
    }
    
    pub fn get_base(&self) -> &Url { &self.base }
}

impl XferClerk for HttpXferClerkImpl {
    fn satisfy(&mut self, po: &PurchaseOrder, prime: bool, consumer: Box<XferConsumer>) {
        if self.batch.is_some() {
            self.run_request(po,consumer,prime);
        } else {
            self.paused.push((po.clone(),consumer));
        }
    }
}

#[derive(Clone)]
pub struct HttpXferClerk(Rc<RefCell<HttpXferClerkImpl>>);

impl HttpXferClerk {
    pub fn new(http_manager: &HttpManager,base: &Url, xfercache: &XferCache) -> HttpXferClerk {
        let mut out = HttpXferClerk(Rc::new(RefCell::new(
            HttpXferClerkImpl::new(http_manager,&base,xfercache))));
        out
    }

    pub fn set_window_state(&mut self, window: &mut WindowState) {
        self.0.borrow_mut().set_window_state(window);
    }
    
    pub fn tick(&mut self) -> bool {
        self.0.borrow_mut().tick()
    }
}

impl XferClerk for HttpXferClerk {
    fn satisfy(&mut self, po: &PurchaseOrder, prime: bool, consumer: Box<XferConsumer>) {
        self.0.borrow_mut().satisfy(po,prime,consumer);
    }
}

