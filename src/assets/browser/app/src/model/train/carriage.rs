use std::sync::Mutex;
use crate::composit::{ Leaf, StateManager };
use crate::data::XferConsumer;
use crate::model::driver::Printer;
use crate::model::item::{ DeliveredItem, ItemUnpacker };
use crate::model::zmenu::{ ZMenuLeaf, ZMenuLeafSet };
use super::{ CarriageId, TrainId, Traveller };

pub struct Carriage {
    travellers: Vec<Traveller>,
    known_done: bool,
    needs_rebuild: Mutex<bool>,
    id: CarriageId
}

impl Carriage {
    pub(in super) fn new(leaf: &Leaf, train_id: &TrainId) -> Carriage {
        Carriage {
            travellers: Vec::<Traveller>::new(),
            known_done: false,
            needs_rebuild: Mutex::new(true),
            id: CarriageId::new(leaf,train_id)
        }
    }
    
    pub fn get_id(&self) -> &CarriageId { &self.id }

    pub(in super) fn set_needs_refresh(&mut self) {
        *self.needs_rebuild.lock().unwrap() = true;
    }
    
    pub(in super) fn add_traveller(&mut self, traveller: Traveller) {
        self.travellers.push(traveller);
        self.known_done = false;
        self.set_needs_refresh();
    }

    pub(super) fn remove_all_travellers(&mut self) {
        for mut t in self.travellers.drain(..) {
            t.destroy();
        }
    }
        
    pub(in super) fn is_done(&mut self) -> bool {
        if self.known_done { return true; }
        for c in &self.travellers {
            if !c.is_done() { return false; }
        }
        self.known_done = true;
        self.set_needs_refresh();
        return true;
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        let mut redo = false;
        for t in &mut self.travellers {
            if t.update_state(oom) {
                redo = true;
            }
        }
        if redo {
            self.set_needs_refresh();
        }
    }
    
    fn build_zmenu(&self, zml: &mut ZMenuLeaf) {
        for t in &self.travellers {
            t.build_zmenu(zml);
        }
        zml.redrawn();
    }
    
    pub fn redraw_where_needed(&self, printer: &mut dyn Printer, zmls: &mut ZMenuLeafSet) {
        let mut zml = ZMenuLeaf::new(&self.id.get_leaf());
        let mut needs_rebuild = self.needs_rebuild.lock().unwrap();
        if *needs_rebuild {
            *needs_rebuild = false;
            printer.redraw_carriage(&self.id);
            self.build_zmenu(&mut zml);
        }
        zmls.register_leaf(zml);
    }
}

impl XferConsumer for Carriage {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        for traveller in &mut self.travellers {
            traveller.consume(item,unpacker);
        }
    }
}