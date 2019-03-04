use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use url::Url;

use composit::StateValue;
use controller::global::Global;
use controller::input::Action;
use debug::DEMO_SOURCES;

use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use dom::AppEventData;
use types::Dot;

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
                        let config_url = aed.get_simple_str("config-url",None);
                        if config_url.is_none() {
                            console!("BROWSER APP REFUSING TO START UP! No config-url supplied");
                        }
                        let config_url = Url::parse(&config_url.unwrap()).ok().unwrap();
                        g.register_app(&key,&cx.target().try_into().unwrap(),false,&config_url);
                    },
                    _ => ()
                }
            },
            _ => ()
        }
    }
}

pub fn register_startup_events(g: &Arc<Mutex<Global>>) {
    let uel = StartupEventListener::new(g);
    let mut ec_start = EventControl::new(Box::new(uel),());
    ec_start.add_event(EventType::CustomEvent("bpane-activate".to_string()));
    ec_start.add_element(&domutil::query_select("body"),());
}

pub fn initial_actions() -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    
    /* Default tracks */
    for name in &DEMO_SOURCES {
        out.push(Action::AddComponent(name.to_string()));
        out.push(Action::SetState(name.to_string(),StateValue::On()));
    }
    out.extend(vec! {
        Action::SetStick("16".to_string()),
        Action::Pos(Dot(0_f64,0_f64),None),
        Action::ZoomTo(-9.)
    });
    out
}
