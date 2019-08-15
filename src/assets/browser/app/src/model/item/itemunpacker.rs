use std::collections::HashMap;
use composit::AllLandscapes;
use controller::global::WindowState;
use data::{ BackendConfig, UnpackedProductConsumer };
use super::{ DeliveredItem, UnpackedSubassembly, UnpackedSubassemblyConsumer, UnpackedProduct};
use model::supply::Subassembly;
use model::train::{ TrainContext, TravellerId };
use tácode::{ Tácode, run_tánaiste_makeshapes };

pub struct ItemUnpackerContext {
    scheduled: HashMap<TravellerId,Box<UnpackedSubassemblyConsumer>>,
    unpacked_item: UnpackedProduct
}

impl ItemUnpackerContext {
    pub fn new() -> ItemUnpackerContext {
        ItemUnpackerContext {
            scheduled: HashMap::new(),
            unpacked_item: UnpackedProduct::new()
        }
    }

    pub fn schedule(&mut self, t: &TravellerId, ic: Box<UnpackedSubassemblyConsumer>) {
        self.scheduled.insert(t.clone(),ic);
    }

    pub fn unpack(mut self, delivered_item: &DeliveredItem, context: TrainContext, window: &mut WindowState) {
        for t in self.scheduled.keys() {
            let sa = t.get_subassembly();
            let leaf = t.get_carriage_id().get_leaf();
            self.unpacked_item.add_subassembly(sa,UnpackedSubassembly::new(&leaf));
        }
        let mut unpacked = self.unpacked_item.clone();
        let delivery = delivered_item.clone();
        run_tánaiste_makeshapes(window,Box::new(self), &mut unpacked, &delivery, &context);
    }
}

impl UnpackedProductConsumer for ItemUnpackerContext {
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

pub struct ItemUnpacker {
    delivered_item: DeliveredItem,
    contexts: HashMap<TrainContext,ItemUnpackerContext>
}

impl ItemUnpacker {
    pub fn new(delivered_item: DeliveredItem) -> ItemUnpacker {
        ItemUnpacker {
            delivered_item,
            contexts: HashMap::new()
        }
    }

    pub fn schedule(&mut self, t: &TravellerId, ic: Box<UnpackedSubassemblyConsumer>) {
        let context = t.get_carriage_id().get_train_id().get_context();
        let context_up = self.contexts.entry(context.clone()).or_insert_with(|| ItemUnpackerContext::new());
        context_up.schedule(t,ic);
    }

    pub fn unpack(mut self, window: &mut WindowState) {
        for (context,context_up) in self.contexts.drain() {
            context_up.unpack(&self.delivered_item,context,window);
        }
    }
}
