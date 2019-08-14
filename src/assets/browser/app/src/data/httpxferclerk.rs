use std::cell::RefCell;
use std::collections::{ HashMap, HashSet };
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
use super::parsedelivereditem::parse_delivereditem;
use model::item::{ DeliveredItem, ItemUnpacker };
use model::supply::{ PurchaseOrder, ProductList, Supplier };
use model::train::TrainManager;

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

struct PendingXferBatch {
    window: WindowState,
    requests: HashSet<PurchaseOrder>,
    pace: XferPaceManager,
    base: Url,
    cache: XferCache
}

impl PendingXferBatch {
    pub fn new(window: &WindowState, base: &Url, pace: &XferPaceManager, cache: &XferCache) -> PendingXferBatch {
        PendingXferBatch {
            window: window.clone(),
            requests: HashSet::new(),
            pace: pace.clone(),
            base: base.clone(),
            cache: cache.clone()
        }
    }
    
    pub fn add_request(&mut self, key: &PurchaseOrder) {
        self.requests.insert(key.clone());
    }

    pub fn empty(&self) -> bool { self.requests.len() == 0 }

    pub fn fire(mut self, http_manager: &mut HttpManager) {
        let mut url = self.base.clone();
        let mut url_builder = XferUrlBuilder::new();
        for key in &self.requests {
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
        let mut train_manager = self.window.get_train_manager().clone();
        for item in parse_delivereditem(&mut self.window,&data).drain(..) {
            let mut unpacker = ItemUnpacker::new(item.clone());
            train_manager.consume(&item,&mut unpacker);
            unpacker.unpack(&mut self.window);
            self.cache.put(item);
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
    
    pub fn add_request(&mut self, key: &PurchaseOrder) {
        if let Some(ref mut batch) = self.batch {
            batch.add_request(key);
        }
    }
}

pub struct HttpXferClerkImpl {
    window: Option<WindowState>,
    http_manager: HttpManager,
    base: Url,
    paused: Vec<(PurchaseOrder,Box<XferConsumer>)>,
    batch: Option<XferBatchScheduler>,
    prime_batch: Option<XferBatchScheduler>,
    cache_finds: Vec<DeliveredItem>,
    cache: XferCache
}

impl HttpXferClerkImpl {
    pub fn new(http_manager: &HttpManager, base: &Url, xfercache: &XferCache, train_manager: &TrainManager) -> HttpXferClerkImpl {
        HttpXferClerkImpl {
            window: None,
            http_manager: http_manager.clone(),
            base: base.clone(),
            paused: Vec::new(),
            batch: None,
            prime_batch: None,
            cache_finds: Vec::new(),
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
        let mut train_manager = self.window.as_mut().unwrap().get_train_manager().clone();
        for item in self.cache_finds.drain(..) {
            let mut unpacker = ItemUnpacker::new(item.clone());
            train_manager.consume(&item,&mut unpacker);
            unpacker.unpack(self.window.as_mut().unwrap());
            any = true;
        }
        any
    }

    pub fn set_window_state(&mut self, window: &mut WindowState) {
        let config = window.get_backend_config();
        let url = self.base.join(config.get_data_url()).ok().unwrap();
        self.window = Some(window.clone());
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
    
    fn run_request(&mut self, po: &PurchaseOrder, mut consumer: Box<XferConsumer>, prime: bool) {
        if let Some(item) = self.cache.get(po) {
            self.cache_finds.push(item.clone());
        } else {
            let batch = if prime { &mut self.prime_batch } else { &mut self.batch };
            if let Some(ref mut batch) = batch {
                batch.add_request(po);
            }
        }
    }
    
    pub fn get_base(&self) -> &Url { &self.base }

    fn supply(&mut self, purchase_order: PurchaseOrder) {
        let tm = self.window.as_mut().unwrap().get_train_manager().clone();
        self.satisfy(&purchase_order,false,Box::new(tm));
    }
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
    pub fn new(http_manager: &HttpManager,base: &Url, xfercache: &XferCache, train_manager: &TrainManager) -> HttpXferClerk {
        let mut out = HttpXferClerk(Rc::new(RefCell::new(
            HttpXferClerkImpl::new(http_manager,&base,xfercache,train_manager))));
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

impl Supplier for HttpXferClerk {
    fn supply(&self, purchase_order: PurchaseOrder) {
        self.0.borrow_mut().supply(purchase_order);
    }
}
