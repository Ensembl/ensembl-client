use std::collections::HashMap;

use composit::{ Source, LCBuilder, Leaf, Stick, StickManager };

pub struct StickSource {
    sources: HashMap<String,Box<Source>>,
    sticks: HashMap<String,Stick>
}

impl StickSource {
    pub fn new() -> StickSource {
        StickSource {
            sources: HashMap::<String,Box<Source>>::new(),
            sticks: HashMap::<String,Stick>::new()
        }
    }
    
    pub fn add_stick(&mut self, name: &str, size: u64, circular: bool, 
                     source: Box<Source>) {
        let name = name.to_string();
        self.sources.insert(name.clone(),source);
        self.sticks.insert(name.clone(),Stick::new(&name,size,circular));
    }
}

impl Source for StickSource {
    fn populate(&self, lc: &mut LCBuilder, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        self.sources[&stick_name].populate(lc,leaf);
    }
}

impl StickManager for StickSource {
    fn get_stick(&mut self, name: &str) -> Stick {
        self.sticks[name].clone()
    }
}
