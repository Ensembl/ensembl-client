use std::rc::Rc;
use std::cell::RefCell;

use tánaiste::Value;

use composit::Leaf;
use model::item::{ DeliveredItem, DeliveredItemId, ItemUnpacker };
use model::supply::{ PurchaseOrder, Product, RequestedRegion };
use data::{ BackendConfig, BackendBytecode, XferClerk, XferConsumer };

use misc_algorithms::store::Cache;

struct XferPrimeConsumer();
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, item: &DeliveredItem, _unpacker: &mut ItemUnpacker) {}
}

pub struct XferCacheImpl {
    cache: Cache<DeliveredItemId,DeliveredItem>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        XferCacheImpl {
            cache: Cache::new(size)
        }
    }
    
    pub fn put(&mut self, item: DeliveredItem) {
        self.cache.put(&item.get_id().clone(),item);
    }
    
    pub fn get(&mut self, key: &PurchaseOrder) -> Option<DeliveredItem> {
        self.cache.get(&key.xxx_make_delivered_item_id()).cloned()
    }    
}

#[derive(Clone)]
pub struct XferCache(Rc<RefCell<XferCacheImpl>>,BackendConfig);

impl XferCache {
    pub fn new(size: usize, config: &BackendConfig) -> XferCache {
        XferCache(Rc::new(RefCell::new(XferCacheImpl::new(size))),config.clone())
    }

    pub fn put(&mut self, item: DeliveredItem) {
        self.0.borrow_mut().put(item);
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
