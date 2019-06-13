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
    data: Option<TravellerResponseData>
}

impl TravellerImpl {
    fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf) -> TravellerImpl {
        TravellerImpl {
            prev_value: false,
            cur_value: false,
            leaf: leaf.clone(),
            part: part.clone(),
            comp,
            srr: None,
            data: Some(TravellerResponseData::new())
        }
    }
    
    fn set_srr(&mut self, srr: Box<TravellerResponse>) {
        self.srr = Some(srr);
    }
        
    fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        cb(&mut self.data.as_mut().unwrap())
    }
    
    fn update_state(&mut self, m: &StateManager) -> bool {
        self.prev_value = self.cur_value;
        self.cur_value = self.comp.is_on(m,&self.part);
        self.srr.as_ref().unwrap().set_state(self.cur_value);
        self.prev_value != self.cur_value
    }

    fn get_part(&self) -> &Option<String> {
        &self.part
    }

    fn is_done(&self) -> bool { 
        return self.srr.as_ref().unwrap().check();
    }
    
    fn set_response(&mut self) {
        self.srr.as_mut().unwrap().set_response(self.data.take().unwrap());
    }
}

#[derive(Clone)]
pub struct Traveller(Arc<Mutex<TravellerImpl>>);

impl Traveller {
    pub fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf) -> Traveller {
        Traveller(Arc::new(Mutex::new(TravellerImpl::new(comp,part,leaf))))
    }
    
    pub(in super) fn update_state(&mut self, m: &StateManager) -> bool {
        self.0.lock().unwrap().update_state(m)
    }
    
    pub(in super) fn is_done(&self) -> bool {
        self.0.lock().unwrap().is_done()
    }
    
    pub fn set_srr(&mut self, srr: Box<TravellerResponse>) {
        self.0.lock().unwrap().set_srr(srr);
    }
        
    pub fn get_part(&self) -> Option<String> {
        self.0.lock().unwrap().get_part().clone()
    }
    
    pub fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        self.0.lock().unwrap().update_data(cb);
    }
    
    pub fn set_response(&mut self) {
        self.0.lock().unwrap().set_response();
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
