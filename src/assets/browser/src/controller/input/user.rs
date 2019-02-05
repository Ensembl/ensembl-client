use std::collections::HashMap;
use std::sync::{ Arc, Mutex };
use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use stdweb::web::{ Element, HtmlElement, IHtmlElement };
use stdweb::traits::IEvent;

use controller::global::{ App, AppRunner };
use controller::input::{ Event, events_run, EggDetector };
use controller::input::physics::MousePhysics;
use controller::input::optical::Optical;
use types::Dot;

pub struct UserEventListener {
    canv_el: HtmlElement,
    cs: Arc<Mutex<App>>,
    mouse: Arc<Mutex<MousePhysics>>,
    optical: Arc<Mutex<Optical>>
}

impl UserEventListener {
    pub fn new(cs: &Arc<Mutex<App>>,
               canv_el: &HtmlElement,
               mouse: &Arc<Mutex<MousePhysics>>,
               optical: &Arc<Mutex<Optical>>) -> UserEventListener {
        UserEventListener {
            cs: cs.clone(),
            mouse: mouse.clone(),
            canv_el: canv_el.clone(),
            optical: optical.clone()
        }
    }    
}

impl EventListener<()> for UserEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MouseEvent(EventType::MouseWheelEvent,_,e) => {
                let cs = &mut self.cs.lock().unwrap();
                let (y,pos_bp,pos_prop) = cs.with_stage(|s|
                    (s.get_pos_middle().1,
                     s.get_mouse_pos_bp(),
                     s.get_mouse_pos_prop())
                );

                let pos = Dot(pos_bp,y);
                self.optical.lock().unwrap().move_by(
                    -e.wheel_delta() as f64/1000.,
                    pos,pos_prop);
                e.stop_propagation();
                e.prevent_default();
            },
            EventData::MouseEvent(EventType::MouseDownEvent,_,e) => {
                self.canv_el.focus();
                domutil::clear_selection();
                e.stop_propagation();
                self.mouse.lock().unwrap().down(e.at());
            },
            EventData::MouseEvent(EventType::MouseMoveEvent,_,e) => { 
                self.mouse.lock().unwrap().move_to(e.at());
                self.cs.lock().unwrap().with_stage(|s| 
                    s.set_mouse_pos(&e.at())
                );
            },
            EventData::MouseEvent(EventType::MouseClickEvent,_,e) => {
                e.stop_propagation();
            },
            EventData::GenericEvent(EventType::ContextMenuEvent,e) => {
                e.stop_propagation();
                e.prevent_default();
            }
            _ => ()
        };
    }
}

struct EventEggs {
    patterns: Vec<(EggDetector,Vec<Event>)>
}

impl EventEggs {
    pub fn new(actions: HashMap<&str,Vec<Event>>) -> EventEggs {
        EventEggs {
            patterns: actions.iter().map(|(k,v)| {
                (EggDetector::new(Some(k)),v.clone())
            }).collect()
        }
    }
    
    pub fn key(&mut self, app: &Arc<Mutex<App>>, key: &str) {
        for (pattern,actions) in &mut self.patterns {
            pattern.new_char(key);
            if pattern.is_active() {
                pattern.reset();
                events_run(&mut app.lock().unwrap(),actions);
            }
        }
    }
}

pub struct UserEventListenerBody {
    app_runner: AppRunner,
    mouse: Arc<Mutex<MousePhysics>>,
    event_eggs: EventEggs,
    egg: EggDetector
}

impl UserEventListenerBody {
    pub fn new(app_runner: &AppRunner, mouse: &Arc<Mutex<MousePhysics>>) -> UserEventListenerBody {
        let event_eggs = hashmap! {
            "@polar#" => [
                Event::AddComponent("internal:debug-main".to_string()),
                Event::SetStick("polar".to_string()),
                Event::ZoomTo(-5.)
            ].to_vec()
        };
        UserEventListenerBody {
            mouse: mouse.clone(),
            app_runner: app_runner.clone(),
            event_eggs: EventEggs::new(event_eggs),
            egg: EggDetector::new(Some("@gander#"))
        }
    }
}

impl EventListener<()> for UserEventListenerBody {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MouseEvent(EventType::MouseUpEvent,_,_) => {
                self.mouse.lock().unwrap().up();
            },
            EventData::KeyboardEvent(EventType::KeyPressEvent,_,e) => {
                if !self.egg.is_active() {
                    self.egg.new_char(&e.key_char());
                    if self.egg.is_active() {
                        self.app_runner.activate_debug();
                    }
                }
                self.app_runner.bling_key(&e.key_char());
                self.event_eggs.key(&self.app_runner.state(),&e.key_char());
            },
            _ => ()
        }
    }
}

pub fn register_user_events(gc: &mut AppRunner, el: &HtmlElement) {
    let mp = Arc::new(Mutex::new(MousePhysics::new(gc)));
    let op = Arc::new(Mutex::new(Optical::new(gc)));
    let uel = UserEventListener::new(&gc.state(),el,&mp,&op);
    let mut ec_canv = EventControl::new(Box::new(uel),());
    ec_canv.add_event(EventType::MouseClickEvent);
    ec_canv.add_event(EventType::MouseDownEvent);
    ec_canv.add_event(EventType::MouseMoveEvent);
    ec_canv.add_event(EventType::MouseWheelEvent);
    ec_canv.add_event(EventType::ContextMenuEvent);
    let elel: Element = el.clone().into();
    ec_canv.add_element(&elel,());
    let uel_body = UserEventListenerBody::new(gc,&mp);
    let mut ec_body = EventControl::new(Box::new(uel_body),());
    ec_body.add_event(EventType::MouseUpEvent);
    ec_body.add_event(EventType::KeyPressEvent);
    ec_body.add_element(&domutil::query_select("body"),());        
    gc.add_control(Box::new(ec_canv));
    gc.add_control(Box::new(ec_body));
}
