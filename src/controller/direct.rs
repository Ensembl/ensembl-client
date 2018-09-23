use std::sync::{ Arc, Mutex };
use dom::event::{ 
    EventListener, EventControl, EventType, EventData, 
    ICustomEvent
};
use stdweb::web::{ Element };
use types::{ Move, Distance, Units };
use serde_json::Value as JSONValue;
use controller::runner::events_run;
use controller::Event;
use controller::global::{ CanvasGlobal, CanvasGlobalInst };

fn custom_movement_event(dir: &str, unit: &str, v: &JSONValue) -> Event {
    if let JSONValue::Number(quant) = v {
        let quant = quant.as_f64().unwrap() as f32;
        let unit = match unit {
            "base"|"bases"|"bp" => Units::Bases,
            "pixel"|"pixels"|"px" => Units::Pixels,
            "screen"|"screens"|"sc" => Units::Screens,
            _ => { return Event::Noop; }
        };
        Event::Move(match dir {
            "left" => Move::Left(Distance(quant,unit)),
            "right" => Move::Right(Distance(quant,unit)),
            "up" => Move::Up(Distance(quant,unit)),
            "down" => Move::Down(Distance(quant,unit)),
            _ => { return Event::Noop; }
        })
    } else {
        Event::Noop
    }
}

fn custom_zoom_event(kind: &str, v: &JSONValue) -> Event {
    if let JSONValue::Number(quant) = v {
        let quant = quant.as_f64().unwrap() as f32;
        match kind {
            "by" => {
                Event::Zoom(quant)
            },
            _ => Event::Noop
        }
    } else {
        Event::Noop
    }
}

fn custom_make_one_event(k: &String, v: &JSONValue) -> Event {
    let parts : Vec<&str> = k.split("_").collect();
    match parts.len() {
        2 => return match parts[0] {
            "zoom" => custom_zoom_event(parts[1],v),
            _ => Event::Noop
        },
        3 => return match parts[0] {
            "move" => custom_movement_event(parts[1],parts[2],v),
            _ => Event::Noop
        },
        _ => ()
    }
    Event::Noop
}

fn custom_make_events(j: &JSONValue) -> Vec<Event> {
    let mut out = Vec::<Event>::new();
    if let JSONValue::Object(map) = j {
        for (k,v) in map {
            out.push(custom_make_one_event(k,v));
        }
    }
    out
}

pub struct DirectEventListener {
    cg: Arc<Mutex<CanvasGlobal>>,
}

impl DirectEventListener {
    pub fn new(cg: &Arc<Mutex<CanvasGlobal>>) -> DirectEventListener {
        DirectEventListener { cg: cg.clone() }
    }        
}

impl EventListener<()> for DirectEventListener {    
    fn receive(&mut self, _el: &Element,  e: &EventData, _idx: &()) {
        let evs = match e {
            EventData::CustomEvent(_,_,c) =>
                custom_make_events(&c.details().unwrap()),
            _ => Vec::<Event>::new()
        };
        events_run(&self.cg.lock().unwrap(),evs);
    }
}

pub fn register_direct_events(gc: &mut CanvasGlobalInst, el: &Element) {
    let dlr = DirectEventListener::new(&gc.cg);
    let mut ec = EventControl::new(Box::new(dlr));
    ec.add_event(EventType::CustomEvent("bpane".to_string()));
    ec.add_element(el,());
    gc.cg.lock().unwrap().add_control(Box::new(ec));
}
