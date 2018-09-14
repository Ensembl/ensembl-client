use std::sync::{ Arc, Mutex };
use std::marker::PhantomData;
use dom::domutil;
use dom::event::{ 
    EventKiller, EventListener, EventControl, EventType, EventData, 
    ICustomEvent
};
use stdweb::web::{ IElement, Element, HtmlElement };
use arena::{ Arena, Stage };
use types::{ CPixel,  Move, Distance, Units, CFraction, cfraction };
use serde_json::Value as JSONValue;

use campaign::{ StateManager };

use controller::{ Event, EventRunner };

const CANVAS : &str = r##"
    <canvas id="glcanvas"></canvas>
"##;

pub struct Global {
    inst: u32,
    root: HtmlElement,
    arena: Option<Arc<Mutex<Arena>>>,
    stage: Arc<Mutex<Stage>>,
    control: Option<EventControl<()>>,
    eventkiller: EventKiller<()>
}

impl Global {
    pub fn new(root: &HtmlElement) -> Global {
        let s = Arc::new(Mutex::new(Stage::new(root)));
        Global {
            inst: 0,
            root: root.clone(),
            arena: None,
            stage: s.clone(),
            control: None,
            eventkiller: EventKiller::new()
        }
    }
    
    pub fn dims(&mut self) -> CPixel {
        self.stage.lock().unwrap().get_size()
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        self.eventkiller.kill();
        self.inst += 1;
        domutil::inner_html(el,CANVAS);
        let canv_el = domutil::query_selector(el,"canvas");
        let inst_s = format!("{}",self.inst);
        debug!("global","start card {}",inst_s);
        self.root.set_attribute("data-inst",&inst_s).ok();
        self.arena = Some(Arc::new(Mutex::new(Arena::new(&canv_el))));
        let lr = ArenaEventListener::new(
                            self.arena.as_ref().unwrap().clone(),
                            self.stage.clone());
        self.control = Some(EventControl::new(Box::new(lr)));
        DirectEventManager::new(&mut self.control.as_mut().unwrap());
        self.control.as_mut().unwrap().add_event(EventType::CustomEvent("bpane".to_string()));
        self.control.as_mut().unwrap().add_element(&mut self.eventkiller,&el,());
        format!("{}",self.inst)
    }
        
    pub fn with_arena<F>(&self, mut cb: F) where F: FnMut(&mut Arena) -> () {
        let ar = &mut self.arena.as_ref().unwrap();
        let a = &mut ar.lock().unwrap();
        cb(a)
    }
    
    pub fn with_stage<F>(&self, mut cb: F) where F: FnMut(&mut Stage) -> () {
        let a = &mut self.stage.lock().unwrap();
        cb(a)
    }
    
    pub fn draw(&mut self, oom: &StateManager) {
        let stage = self.stage.lock().unwrap();
        let ar = &mut self.arena.as_ref().unwrap();
        ar.lock().unwrap().draw(oom,&stage);
    }
}

struct DirectEventManager<T> {
    phantom: PhantomData<T>
}

impl<T: 'static> DirectEventManager<T> {
    fn new(elc: &mut EventControl<T>) -> DirectEventManager<T> {
        elc.add_event(EventType::ClickEvent);
        elc.add_event(EventType::MouseDownEvent);
        elc.add_event(EventType::MouseUpEvent);
        elc.add_event(EventType::MouseMoveEvent);
        elc.add_event(EventType::MouseWheelEvent);        
        DirectEventManager {
            phantom: PhantomData
        }
    }
}

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

pub struct ArenaEventListener {
    runner: EventRunner,
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
}

impl ArenaEventListener {
    pub fn new(arena: Arc<Mutex<Arena>>,
               stage: Arc<Mutex<Stage>>) -> ArenaEventListener {
        ArenaEventListener {
            runner: EventRunner::new(arena,stage), 
            down_at: None, delta_applied: None
        }
    }        
}

impl EventListener<()> for ArenaEventListener {    
    fn receive(&mut self, _el: &Element,  e: &EventData, _idx: &()) {
        let evs = match e {
            EventData::CustomEvent(_,_,c) =>
                custom_make_events(&c.details().unwrap()),
            EventData::MouseEvent(EventType::MouseWheelEvent,e) =>
                {
                    let delta = e.wheel_delta();
                    vec! {
                        Event::Zoom(delta as f32/1000.)
                    }
                }
            EventData::MouseEvent(EventType::MouseDownEvent,e) =>
                { 
                    self.down_at = Some(e.at().as_fraction());
                    self.delta_applied = Some(cfraction(0.,0.));
                    console!("mousedown"); 
                    Vec::<Event>::new()
                },
            EventData::MouseEvent(EventType::MouseUpEvent,_) =>
                { 
                    self.down_at = None;
                    Vec::<Event>::new()
                },
            EventData::MouseEvent(EventType::MouseMoveEvent,e) =>
                { 
                    let at = e.at().as_fraction();
                    if let Some(down_at) = self.down_at {
                        let delta = at - down_at;
                        let new_delta = delta - self.delta_applied.unwrap();
                        self.delta_applied = Some(delta);
                        vec! {
                            Event::Move(Move::Left(Distance(new_delta.0,Units::Pixels))),
                            Event::Move(Move::Up(Distance(new_delta.1,Units::Pixels)))
                        }
                    } else {
                        Vec::<Event>::new()
                    }
                },
            _ => Vec::<Event>::new()
        };
        self.runner.run(evs);
    }
}
