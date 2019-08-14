use std::fmt;
use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::sync::{ Arc, Mutex };

use composit::Leaf;
use composit::{ StateManager };
use controller::global::WindowState;
use data::XferConsumer;
use model::item::{ DeliveredItem, UnpackedSubassembly, UnpackedSubassemblyConsumer, ItemUnpacker };
use model::supply::Subassembly;
use model::driver::{ DriverTraveller, Printer, PrinterManager };
use model::shape::{ ShapeSpec, GenericShape };
use model::zmenu::ZMenuLeaf;
use tácode::run_tánaiste_makeshapes;
use super::{ CarriageId, TravellerId };

pub struct TravellerImpl {
    window: WindowState,
    done: bool,
    prev_value: bool,
    cur_value: bool,
    visuals: Option<Box<DriverTraveller>>,
    zml: ZMenuLeaf,
    id: TravellerId
}

impl TravellerImpl {
    fn new(window: &WindowState, sa: &Subassembly, leaf: &Leaf, carriage_id: &CarriageId) -> TravellerImpl {
        TravellerImpl {
            window: window.clone(),
            done: false,
            prev_value: false,
            cur_value: false,
            visuals: None,
            zml: ZMenuLeaf::new(leaf),
            id: TravellerId::new(carriage_id,sa)
        }
    }
    
    fn set_driver_traveller(&mut self, visuals: Box<DriverTraveller>) {
        self.visuals = Some(visuals);
    }
            
    fn update_state(&mut self, m: &StateManager) -> bool {
        self.prev_value = self.cur_value;
        let sa = self.id.get_subassembly();
        self.cur_value = sa.get_product().get_subassembly_state(&sa,m);
        unwrap!(self.visuals.as_ref()).set_state(self.cur_value);
        self.prev_value != self.cur_value
    }

    fn build_zmenu(&mut self, zml: &mut ZMenuLeaf) {
        if self.cur_value {
            zml.merge(&self.zml);
        }
    }

    fn is_done(&self) -> bool { self.done }
    
    fn set_contents(&mut self, mut data: UnpackedSubassembly) {
        let product = self.id.get_subassembly().get_product().clone();
        data.create_zmenu(&product);
        self.zml = data.get_zmenu_leaf().clone();
        self.visuals.as_mut().unwrap().set_contents(&data);
        self.done = true;
    }

    fn get_id(&self) -> TravellerId {
        self.id.clone()
    }

    fn get_window(&mut self) -> &WindowState { &self.window }
}

#[derive(Clone)]
pub struct Traveller(Arc<Mutex<TravellerImpl>>);

impl Traveller {
    pub fn new(pm: &mut PrinterManager, window: &WindowState, sa: &Subassembly, leaf: &Leaf, carriage_id: &CarriageId) -> Traveller {
        let mut traveller = Traveller(Arc::new(Mutex::new(TravellerImpl::new(window,sa,leaf,carriage_id))));
        traveller.set_driver_traveller(pm.make_driver_traveller(&traveller.get_id()));
        traveller
    }
    
    pub fn get_id(&self) -> TravellerId {
        self.0.lock().unwrap().get_id()
    }

    pub(in super) fn update_state(&mut self, m: &StateManager) -> bool {
        self.0.lock().unwrap().update_state(m)
    }
    
    pub(in super) fn is_done(&self) -> bool {
        self.0.lock().unwrap().is_done()
    }
    
    fn set_driver_traveller(&mut self, visuals: Box<DriverTraveller>) {
        self.0.lock().unwrap().set_driver_traveller(visuals);
    }
        
    pub fn build_zmenu(&self, zml: &mut ZMenuLeaf) {
        self.0.lock().unwrap().build_zmenu(zml);
    }        
}

impl Drop for TravellerImpl {
    fn drop(&mut self) {
        self.visuals.take().unwrap().destroy();
    }
}

impl XferConsumer for Traveller {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        let trav_id = self.0.lock().unwrap().get_id().clone();
        let item_id = item.get_id();
        let mut window = self.0.lock().unwrap().get_window().clone();
        if item_id.get_leaf() == trav_id.get_carriage_id().get_leaf() && trav_id.get_subassembly().get_product() == item_id.get_product() {
            unpacker.schedule(&trav_id,Box::new(self.clone()));
        }
    }
}

impl UnpackedSubassemblyConsumer for Traveller {
    fn consume(&mut self, data: UnpackedSubassembly) {
        self.0.lock().unwrap().set_contents(data);
    }
}

impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let t = self.0.lock().unwrap();
        write!(f,"{:?}",t.get_id())
    }
}
