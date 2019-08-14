use std::collections::HashMap;
use composit::AllLandscapes;
use controller::global::WindowState;
use data::{ BackendConfig, UnpackedProductConsumer };
use super::{ DeliveredItem, UnpackedSubassembly, UnpackedSubassemblyConsumer, UnpackedProduct};
use model::supply::Subassembly;
use model::train::TravellerId;
use tácode::{ Tácode, run_tánaiste_makeshapes };

pub struct ItemUnpacker {
    delivered_item: DeliveredItem,
    scheduled: HashMap<TravellerId,Box<UnpackedSubassemblyConsumer>>,
    unpacked_item: UnpackedProduct
}

impl ItemUnpacker {
    pub fn new(delivered_item: DeliveredItem) -> ItemUnpacker {
        ItemUnpacker {
            delivered_item: delivered_item,
            scheduled: HashMap::new(),
            unpacked_item: UnpackedProduct::new()
        }
    }

    pub fn schedule(&mut self, t: &TravellerId, ic: Box<UnpackedSubassemblyConsumer>) {
        self.scheduled.insert(t.clone(),ic);
    }

    pub fn unpack(mut self, window: &mut WindowState) {
        for t in self.scheduled.keys() {
            let sa = t.get_subassembly();
            let leaf = t.get_carriage_id().get_leaf();
            self.unpacked_item.add_subassembly(sa,UnpackedSubassembly::new(&leaf));
        }
        let mut unpacked = self.unpacked_item.clone();
        let delivery = self.delivered_item.clone();
        run_tánaiste_makeshapes(window,Box::new(self), &mut unpacked, &delivery);
    }
}

impl UnpackedProductConsumer for ItemUnpacker {
    fn consume(&mut self, item: UnpackedProduct) {
        let traveller_ids : Vec<TravellerId> = self.scheduled.keys().cloned().collect();
        for t in &traveller_ids {
            let sa = t.get_subassembly();
            if let Some(contents) = self.unpacked_item.get_contents(sa) {
                let consumer = &mut self.scheduled.get_mut(&t).unwrap();
                consumer.consume(contents.borrow().clone());
            }
            
        }
    }
}