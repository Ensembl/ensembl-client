use std::rc::Rc;
use std::cell::RefCell;

use tánaiste::Value;

use composit::Leaf;
use model::supply::{ DeliveredItem, PurchaseOrder, Product, RequestedRegion };
use data::{ BackendConfig, BackendBytecode, XferClerk, XferConsumer };

use misc_algorithms::store::Cache;

struct XferPrimeConsumer();
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, item: &DeliveredItem) {}
}

pub struct XferCacheImpl {
    cache: Cache<PurchaseOrder,DeliveredItem>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        XferCacheImpl {
            cache: Cache::new(size)
        }
    }
    
    pub fn put(&mut self, key: &PurchaseOrder, values: DeliveredItem) {
        self.cache.put(key,values);
    }
    
    pub fn get(&mut self, key: &PurchaseOrder) -> Option<DeliveredItem> {
        self.cache.get(key).cloned()
    }    
}

#[derive(Clone)]
pub struct XferCache(Rc<RefCell<XferCacheImpl>>,BackendConfig);

impl XferCache {
    pub fn new(size: usize, config: &BackendConfig) -> XferCache {
        XferCache(Rc::new(RefCell::new(XferCacheImpl::new(size))),config.clone())
    }

    pub fn put(&mut self, key: &PurchaseOrder, values: DeliveredItem) {
        self.0.borrow_mut().put(key,values);
    }
    
    pub fn get(&mut self, key: &PurchaseOrder) -> Option<DeliveredItem> {
        self.0.borrow_mut().get(key)
    }
    
    pub fn prime(&mut self, xferclerk: &mut XferClerk, product: &Product, leaf: &Leaf) {
        let po = PurchaseOrder::new(product,&RequestedRegion::Leaf(leaf.clone()),&None);
        if self.get(&po).is_none() {
            xferclerk.satisfy(&po,true,Box::new(XferPrimeConsumer()));
        }
    }
}
