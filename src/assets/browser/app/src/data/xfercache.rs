use std::rc::Rc;
use std::cell::RefCell;

use tánaiste::Value;

use composit::Leaf;
use composit::source::{ CatalogueCode, PurchaseOrder };
use data::{ BackendConfig, BackendBytecode, XferClerk, XferConsumer };
use util::Cache;

struct XferPrimeConsumer();
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, data: Vec<Value>) {}
    fn abandon(&mut self) {}
}

pub struct XferCacheImpl {
    cache: Cache<CatalogueCode,(String,Vec<Value>)>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        XferCacheImpl {
            cache: Cache::new(size)
        }
    }
    
    pub fn put(&mut self, key: &CatalogueCode, values: (String,Vec<Value>)) {
        self.cache.put(key,values);
    }
    
    pub fn get(&mut self, key: &CatalogueCode) -> Option<(String,Vec<Value>)> {
        self.cache.get(key).cloned()
    }    
}

#[derive(Clone)]
pub struct XferCache(Rc<RefCell<XferCacheImpl>>,BackendConfig);

impl XferCache {
    pub fn new(size: usize, config: &BackendConfig) -> XferCache {
        XferCache(Rc::new(RefCell::new(XferCacheImpl::new(size))),config.clone())
    }

    pub fn put(&mut self, key: &CatalogueCode, values: (String,Vec<Value>)) {
        self.0.borrow_mut().put(key,values);
    }
    
    pub fn get(&mut self, key: &CatalogueCode) -> Option<(String,Vec<Value>)> {
        self.0.borrow_mut().get(key)
    }
    
    pub fn prime(&mut self, xferclerk: &mut Box<XferClerk>, compo: &str, leaf: &Leaf) {
        let po = PurchaseOrder::new(compo,leaf,&None);
        if let Some(key) = CatalogueCode::try_new(&self.1,&po) {
            if self.get(&key).is_none() {
                xferclerk.satisfy(&po,true,Box::new(XferPrimeConsumer()));
            }
        }
    }
}
