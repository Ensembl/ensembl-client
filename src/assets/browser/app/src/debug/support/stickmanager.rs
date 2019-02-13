/* In the test-cards, every testcard is a separate stick */

use std::collections::HashMap;

use composit::{ Stick, StickManager };

struct DebugStickManager {
    sticks: HashMap<String,Stick>
}

impl DebugStickManager {
    fn new() -> DebugStickManager {
        DebugStickManager {
            sticks: HashMap::<String,Stick>::new()
        }
    }
    
    fn add_stick(&mut self, name: &str, size: u64, circular: bool) {
        self.sticks.insert(name.to_string(),Stick::new(&name,size,circular));
    }    
}

impl StickManager for DebugStickManager {
    fn get_stick(&mut self, name: &str) -> Option<Stick> {
        self.sticks.get(name).map(|x| x.clone())
    }    
}

pub fn debug_stick_manager() -> impl StickManager {
    let mut s = DebugStickManager::new();
    s.add_stick("polar",17000000,false);
    s.add_stick("text", 17000000,false);
    s.add_stick("leaf", 17000000,false);
    s.add_stick("ruler",17000000,false);
    s.add_stick("button",17000000,false);
    s.add_stick("tácode",17000000,false);
    s
}
