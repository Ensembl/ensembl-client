use composit::{ SourceManager, ActiveSource };
use debug::support::{ component_debug_main, component_debug_sub };
use tácode::Tácode;

pub struct DebugSourceManager {
    tc: Tácode
}

impl DebugSourceManager {
    pub fn new(tc: &Tácode) -> DebugSourceManager {
        DebugSourceManager {
            tc: tc.clone()
        }
    }
}

impl SourceManager for DebugSourceManager {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource> {
        match name {
            "internal:debug-main" => Some(component_debug_main(&self.tc,name)),
            "internal:debug-even" => Some(component_debug_sub(name,true)),
            "internal:debug-odd" => Some(component_debug_sub(name,false)),
            _ => None
        }
    }
}

