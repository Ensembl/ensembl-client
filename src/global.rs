use std::sync::{ Arc, Mutex };
use dom::domutil;
use dom::event::{ EventKiller, EventListener, EventControl, EventType, EventListenerHandle, EventData, ICustomEvent };
use stdweb::web::{ IElement, Element, HtmlElement };
use arena::{ Arena, Stage };
use types::{ CPixel,  Move, Distance, Units, Axis, CFraction, cfraction };
use serde_json::Value as JSONValue;

use campaign::{ StateManager };

const CANVAS : &str = r##"
    <canvas id="glcanvas"></canvas>
"##;

pub struct Global {
    inst: u32,
    root: HtmlElement,
    arena: Option<Arc<Mutex<Arena>>>,
    stage: Arc<Mutex<Stage>>,
    control: EventControl<()>,
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
            control: EventControl::new(),
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
        self.root.set_attribute("data-inst",&inst_s).ok();
        self.arena = Some(Arc::new(Mutex::new(Arena::new(&canv_el))));
        self.control = EventControl::new();
        let lr = ArenaEventListener::new(
                            el,
                            self.arena.as_ref().unwrap().clone(),
                            self.stage.clone());
        let lrh = EventListenerHandle::new(Box::new(lr));
        self.control.add_event(EventType::CustomEvent("bpane".to_string()),&lrh);
        self.control.add_event(EventType::ClickEvent,&lrh);
        self.control.add_event(EventType::MouseDownEvent,&lrh);
        self.control.add_event(EventType::MouseUpEvent,&lrh);
        self.control.add_event(EventType::MouseMoveEvent,&lrh);
        self.control.add_event(EventType::MouseWheelEvent,&lrh);
        self.control.add_element(&mut self.eventkiller,&el,());
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

#[derive(Debug,Clone,Copy)]
enum Event {
    Noop,
    Move(Move<f32,f32>),
    Zoom(f32)
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
    arena: Arc<Mutex<Arena>>,
    stage: Arc<Mutex<Stage>>,
    stale: bool,
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
}

impl ArenaEventListener {
    pub fn new(_root: &Element,
               arena: Arc<Mutex<Arena>>,
               stage: Arc<Mutex<Stage>>) -> ArenaEventListener {
        ArenaEventListener { arena, stage, stale: false, down_at: None, delta_applied: None }
    }
    
    fn refresh(&mut self) {
        debug!("global","refresh due to stage event");
        let arena = &mut self.arena.lock().unwrap();
        let stage = &mut self.stage.lock().unwrap();
        
        arena.draw(&StateManager::new(),stage);
        self.stale = false;
    }
    
    fn exe_move_event(&mut self, v: Move<f32,f32>) {
        let stage = &mut self.stage.lock().unwrap();
        
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,stage),
            Axis::Vert => v.convert(Units::Pixels,stage),
        };
        stage.pos = stage.pos + v;
        self.stale = true;
    }
    
    fn exe_zoom_by_event(&mut self, z: f32) {
        let stage = &mut self.stage.lock().unwrap();
        let z = stage.get_zoom()+z;
        stage.set_zoom(z);
        self.stale = true;
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
        for ev in evs {
            match ev {
                Event::Move(v) => self.exe_move_event(v),
                Event::Zoom(z) => self.exe_zoom_by_event(z),
                Event::Noop => ()
            }
        }
        if self.stale {
            self.refresh();
        }
    }
}
