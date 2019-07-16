use stdweb::unstable::TryInto;
use std::sync::{ Arc, Mutex };

use serde_json::from_str;
use serde_json::Value as JSONValue;
use serde_json::Number as JSONNumber;
use stdweb::web::{ Element, HtmlElement };

use controller::global::{ App, AppRunner, Global, GlobalWeak };
use controller::input::{ actions_run, Action };
use dom::event::{ 
    EventListener, EventControl, EventType, EventData, 
    ICustomEvent, Target, IMessageEvent
};
use dom::domutil;
use types::{ Move, Distance, Units };
use super::eventutil::extract_element;

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

fn every<F>(v: &JSONValue, cb: F) -> Vec<Action> where F: Fn(&JSONValue) -> Action {
    if let JSONValue::Array(vv) = v {
        vv.iter().map(|x| cb(x)).collect()
    } else {
        vec! {cb(v) }
    }
}

fn custom_make_one_event_key(k: &String, v: &JSONValue) -> Vec<Action> {
    let parts : Vec<&str> = k.split("_").collect();
    match parts.len() {
        1 => return match parts[0] {
            "on" => every(v,|v| custom_state_event(v,true)),
            "off" => every(v,|v| custom_state_event(v,false)),
            "goto" => every(v,|v| custom_goto_event(v)),
            "stick" => every(v,|v| custom_stick_event(v)),
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
        for (k,v) in map {
            out.append(&mut custom_make_one_event_key(k,v));
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

pub fn run_direct_events(app: &mut App, j: &JSONValue) {
    let evs = custom_make_events(&j);
    console!("receive/A {}",j.to_string());
    console!("receive/B {:?}",evs);
    app.run_actions(&evs,extract_counter(&j));
}

pub struct DirectEventListener {
    gw: GlobalWeak,
    deq: DirectEventQueue
}

impl DirectEventListener {
    pub fn new(gw: GlobalWeak,deq: &DirectEventQueue) -> DirectEventListener {
        DirectEventListener { 
            gw,
            deq: deq.clone()
        }
    }        

    pub fn run_direct(&mut self, el: &Element, j: &JSONValue) {
        //let evs = custom_make_events(&j);
        console!("receive/C {:?} {}",el,j.to_string());
        if let Some(mut g) = self.gw.upgrade() {
            let el : Result<HtmlElement,_> = el.clone().try_into();
            let el : Option<HtmlElement> = el.ok();
            if let Some(el) = el {
                if let Some(ar) = g.find_app(&el) {
                    let mut app = ar.state();
                    run_direct_events(&mut app.lock().unwrap(),j);
                }                
            }
        }
    }
}

impl EventListener<()> for DirectEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::CustomEvent(_,ec,_,c) => {
                let details = c.details().unwrap();
                let el = extract_element(&details,Some(ec.target().clone()));
                if let Some(el) = el {
                    self.run_direct(&el.into(),&details);
                } else {
                    console!("bpane sent to unknown app (event)");
                }
            },
            EventData::MessageEvent(_,ec,c) => {
                let data = c.data().unwrap();
                let data = data["payload"].clone();
                if data.get("_outgoing").is_some() {
                    return;
                }
                let el = extract_element(&data,None);
                if let Some(el) = el {
                    self.run_direct(&el.into(),&data);
                    return;
                }
                if let Some(mut g) = self.gw.upgrade() {
                    if let Some(ar) = g.any_app() {
                        let mut app = ar.state();
                        run_direct_events(&mut app.lock().unwrap(),&data);
                        return;
                    }
                }
                self.deq.add(data);
            },
            _ => ()
        }
    }
}

struct DirectEventQueueImpl {
    queue: Vec<JSONValue>
}

impl DirectEventQueueImpl {
    pub fn new() -> DirectEventQueueImpl {
        DirectEventQueueImpl {
            queue: Vec::new()
        }
    }

    pub fn add(&mut self, v: JSONValue) {
        self.queue.push(v);
    }

    pub fn drain_to(&mut self, ar: &AppRunner) {
        let ar = ar.clone();
        for q in self.queue.drain(..) {
            let mut app = ar.state();
            run_direct_events(&mut app.lock().unwrap(),&q);
        }
    }
}

#[derive(Clone)]
pub struct DirectEventQueue(Arc<Mutex<DirectEventQueueImpl>>);

impl DirectEventQueue {
    pub fn new() -> DirectEventQueue {
        DirectEventQueue(Arc::new(Mutex::new(DirectEventQueueImpl::new())))
    }

    pub fn add(&mut self, v: JSONValue) {
        self.0.lock().unwrap().add(v);
    }

    pub fn drain_to(&mut self, ar: &AppRunner) {
        self.0.lock().unwrap().drain_to(ar);
    }
}

pub fn register_direct_events(g: &Global) -> DirectEventQueue {
    let gw = GlobalWeak::new(g);
    let deq = DirectEventQueue::new();
    let dlr = DirectEventListener::new(gw,&deq);
    let mut ec = EventControl::new(Box::new(dlr),());
    ec.add_event(EventType::CustomEvent("bpane".to_string()));
    ec.add_event(EventType::MessageEvent);
    let body = domutil::query_selector_ok_doc("body","No body element!");
    ec.add_element(&body.into(),());
    deq
}
