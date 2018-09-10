use std::sync::{ Arc, Mutex };
use dom::domutil;
use dom::event::{ EventKiller, EventListener, EventControl, EventType, EventListenerHandle, EventData };
use stdweb::web::{ IElement, Element };
use arena::{ Arena, Stage };
use coord::{ CLeaf, CPixel, CFraction };
use serde_json::Value as JSONValue;

use campaign::{ StateManager };

const CANVAS : &str = r##"
    <canvas id="glcanvas"></canvas>
"##;

pub struct Global {
    inst: u32,
    root: Element,
    arena: Option<Arc<Mutex<Arena>>>,
    stage: Arc<Mutex<Stage>>,
    control: EventControl<()>,
    eventkiller: EventKiller<()>
}

impl Global {
    pub fn new(root: &Element) -> Global {
        let s = Arc::new(Mutex::new(Stage::new()));
        let g = Global {
            inst: 0,
            root: root.clone(),
            arena: None,
            stage: s.clone(),
            control: EventControl::new(),
            eventkiller: EventKiller::new()
        };
        g
    }
    
    pub fn reset(&mut self) -> String {
        self.eventkiller.kill();
        self.inst += 1;
        domutil::inner_html(&self.root,CANVAS);
        let canv_el = domutil::query_selector(&self.root,"canvas");
        let inst_s = format!("{}",self.inst);
        self.root.set_attribute("data-inst",&inst_s).ok();
        self.arena = Some(Arc::new(Mutex::new(Arena::new(&canv_el))));
        self.control = EventControl::new();
        let lr = ArenaEventListener::new(
                            &self.root,
                            self.arena.as_ref().unwrap().clone(),
                            self.stage.clone());
        let lrh = EventListenerHandle::new(Box::new(lr));
        self.control.add_event(EventType::CustomEvent("bpane".to_string()),&lrh);
        self.control.add_event(EventType::ClickEvent,&lrh);
        self.control.add_element(&mut self.eventkiller,&canv_el,());
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
    MovePixels(CPixel),
    MoveBases(CLeaf),
    MoveScreens(CFraction)
}

fn custom_make_one_event(k: &String, v: &JSONValue) -> Event {
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
    stage: Arc<Mutex<Stage>>
}

impl EventListener<()> for ArenaEventListener {
    fn receive(&mut self, _el: &Element,  _e: &EventData, _idx: &()) {
        console!("event!");
    }
}

impl ArenaEventListener {
    pub fn new(_root: &Element,
               arena: Arc<Mutex<Arena>>,
               stage: Arc<Mutex<Stage>>) -> ArenaEventListener {
        ArenaEventListener { arena, stage }
    }
}
