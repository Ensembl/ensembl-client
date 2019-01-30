use std::collections::HashMap;

use composit::{ Source, SourceResponse, Leaf, Stick, StickManager };

pub struct DebugSource {
    sources: HashMap<String,Box<Source>>
}

impl DebugSource {
    pub fn new() -> DebugSource {
        DebugSource {
            sources: HashMap::<String,Box<Source>>::new()
        }
    }
    
    pub fn add_stick(&mut self, name: &str, source: Box<Source>) {
        let name = name.to_string();
        self.sources.insert(name.clone(),source);
    }
}

impl Source for DebugSource {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        if let Some(source) = self.sources.get(&stick_name) {
            source.populate(lc,leaf);
        } else {
            lc.done(0);
        }
    }
}

pub struct DebugStickManager {
    sticks: HashMap<String,Stick>
}

impl DebugStickManager {
    pub fn new() -> DebugStickManager {
        DebugStickManager {
            sticks: HashMap::<String,Stick>::new()
        }
    }
    
    pub fn add_stick(&mut self, name: &str, size: u64, circular: bool) {
        self.sticks.insert(name.to_string(),Stick::new(&name,size,circular));
    }    
}

impl StickManager for DebugStickManager {
    fn get_stick(&mut self, name: &str) -> Option<Stick> {
        self.sticks.get(name).map(|x| x.clone())
    }
}
