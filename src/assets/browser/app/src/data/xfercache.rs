use std::rc::Rc;
use std::cell::RefCell;

use tánaiste::Value;

use composit::Leaf;
use data::{ XferClerk, XferConsumer, XferRequest };
use util::Cache;

struct XferPrimeConsumer(String,String,XferCache);
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, code: String, data: Vec<Value>) {
        console!("primed {},{}",self.0,self.1);
        self.2.put(&self.0,&self.1,data);
    }
    fn abandon(&mut self) {}
}

pub struct XferCacheImpl {
    cache: Cache<(String,String),Vec<Value>>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        XferCacheImpl {
            cache: Cache::new(size)
        }
    }
    
    pub fn put(&mut self, compo: &str, leaf_spec: &str, values: Vec<Value>) {
        self.cache.put(&(compo.to_string(),leaf_spec.to_string()),values);
    }
    
    pub fn get(&mut self, compo: &str, leaf_spec: &str) -> Option<Vec<Value>> {
        self.cache.get(&(compo.to_string(),leaf_spec.to_string()))
    }    
}

#[derive(Clone)]
pub struct XferCache(Rc<RefCell<XferCacheImpl>>);

impl XferCache {
    pub fn new(size: usize) -> XferCache {
        XferCache(Rc::new(RefCell::new(XferCacheImpl::new(size))))
    }

    pub fn put(&mut self, compo: &str, leaf_spec: &str, values: Vec<Value>) {
        self.0.borrow_mut().put(compo,leaf_spec,values);
    }
    
    pub fn get(&mut self, compo: &str, leaf_spec: &str) -> Option<Vec<Value>> {
        self.0.borrow_mut().get(compo,leaf_spec)
    }
    
    pub fn prime(&mut self, xferclerk: &mut Box<XferClerk>, compo: &str, leaf: &Leaf) {
        if self.get(compo,&leaf.get_spec()).is_none() {
            xferclerk.satisfy(XferRequest::new(compo,leaf,true),
                Box::new(XferPrimeConsumer(
                    compo.to_string(),
                    leaf.get_spec(),
                    self.clone()
                )));
        }
    }
}
