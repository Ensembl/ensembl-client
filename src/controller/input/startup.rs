use std::collections::HashMap;
use std::sync::{ Arc, Mutex };

use stdweb::web::{ Element, HtmlElement, IHtmlElement, INode };
use stdweb::traits::IEvent;


use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ Event, events_run };
use controller::input::physics::MousePhysics;
use debug::setup_stage_debug;
use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use dom::event;
use types::Dot;

pub struct StartupEventListener {
}

impl StartupEventListener {
    pub fn new() -> StartupEventListener {
        StartupEventListener {
        }
    }    
}

impl EventListener<()> for StartupEventListener {
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::CustomEvent(_,cx,name,data) => {
                match name.as_ref() {
                    "bpane-activate" => {
                        // no-op for now
                        console!("Activate browser");
                    },
                    "bpane-debugger" => {
                        console!("Start debugger");
                        setup_stage_debug();
                    },
                    _ => ()
                }
            },
            _ => ()
        }
        
        console!("hi! e={:?}",e.context().target().node_name());
    }
}

pub fn register_startup_events() {
    let uel = StartupEventListener::new();
    let mut ec_start = EventControl::new(Box::new(uel),());
    ec_start.add_event(EventType::CustomEvent("bpane-activate".to_string()));
    ec_start.add_event(EventType::CustomEvent("bpane-debugger".to_string()));
    ec_start.add_element(&domutil::query_select("body"),());
}
