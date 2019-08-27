use std::collections::{ HashMap, HashSet };

use composit::{ Leaf, StateManager };
use data::XferConsumer;
use model::item::{ DeliveredItem, ItemUnpacker };
use model::stage::Position;
use model::supply::Product;
use model::driver::{ Printer, PrinterManager };
use super::{ Carriage, CarriageId, TrainId, TravellerCreator };
use model::zmenu::ZMenuLeafSet;

const MAX_FLANK : i32 = 3;

pub struct Train {
    pm: PrinterManager,
    carriages: HashMap<Leaf,Carriage>,
    id: TrainId,
    position: Position,
    active: bool
}

impl Train {
    pub fn new(pm: &PrinterManager, train_id: &TrainId, position: &Position) -> Train {
        Train {
            pm: pm.clone(),
            id: train_id.clone(),
            carriages: HashMap::<Leaf,Carriage>::new(),
            active: true,
            position: position.clone()
        }
    }
    
    /* *****************************************************************
     * Methods for TRAINMANAGER to call when the user changes something.
     * *****************************************************************
     */
    
    pub fn get_train_id(&self) -> &TrainId { &self.id }
    pub fn get_position(&self) -> &Position { &self.position }
    pub fn get_position_mut(&mut self) -> &mut Position { &mut self.position }

    fn middle_leaf(&self) -> i64 {
        (self.position.get_middle().0 / self.id.get_scale().total_bp()).floor() as i64
    }

    /* are we active (ie should we scan around as the user does?) */
    pub(in super) fn set_active(&mut self, yn: bool) {
        self.active = yn;
    }
        
    /* add component to leaf */
    pub fn add_component(&mut self, cm: &mut TravellerCreator, product: &mut Product) {
        for leaf in self.leafs() {
            let c = self.get_carriage(&leaf);
            for trav in cm.make_travellers_for_source(product,&leaf,&c.get_id()) {
                c.add_traveller(trav.clone());
            }
        }
        for c in self.carriages.values_mut() {
            c.set_needs_refresh();
        }
    }

    /* *****************************************************************
     * manage_leafs is called by COMPOSITOR on a tick if we've moved to 
     * allow leafs to scroll in and out of view, and by TRAINMANAGER on
     * creating new scales. Adds and removes carriages corresponging to 
     * the relevant leafs.
     * *****************************************************************
     */

    /* flank to use taking into account train status */
    fn true_flank(&self) -> i32 {
        let ideal_flank = (self.position.get_screen_in_bp() / self.id.get_scale().total_bp()) as i32;
        ideal_flank.min(MAX_FLANK).max(1)
    }

    fn get_carriage(&mut self, leaf: &Leaf) -> &mut Carriage {
        if !self.carriages.contains_key(&leaf) {
            let train_id = self.id.clone();
            let c = Carriage::new(&leaf,&train_id);
            self.pm.add_carriage(&c.get_id());
            self.carriages.insert(leaf.clone(),c);
        }
        self.carriages.get_mut(leaf).unwrap()
    }

    /* make leafs to be added */
    fn get_missing_leafs(&mut self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        let flank = self.true_flank();
        for idx in -flank..flank+1 {
            let hindex = self.middle_leaf() + idx as i64;
            let leaf = Leaf::new(&self.id.get_stick(),hindex,&self.id.get_scale());
            if !self.carriages.contains_key(&leaf) {
                out.push(leaf);
            }
        }
        out
    }
    
    /* remove leafs out of scope */
    fn remove_unused_carriages(&mut self) {
        let mut doomed = HashSet::new();
        let flank = self.true_flank();
        for leaf in self.carriages.keys() {
            if (leaf.get_index()-self.middle_leaf()).abs() > flank as i64 {
                doomed.insert(leaf.clone());
            }
        }
        for d in doomed {
            if let Some(mut c) = self.carriages.remove(&d) {
                c.remove_all_travellers();
                self.pm.remove_carriage(c.get_id());
            }
        }
    }

    /* manage_leafs entry point */
    pub fn manage_carriages(&mut self, cm: &mut TravellerCreator) {
        if !self.active { return; }
        self.remove_unused_carriages();
        for leaf in self.get_missing_leafs() {
            let c = self.get_carriage(&leaf);
            for trav in cm.make_travellers_for_leaf(&leaf,&c.get_id()) {
                c.add_traveller(trav);
            }
        }
    }

    /* ***********************************************************
     * Aggregate information about our carriages for TRAINMANAGER.
     * ***********************************************************
     */
        
    /* used by TRAINMANAGER to generate all_printing_leafs for printer,
     * and by PRINTER to work out what needs preparing.
     */
    pub fn leafs(&self) -> Vec<Leaf> {
        let mut out = Vec::<Leaf>::new();
        for leaf in self.carriages.keys() {
            out.push(leaf.clone());
        }
        out
    }

    pub fn get_carriage_ids(&self) -> impl Iterator<Item=&CarriageId> {
        self.carriages.values().map(|x| x.get_id())
    }
    
    /* Are all the carriages done? */
    pub(in super) fn check_done(&mut self) -> bool {
        for c in self.carriages.values_mut() {
            if !c.is_done() { return false; }
        }
        return true;
    }
        
    pub fn get_carriages(&mut self) -> Vec<&mut Carriage> {
        self.carriages.values_mut().collect()
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        for c in self.carriages.values_mut() {
            c.update_state(oom);
        }
    }

    pub fn set_needs_refresh(&mut self) {
        for c in self.carriages.values_mut() {
            c.set_needs_refresh();
        }
    }

    pub fn redraw_where_needed(&mut self, printer: &mut dyn Printer, zmls: &mut ZMenuLeafSet) {
        for carriage in self.carriages.values_mut() {
            carriage.redraw_where_needed(printer,zmls);
        }
    }

}

impl XferConsumer for Train {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        for carriage in self.carriages.values_mut() {
            carriage.consume(item,unpacker);
        }
    }
}