use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ Component, StateValue, StateFixed, Stick, Source, ComponentSource };
use controller::global::App;
use controller::input::{ Event, events_run };
use debug::testcards::text::text_source;
use debug::testcards::leafcard::leafcard_source;
use debug::testcards::debugsource::{ DebugSource, DebugStickManager };

fn debug_source() -> DebugSource {
    let mut s = DebugSource::new();
    s.add_stick("text",Box::new(text_source()));
    s.add_stick("leaf",Box::new(leafcard_source(true)));
    s.add_stick("ruler",Box::new(leafcard_source(false)));
    s
}

pub fn debug_stick_manager() -> DebugStickManager {
    let mut s = DebugStickManager::new();
    s.add_stick("text",1000000000,false);
    s.add_stick("leaf",1000000000,false);
    s.add_stick("ruler",1000000000,false);
    s
}

pub fn testcard_base(a: &mut App, stick_name: &str) {
    console!("tcb");
    events_run(a,vec! {
        Event::AddComponent("internal:debug-main".to_string()),
        Event::SetStick(stick_name.to_string())
    });
}

pub fn component_debug_main(name: &str) -> Component {
    let cs = debug_source();
    Component::new(name,Box::new(cs),Rc::new(StateFixed(StateValue::On())))    
}

pub struct DebugComponentSource {
}

impl DebugComponentSource {
    pub fn new() -> DebugComponentSource {
        DebugComponentSource {}
    }
}

impl ComponentSource for DebugComponentSource {
    fn get_component(&mut self, name: &str) -> Option<Component> {
        match name {
            "internal:debug-main" => Some(component_debug_main(name)),
            _ => None
        }
    }
}
