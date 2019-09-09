use composit::{ Leaf, StateManager };
use data::XferConsumer;
use model::driver::Printer;
use model::item::{ DeliveredItem, ItemUnpacker };
use model::zmenu::{ ZMenuLeaf, ZMenuLeafSet };
use super::{ CarriageId, TrainId, Traveller };

pub struct Carriage {
    travellers: Vec<Traveller>,
    known_done: bool,
    needs_rebuild: bool,
    id: CarriageId
}

impl Carriage {
    pub(in super) fn new(leaf: &Leaf, train_id: &TrainId) -> Carriage {
        let mut out = Carriage {
            travellers: Vec::<Traveller>::new(),
            known_done: false,
            needs_rebuild: false,
            id: CarriageId::new(leaf,train_id)
        };
        out
    }
    
    pub fn get_id(&self) -> &CarriageId { &self.id }

    pub(in super) fn set_needs_refresh(&mut self) {
        self.needs_rebuild = true;
    }
    
    pub(in super) fn add_traveller(&mut self, traveller: Traveller) {
        self.travellers.push(traveller);
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
        self.needs_rebuild = true;
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
            self.needs_rebuild = true;
        }
    }
    
    fn build_zmenu(&self, zml: &mut ZMenuLeaf) {
        for t in &self.travellers {
            t.build_zmenu(zml);
        }
        zml.redrawn();
    }
    
    pub fn redraw_where_needed(&mut self, printer: &mut dyn Printer, zmls: &mut ZMenuLeafSet) {
        let mut zml = ZMenuLeaf::new(&self.id.get_leaf());
        if self.needs_rebuild {
            self.needs_rebuild = false;
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