use std::fmt;
use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::sync::{ Arc, Mutex };

use composit::Leaf;
use composit::{ StateManager };
use model::supply::Subassembly;
use model::driver::PrinterManager;
use model::shape::{ ShapeSpec, GenericShape };
use model::zmenu::ZMenuLeaf;
use super::{ TravellerResponse, TravellerResponseData };

pub struct TravellerImpl {
    sa: Subassembly,
    prev_value: bool,
    cur_value: bool,
    visuals: Option<Box<TravellerResponse>>,
    leaf: Leaf,
    data: Option<TravellerResponseData>,
    zml: ZMenuLeaf
}

impl TravellerImpl {
    fn new(sa: &Subassembly, leaf: &Leaf) -> TravellerImpl {
        TravellerImpl {
            prev_value: false,
            cur_value: false,
            leaf: leaf.clone(),
            sa: sa.clone(),
            visuals: None,
            data: Some(TravellerResponseData::new()),
            zml: ZMenuLeaf::new(leaf)
        }
    }
    
    pub fn replace(&mut self) -> TravellerImpl {
        TravellerImpl {
            sa: self.sa.clone(),
            prev_value: self.prev_value,
            cur_value: self.cur_value,
            visuals: None,
            leaf: self.leaf.clone(),
            data: Some(TravellerResponseData::new()),
            zml: ZMenuLeaf::new(&self.leaf)
        }
    }

    fn set_visuals(&mut self, visuals: Box<TravellerResponse>) {
        self.visuals = Some(visuals);
    }
        
    fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        cb(&mut self.data.as_mut().unwrap())
    }
    
    pub fn update_zml<F>(&mut self, cb: F) where F: FnOnce(&mut ZMenuLeaf) {
        cb(&mut self.zml);
    }
    
    fn update_state(&mut self, m: &StateManager) -> bool {
        self.prev_value = self.cur_value;
        self.cur_value = self.sa.is_on(m);
        unwrap!(self.visuals.as_ref()).set_state(self.cur_value);
        self.prev_value != self.cur_value
    }

    fn get_subassembly(&self) -> &Subassembly {
        &self.sa
    }

    fn build_zmenu(&mut self, zml: &mut ZMenuLeaf) {
        if self.cur_value {
            zml.merge(&mut self.zml);
        }
    }

    fn is_done(&self) -> bool { 
        return unwrap!(self.visuals.as_ref()).check();
    }
    
    fn create_zmenu(&mut self) {
        for shape in self.data.as_ref().unwrap().get_shapes() {
            if let Some((id,zbox)) = shape.zmenu_box() {
                self.zml.add_box(&id,self.sa.get_product().get_product_name(),&zbox);
            }
        }
    }
    
    fn set_response(&mut self) {
        self.create_zmenu();
        self.visuals.as_mut().unwrap().set_response(self.data.take().unwrap());
    }    
}

#[derive(Clone)]
pub struct Traveller(Arc<Mutex<TravellerImpl>>);

impl Traveller {
    pub fn new(sa: &Subassembly, leaf: &Leaf) -> Traveller {
        Traveller(Arc::new(Mutex::new(TravellerImpl::new(sa,leaf))))
    }
    
    pub(in super) fn update_state(&mut self, m: &StateManager) -> bool {
        self.0.lock().unwrap().update_state(m)
    }
    
    pub(in super) fn is_done(&self) -> bool {
        self.0.lock().unwrap().is_done()
    }
    
    pub fn set_visuals(&mut self, visuals: Box<TravellerResponse>) {
        self.0.lock().unwrap().set_visuals(visuals);
    }
        
    pub fn get_subassembly(&self) -> Subassembly {
        self.0.lock().unwrap().get_subassembly().clone()
    }
    
    pub fn build_zmenu(&self, zml: &mut ZMenuLeaf) {
        self.0.lock().unwrap().build_zmenu(zml);
    }
    
    pub fn update_data<F>(&mut self, cb: F) where F: FnOnce(&mut TravellerResponseData) {
        self.0.lock().unwrap().update_data(cb);
    }

    pub fn update_zml<F>(&mut self, cb: F) where F: FnOnce(&mut ZMenuLeaf) {
        self.0.lock().unwrap().update_zml(cb);
    }
    
    pub fn set_response(&mut self) {
        self.0.lock().unwrap().set_response();
    }

    pub fn replace(&self) -> Traveller {
        Traveller(Arc::new(Mutex::new(self.0.lock().unwrap().replace())))
    }
}

impl Drop for TravellerImpl {
    fn drop(&mut self) {
        self.visuals.take().unwrap().destroy();
    }
}


impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let t = self.0.lock().unwrap();
        write!(f,"{:?}:{:?}",t.sa,t.leaf)
    }
}
