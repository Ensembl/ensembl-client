use std::collections::HashMap;

use composit::{ Source, LCBuilder, Leaf };

pub struct StickSource {
    sources: HashMap<String,Box<Source>>
}

impl StickSource {
    pub fn new() -> StickSource {
        StickSource {
            sources: HashMap::<String,Box<Source>>::new()
        }
    }
    
    pub fn add_source(&mut self, name: &str, source: Box<Source>) {
        self.sources.insert(name.to_string(),source);
    }
}

impl Source for StickSource {
    fn populate(&self, lc: &mut LCBuilder, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        self.sources[&stick_name].populate(lc,leaf);
    }
}
