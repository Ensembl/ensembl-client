use model::supply::UnpackedItem;

pub trait UnpackedItemConsumer {
    fn consume(&mut self, ui: UnpackedItem);
}

use std::collections::HashMap;
use model::supply::Subassembly;
use model::train::Traveller;

pub struct XxxUnpackedItemConsumer {
    travellers: HashMap<Subassembly,Traveller>
}

impl XxxUnpackedItemConsumer {
    pub fn new(travellers: HashMap<Subassembly,Traveller>) -> XxxUnpackedItemConsumer {
        XxxUnpackedItemConsumer {
            travellers: travellers.clone()
        }
    }
}

impl UnpackedItemConsumer for XxxUnpackedItemConsumer {
    fn consume(&mut self, item: UnpackedItem) {
        for kv in self.travellers.iter_mut() {
            if let Some(data) = item.get_contents(kv.0) {
                kv.1.set_contents(data.clone());
            }
        }
    }
}