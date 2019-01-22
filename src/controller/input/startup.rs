use std::sync::{ Arc, Mutex };

use stdweb::web::INode;

use controller::global::Global;
use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use dom::AppEventData;

pub struct StartupEventListener {
    g: Arc<Mutex<Global>>
}

impl StartupEventListener {
    pub fn new(g: &Arc<Mutex<Global>>) -> StartupEventListener {
        StartupEventListener {
            g: g.clone()
        }
    }    
}

impl EventListener<()> for StartupEventListener {
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        let mut g = self.g.lock().unwrap();
        match e {
            EventData::CustomEvent(_,cx,name,data) => {
                let aed = AppEventData::new(data);
                match name.as_ref() {
                    "bpane-activate" => {
                        let key = aed.get_simple_str("key",Some("only")).unwrap();
                        console!("Activate browser {} on {:?}",key,cx.target());
                        g.register_app(&key,&cx.target(),false);
                    },
                    "bpane-debugger" => {
                        let key = aed.get_simple_str("key",Some("only")).unwrap();
                        console!("Restart in debug mode key={}",key);
                        g.register_app(&key,&cx.target(),true);
                    },
                    _ => ()
                }
            },
            _ => ()
        }
        
        console!("hi! e={:?}",e.context().target().node_name());
    }
}

pub fn register_startup_events(g: &Arc<Mutex<Global>>) {
    let uel = StartupEventListener::new(g);
    let mut ec_start = EventControl::new(Box::new(uel),());
    ec_start.add_event(EventType::CustomEvent("bpane-activate".to_string()));
    ec_start.add_event(EventType::CustomEvent("bpane-debugger".to_string()));
    ec_start.add_element(&domutil::query_select("body"),());
}
