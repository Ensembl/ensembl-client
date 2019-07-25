use std::rc::Rc;
use std::cell::RefCell;

use tánaiste::Value;

use composit::Leaf;
use data::{ BackendConfig, BackendBytecode, XferClerk, XferConsumer, XferRequest };
use util::Cache;

use super::xferrequest::XferRequestKey;

struct XferPrimeConsumer(String,String,String,XferCache);
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, data: Vec<Value>) {}
    fn abandon(&mut self) {}
}

pub struct XferCacheImpl {
    cache: Cache<XferRequestKey,(String,Vec<Value>)>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        XferCacheImpl {
            cache: Cache::new(size)
        }
    }
    
    pub fn put(&mut self, key: &XferRequestKey, values: (String,Vec<Value>)) {
        self.cache.put(key,values);
    }
    
    pub fn get(&mut self, key: &XferRequestKey) -> Option<(String,Vec<Value>)> {
        self.cache.get(key).cloned()
    }    
}

#[derive(Clone)]
pub struct XferCache(Rc<RefCell<XferCacheImpl>>,BackendConfig);

impl XferCache {
    pub fn new(size: usize, config: &BackendConfig) -> XferCache {
        XferCache(Rc::new(RefCell::new(XferCacheImpl::new(size))),config.clone())
    }

    pub fn put(&mut self, key: &XferRequestKey, values: (String,Vec<Value>)) {
        self.0.borrow_mut().put(key,values);
    }
    
    pub fn get(&mut self, key: &XferRequestKey) -> Option<(String,Vec<Value>)> {
        self.0.borrow_mut().get(key)
    }
    
    pub fn prime(&mut self, xferclerk: &mut Box<XferClerk>, compo: &str, leaf: &Leaf) {
        let wire = self.1.get_track(compo)
                        .and_then(|x| x.get_wire().as_ref())
                        .map(|x| x.to_string());
        if let Some(wire) = wire {
            let (short_stick,short_pane) = leaf.get_short_spec();
            let key = XferRequestKey::new(&wire,&short_stick,&short_pane);
            if self.get(&key).is_none() {
                xferclerk.satisfy(XferRequest::new(compo,leaf,true),
                    Box::new(XferPrimeConsumer(
                        wire.to_string(),
                        short_stick,
                        short_pane,
                        self.clone()
                    )));
            }
        }
    }
}
