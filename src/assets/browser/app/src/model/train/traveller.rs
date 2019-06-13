use std::fmt;
use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::sync::{ Arc, Mutex };

use composit::{ Leaf, ActiveSource };
use composit::{ StateManager };
use model::driver::PrinterManager;
use super::{ TravellerResponse, TravellerResponseData };

pub struct TravellerImpl {
    comp: ActiveSource,
    prev_value: bool,
    cur_value: bool,
    srr: Option<Box<TravellerResponse>>,
    part: Option<String>,
    leaf: Leaf,
    data: TravellerResponseData
}

impl TravellerImpl {
    fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf, srr: Box<TravellerResponse>) -> TravellerImpl {
        TravellerImpl {
            prev_value: false,
            cur_value: false,
            leaf: leaf.clone(),
            part: part.clone(),
            comp,
            srr: Some(srr),
            data: TravellerResponseData::new()
        }
    }
    
    fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        cb(&mut self.data)
    }
    
    fn update_state(&mut self, m: &StateManager) -> bool {
        self.prev_value = self.cur_value;
        self.cur_value = self.comp.is_on(m,&self.part);
        self.srr.as_ref().unwrap().set_state(self.cur_value);
        self.prev_value != self.cur_value
    }

    fn is_done(&self) -> bool { 
        return self.srr.as_ref().unwrap().check();
    }
}

pub struct Traveller(Arc<Mutex<TravellerImpl>>);

impl Traveller {
    pub fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf, srr: Box<TravellerResponse>) -> Traveller {
        Traveller(Arc::new(Mutex::new(TravellerImpl::new(comp,part,leaf,srr))))
    }
    
    pub(in super) fn update_state(&mut self, m: &StateManager) -> bool {
        self.0.lock().unwrap().update_state(m)
    }
    
    pub(in super) fn is_done(&self) -> bool {
        self.0.lock().unwrap().is_done()
    }
    
    pub fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        self.0.lock().unwrap().update_data(cb);
    }
}

impl Drop for TravellerImpl {
    fn drop(&mut self) {
        self.srr.take().unwrap().destroy();
    }
}


impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let t = self.0.lock().unwrap();
        write!(f,"{:?}:{:?}({:?})",t.comp,t.leaf,t.part)
    }
}
