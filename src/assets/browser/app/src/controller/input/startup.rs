use stdweb::unstable::TryInto;
use stdweb::web::HtmlElement;
use url::Url;

use serde_json::Value as JSONValue;
use controller::global::Global;
use controller::input::Action;
use debug::DEMO_SOURCES;

use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target, ICustomEvent, IMessageEvent };
use dom::AppEventData;
use super::eventutil::{ extract_element, parse_message };


pub struct StartupEventListener {
    g: Global
}

impl StartupEventListener {
    pub fn new(g: &Global) -> StartupEventListener {
        StartupEventListener {
            g: g.clone()
        }
    }    

    fn activate(&mut self, data: Option<JSONValue>, el: Option<HtmlElement>) {
        let aed = AppEventData::new(&data);
        let key = unwrap!(aed.get_simple_str("key",Some("only")));
        let debug = unwrap!(aed.get_simple_bool("debug",Some(false)));
        console!("Activate browser {} on {:?}",key,el);
        let config_url = aed.get_simple_str("config-url",None);
        if config_url.is_none() {
            console!("BROWSER APP REFUSING TO START UP! No config-url supplied");
        }
        let config_url = ok!(Url::parse(&unwrap!(config_url)));
        let el = extract_element(&data.unwrap(),el.map(|x| x.into()));
        console!("activate el {:?}",el);
        self.g.trigger_app(&key,&el.unwrap(),debug,&config_url);
    }
}

impl EventListener<()> for StartupEventListener {
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::CustomEvent(_,cx,_,data) =>
                self.activate(data.details(),Some(cx.target().try_into().unwrap())),
            EventData::MessageEvent(_,_,data) => {
                let data = unwrap!(data.data());
                if let Some(payload) = parse_message("bpane-activate",&data) {
                    self.activate(Some(payload.clone()),None);
                }
            }
            _ => ()
        }
    }
}

pub fn register_startup_events(g: &Global) {
    let uel = StartupEventListener::new(g);
    let mut ec_start = EventControl::new(Box::new(uel),());
    ec_start.add_event(EventType::CustomEvent("bpane-activate".to_string()));
    ec_start.add_event(EventType::MessageEvent);
    ec_start.add_element(&domutil::query_select("body"),());
}

pub fn initial_actions() -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    
    /* Default tracks */
    for name in &DEMO_SOURCES {
        out.push(Action::AddComponent(name.to_string()));
        out.push(Action::SetState(name.to_string(),true));
    }
    out
}
