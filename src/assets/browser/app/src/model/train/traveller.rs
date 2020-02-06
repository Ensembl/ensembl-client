use std::fmt;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::Leaf;
use composit::{ StateManager };
use data::XferConsumer;
use model::item::{ DeliveredItem, DeliveredItemId, FocusSpecificity, UnpackedSubassembly, UnpackedSubassemblyConsumer, ItemUnpacker };
use model::supply::Subassembly;
use model::driver::{ DriverTraveller, Printer, PrinterManager };
use model::zmenu::ZMenuLeaf;
use super::{ CarriageId, TravellerId };

pub struct TravellerImpl {
    done: bool,
    prev_value: bool,
    cur_value: bool,
    visuals: Box<dyn DriverTraveller>,
    zml: ZMenuLeaf,
    id: Rc<TravellerId>
}

impl TravellerImpl {
    fn new(pm: &mut PrinterManager, sa: &Subassembly, leaf: &Leaf, carriage_id: &CarriageId) -> TravellerImpl {
        let id = Rc::new(TravellerId::new(carriage_id,sa));
        let visuals = pm.make_driver_traveller(&id);
        TravellerImpl {
            done: false,
            prev_value: false,
            cur_value: false,
            visuals, id,
            zml: ZMenuLeaf::new(leaf)
        }
    }
                
    fn update_state(&mut self, m: &StateManager) -> bool {
        self.prev_value = self.cur_value;
        let sa = self.id.get_subassembly();
        self.cur_value = sa.get_product().get_subassembly_state(&sa,m);
        self.visuals.set_state(self.cur_value);
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
        self.visuals.set_contents(&data);
        self.done = true;
    }

    fn get_id(&self) -> Rc<TravellerId> {
        self.id.clone()
    }

    fn matches_delivered_item(&self, di: &DeliveredItemId) -> bool {
        if di.get_leaf() != self.id.get_carriage_id().get_leaf() { return false; }
        if di.get_product() != self.id.get_subassembly().get_product() { return false; }
        match di.get_focus_specificity() {
            FocusSpecificity::Agnostic => true,
            FocusSpecificity::Specific(focus) => self.id.get_carriage_id().get_train_id().get_context().get_focus() == focus
        }
    }

    fn destroy(&mut self) {
        self.visuals.destroy();
    }
}

#[derive(Clone)]
pub struct Traveller(Arc<Mutex<TravellerImpl>>);

impl Traveller {
    pub fn new(pm: &mut PrinterManager, sa: &Subassembly, leaf: &Leaf, carriage_id: &CarriageId) -> Traveller {
        Traveller(Arc::new(Mutex::new(TravellerImpl::new(pm,sa,leaf,carriage_id))))
    }
    
    pub fn get_id(&self) -> Rc<TravellerId> {
        ok!(self.0.lock()).get_id()
    }

    pub(in super) fn update_state(&mut self, m: &StateManager) -> bool {
        ok!(self.0.lock()).update_state(m)
    }
    
    pub(in super) fn is_done(&self) -> bool {
        ok!(self.0.lock()).is_done()
    }
            
    pub fn build_zmenu(&self, zml: &mut ZMenuLeaf) {
        ok!(self.0.lock()).build_zmenu(zml);
    }

    pub fn destroy(&mut self) {
        ok!(self.0.lock()).destroy();
    }

    fn matches_delivered_item(&self, di: &DeliveredItemId) -> bool {
        ok!(self.0.lock()).matches_delivered_item(di)
    }
}

impl XferConsumer for Traveller {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        if self.is_done() { return; }
        let trav_id = ok!(self.0.lock()).get_id().clone();
        if self.matches_delivered_item(item.get_id()) {
            unpacker.schedule(&trav_id,Box::new(self.clone()));
        }
    }
}

impl UnpackedSubassemblyConsumer for Traveller {
    fn consume(&mut self, data: UnpackedSubassembly) {
        ok!(self.0.lock()).set_contents(data);
    }
}

impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let t = self.0.lock().unwrap();
        write!(f,"{:?}",t.get_id())
    }
}
