use std::rc::Rc;
use std::cell::RefCell;

use composit::Leaf;
use model::item::{ DeliveredItem, DeliveredItemId, FocusSpecificity, ItemUnpacker };
use model::supply::{ PurchaseOrder, Product };
use data::{ BackendConfig, XferClerk, XferConsumer };

use misc_algorithms::index::{ AndWalker, OrWalker, SimpleIndex, WalkerIter };
use misc_algorithms::store::Cache;

struct XferPrimeConsumer();
impl XferConsumer for XferPrimeConsumer {
    fn consume(&mut self, item: &DeliveredItem, _unpacker: &mut ItemUnpacker) {}
}

pub struct XferCacheIndexes {
    product_index: SimpleIndex<Product>,
    leaf_index: SimpleIndex<Leaf>,
    focus_index: SimpleIndex<FocusSpecificity>
}

impl XferCacheIndexes {
    fn new() -> XferCacheIndexes {
        XferCacheIndexes {
            product_index: SimpleIndex::new(),
            leaf_index: SimpleIndex::new(),
            focus_index: SimpleIndex::new()
        }
    }

    pub fn put(&mut self, id: &DeliveredItemId, row: usize) {
        self.product_index.add(id.get_product().clone(),row);
        self.leaf_index.add(id.get_leaf().clone(),row);
        self.focus_index.add(id.get_focus_specificity().clone(),row);
    }

    pub fn remove(&mut self, id: &DeliveredItemId, row: usize) {
        self.product_index.remove(id.get_product(),row);
        self.leaf_index.remove(id.get_leaf(),row);
        self.focus_index.remove(id.get_focus_specificity(),row);
    }

    pub fn find(&self, po: &PurchaseOrder) -> impl Iterator<Item=usize> {
        let product_walker = self.product_index.walker(po.get_product());
        let leaf_walker = self.leaf_index.walker(po.get_leaf());
        let focus_specific_walker = self.focus_index.walker(&FocusSpecificity::Specific(po.get_focus().clone()));
        let focus_agnostic_walker = self.focus_index.walker(&FocusSpecificity::Agnostic);
        let focus_walker = OrWalker::new(vec![focus_agnostic_walker,focus_specific_walker]);
        let walker = AndWalker::new(vec![product_walker,leaf_walker,focus_walker]);
        WalkerIter::new(walker)
    }
}

pub struct XferCacheImpl {
    cache: Cache<DeliveredItemId,DeliveredItem>,
    indexes: Rc<RefCell<XferCacheIndexes>>
}

impl XferCacheImpl {
    pub fn new(size: usize) -> XferCacheImpl {
        let mut cache = Cache::new(size);
        let indexes = Rc::new(RefCell::new(XferCacheIndexes::new()));
        let indexes_twin = indexes.clone();
        cache.set_dropper(Box::new(move |row,item : DeliveredItem| {
            let id = item.get_id().clone();
            indexes_twin.borrow_mut().remove(&id,row);
        }));
        XferCacheImpl { cache, indexes }
    }
    
    pub fn put(&mut self, item: DeliveredItem) {
        let id = item.get_id().clone();
        let row = self.cache.put(&id.clone(),item);
        self.indexes.borrow_mut().put(&id,row);
    }
    
    pub fn get(&mut self, po: &PurchaseOrder) -> Option<DeliveredItem> {
        if let Some(row) = self.indexes.borrow().find(po).next() {
            if let Some(item) = self.cache.get_row(row) {
                return Some(item.clone());
            }
        }
        return None;
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
    
    pub fn prime(&mut self, xferclerk: &mut dyn XferClerk, product: &Product, leaf: &Leaf) {
        let po = PurchaseOrder::new(product,leaf,&None);
        if self.get(&po).is_none() {
            if !po.get_product().get_focus_dependent() {
                xferclerk.satisfy(&po,true,Box::new(XferPrimeConsumer()));
            }
        }
    }
}
