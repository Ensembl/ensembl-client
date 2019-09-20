use stdweb::unstable::TryInto;

use serde_json::Value as JSONValue;
use stdweb::web::{ Element, HtmlElement };

use controller::global::{ App, Global, GlobalWeak };
use controller::input::Action;
use dom::event::{ 
    EventListener, EventControl, EventType, EventData, 
    ICustomEvent, Target, IMessageEvent
};
use dom::domutil;
use types::{ Move, Distance, Units };
use super::eventutil::{ extract_element, parse_message };
use super::eventqueue::EventQueueManager;

fn custom_movement_event(dir: &str, unit: &str, v: &JSONValue) -> Action {
    if let JSONValue::Number(quant) = v {
        let quant = quant.as_f64().unwrap() as f64;
        let unit = match unit {
            "base"|"bases"|"bp" => Units::Bases,
            "pixel"|"pixels"|"px" => Units::Pixels,
            "screen"|"screens"|"sc" => Units::Screens,
            _ => { return Action::Noop; }
        };
        let act = match dir {
            "left" => Move::Left(Distance(quant,unit)),
            "right" => Move::Right(Distance(quant,unit)),
            "up" => Move::Up(Distance(quant,unit)),
            "down" => Move::Down(Distance(quant,unit)),
            _ => { return Action::Noop; }
        };
        Action::Move(act)
    } else {
        Action::Noop
    }
}

fn custom_goto_event(v: &JSONValue) -> Action {
    if let JSONValue::String(ref v) = v {
        let parts : Vec<&str> = v.split("-").collect();
        if parts.len() == 2 {
            let start : Result<i64,_> = parts[0].parse();
            let end : Result<i64,_> = parts[1].parse();
            if start.is_ok() && end.is_ok() {
                return Action::PosRange(start.ok().unwrap() as f64,
                                 end.ok().unwrap() as f64,0.);
            }
        }
    }
    Action::Noop
}

fn custom_stick_event(v: &JSONValue) -> Action {
    if let JSONValue::String(v) = v {
        Action::SetStick(v.to_string())
    } else {
        Action::Noop
    }
}

fn custom_zoom_event(kind: &str, v: &JSONValue) -> Action {
    if let JSONValue::Number(quant) = v {
        let quant = quant.as_f64().unwrap();
        match kind {
            "by" => {
                Action::Zoom(quant)
            },
            _ => Action::Noop
        }
    } else {
        Action::Noop
    }
}

fn custom_state_event(v: &JSONValue, sv: bool) -> Action {
    if let JSONValue::String(track) = v {
        Action::SetState(track.to_string(),sv)
    } else {
        Action::Noop
    }
}

fn custom_focus_event(v: &JSONValue, jump: bool) -> Vec<Action> {
    let mut out = Vec::new();
    if let JSONValue::String(ref v) = v {
        if jump {
            out.push(Action::JumpFocus(v.to_string()));
        } else {
            out.push(Action::SetFocus(v.to_string()));
        }
    }
    out
}

fn custom_reset_event() -> Vec<Action> {
    vec![Action::Reset]
}

fn custom_activity_outside_event() -> Vec<Action> {
    vec![Action::ActivityOutsideZMenu]
}

fn every<F>(v: &JSONValue, cb: F) -> Vec<Action> where F: Fn(&JSONValue) -> Action {
    if let JSONValue::Array(vv) = v {
        vv.iter().map(|x| cb(x)).collect()
    } else {
        vec! {cb(v) }
    }
}

fn custom_make_one_event_key(k: &String, v: &JSONValue, keys: &Vec<String>) -> Vec<Action> {
    let parts : Vec<&str> = k.split("_").collect();
    match parts.len() {
        1 => return match parts[0] {
            "on" => every(v,|v| custom_state_event(v,true)),
            "off" => every(v,|v| custom_state_event(v,false)),
            "goto" => every(v,|v| custom_goto_event(v)),
            "stick" => every(v,|v| custom_stick_event(v)),
            "focus" => custom_focus_event(v,!keys.contains(&"goto".to_string())),
            "reset" => custom_reset_event(),
            _ => vec!{}
        },
        2 => return match parts[0] {
            "zoom" => every(v,|v| custom_zoom_event(parts[1],v)),
            _ => vec!{}
        },
        3 => return match parts[0] {
            "move" => every(v,|v| custom_movement_event(parts[1],parts[2],v)),
            _ => vec!{}
        },
        _ => vec!{}
    }
}

fn custom_make_events(j: &JSONValue) -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    if let JSONValue::Object(map) = j {
        if let Some(action) = j.get("action") {
            match unwrap!(action.as_str()) {
                "zmenu-activity-outside" => out.append(&mut custom_activity_outside_event()),
                _ => {}
            }
        } else {
            let keys : Vec<String> = map.keys().cloned().collect();
            for (k,v) in map {
                out.append(&mut custom_make_one_event_key(k,v,&keys));
            }
        }
    }
    out.push(Action::Settled);
    out
}

fn extract_counter(j: &JSONValue) -> Option<f64> {
    if let JSONValue::Object(j) = j {
        j.get("message-counter").and_then(|v| v.as_f64())
    } else {
        None
    }
}

pub fn run_direct_events(app: &mut App, name: &str, j: &JSONValue) {
    let evs = custom_make_events(&j);
    console!("receive/A {} {}",name,j.to_string());
    console!("receive/B {:?}",evs);
    app.run_actions(&evs,extract_counter(&j));
}

pub struct DirectEventListener {
    gw: GlobalWeak,
    eqm: EventQueueManager
}

impl DirectEventListener {
    pub fn new(gw: GlobalWeak,eqm: &EventQueueManager) -> DirectEventListener {
        DirectEventListener { gw, eqm: eqm.clone() }
    }        

    pub fn run_direct(&mut self, el: &Element, name: &str, j: &JSONValue) {
        console!("receive/C {:?} {}",el,j.to_string());
        if let Some(mut g) = self.gw.upgrade() {
            let el : Result<HtmlElement,_> = el.clone().try_into();
            let el : Option<HtmlElement> = el.ok();
            if let Some(el) = el {
                if let Some(ar) = g.find_app(&el) {
                    let app = ar.state();
                    run_direct_events(&mut app.lock().unwrap(),name,j);
                }                
            }
        }
    }
}

impl EventListener<()> for DirectEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::CustomEvent(_,ec,name,c) => {
                let details = c.details().unwrap();
                let el = extract_element(&details,Some(ec.target().clone()));
                if let Some(el) = el {
                    self.run_direct(&el.into(),name,&details);
                } else {
                    console!("bpane sent to unknown app (event)");
                }
            },
            EventData::MessageEvent(_,_,c) => {
                let data = c.data().unwrap();
                if let Some(payload) = parse_message("bpane",&data) {
                    console!("receive/D {}",payload);
                    let sel = payload.get("selector").map(|v| v.as_str().unwrap());
                    if payload.get("_outgoing").is_some() {
                        return;
                    }
                    let ev = custom_make_events(&payload);
                    let currency = extract_counter(&payload);
                    self.eqm.add_by_selector(sel,&ev,currency);
                }
            },
            _ => ()
        }
    }
}

pub fn register_direct_events(g: &Global) -> EventQueueManager {
    let gw = GlobalWeak::new(g);
    let eqm = EventQueueManager::new();
    let dlr = DirectEventListener::new(gw,&eqm);
    let mut ec = EventControl::new(Box::new(dlr),());
    ec.add_event(EventType::CustomEvent("bpane".to_string()));
    ec.add_event(EventType::MessageEvent);
    let body = domutil::query_selector_ok_doc("body","No body element!");
    ec.add_element(&body.into(),());
    eqm
}
