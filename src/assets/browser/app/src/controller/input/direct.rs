use std::sync::{ Arc, Mutex };

use serde_json::Value as JSONValue;
use stdweb::web::{ Element, HtmlElement };

use composit::StateValue;
use controller::global::{ App, AppRunner };
use controller::input::{ actions_run, Action };
use dom::event::{ 
    EventListener, EventControl, EventType, EventData, 
    ICustomEvent, Target
};
use types::{ Move, Distance, Units };

fn custom_movement_event(dir: &str, unit: &str, v: &JSONValue) -> Action {
    if let JSONValue::Number(quant) = v {
        let quant = quant.as_f64().unwrap() as f64;
        let unit = match unit {
            "base"|"bases"|"bp" => Units::Bases,
            "pixel"|"pixels"|"px" => Units::Pixels,
            "screen"|"screens"|"sc" => Units::Screens,
            _ => { return Action::Noop; }
        };
        Action::Move(match dir {
            "left" => Move::Left(Distance(quant,unit)),
            "right" => Move::Right(Distance(quant,unit)),
            "up" => Move::Up(Distance(quant,unit)),
            "down" => Move::Down(Distance(quant,unit)),
            _ => { return Action::Noop; }
        })
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

fn custom_state_event(v: &JSONValue, sv: StateValue) -> Action {
    if let JSONValue::String(track) = v {
        Action::SetState(track.to_string(),sv)
    } else {
        Action::Noop
    }
}

fn custom_make_one_event(k: &String, v: &JSONValue) -> Action {
    let parts : Vec<&str> = k.split("_").collect();
    match parts.len() {
        1 => return match parts[0] {
            "on" => custom_state_event(v,StateValue::On()),
            "standby" => custom_state_event(v,StateValue::OffWarm()),
            "off" => custom_state_event(v,StateValue::OffCold()),
            "goto" => custom_goto_event(v),
            "stick" => custom_stick_event(v),
            _ => Action::Noop
        },
        2 => return match parts[0] {
            "zoom" => custom_zoom_event(parts[1],v),
            _ => Action::Noop
        },
        3 => return match parts[0] {
            "move" => custom_movement_event(parts[1],parts[2],v),
            _ => Action::Noop
        },
        _ => ()
    }
    Action::Noop
}

fn custom_make_events(j: &JSONValue) -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    if let JSONValue::Object(map) = j {
        for (k,v) in map {
            out.push(custom_make_one_event(k,v));
        }
    }
    out
}

pub struct DirectEventListener {
    cg: Arc<Mutex<App>>,
}

impl DirectEventListener {
    pub fn new(cg: &Arc<Mutex<App>>) -> DirectEventListener {
        DirectEventListener { cg: cg.clone() }
    }        
}

impl EventListener<()> for DirectEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        let evs = match e {
            EventData::CustomEvent(_,_,_,c) =>
                custom_make_events(&c.details().unwrap()),
            _ => Vec::<Action>::new()
        };
        console!("receive");
        actions_run(&mut self.cg.lock().unwrap(),&evs);
    }
}

pub fn register_direct_events(gc: &mut AppRunner, el: &HtmlElement) {
    let elel : Element = el.clone().into();
    let dlr = DirectEventListener::new(&gc.state());
    let mut ec = EventControl::new(Box::new(dlr),());
    ec.add_event(EventType::CustomEvent("bpane".to_string()));
    ec.add_element(&elel,());
    gc.add_control(Box::new(ec));
}
