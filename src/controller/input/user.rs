use std::sync::{ Arc, Mutex };
use dom::domutil;
use dom::event::{ EventListener, EventType, EventData, EventControl, Target };
use stdweb::web::{ Element, HtmlElement, IHtmlElement };
use stdweb::traits::IEvent;
use dom::event;

use controller::global::{ App, AppRunner };
use controller::input::{ Event, events_run };
use controller::input::physics::MousePhysics;
use types::Dot;

pub struct UserEventListener {
    canv_el: HtmlElement,
    cs: Arc<Mutex<App>>,
    mouse: Arc<Mutex<MousePhysics>>
}

impl UserEventListener {
    pub fn new(cs: &Arc<Mutex<App>>,
               canv_el: &HtmlElement,
               mouse: &Arc<Mutex<MousePhysics>>) -> UserEventListener {
        UserEventListener {
            cs: cs.clone(),
            mouse: mouse.clone(),
            canv_el: canv_el.clone()
        }
    }    
}

impl EventListener<()> for UserEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MouseEvent(EventType::MouseWheelEvent,_,e) => {
                let cs = self.cs.lock().unwrap();
                let (pos,pos_bp,pos_prop) = cs.with_stage(|s|
                    (s.get_pos(),
                     s.get_mouse_pos_bp(),
                     s.get_mouse_pos_prop())
                );
                let pos = Dot(pos_bp,pos.1);
                events_run(&cs,vec! {
                    Event::Zoom(-e.wheel_delta() as f32/1000.),
                    Event::Pos(pos,Some(pos_prop))
                });
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
            }
            _ => ()
        };
    }
}

pub struct UserEventListenerBody {
    mouse: Arc<Mutex<MousePhysics>>
}

impl UserEventListenerBody {
    pub fn new(mouse: &Arc<Mutex<MousePhysics>>) -> UserEventListenerBody {
        UserEventListenerBody {
            mouse: mouse.clone()
        }
    }
}

impl EventListener<()> for UserEventListenerBody {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        if let EventData::MouseEvent(EventType::MouseUpEvent,_,_) = e {
            self.mouse.lock().unwrap().up();
        }
    }
}

pub fn register_user_events(gc: &mut AppRunner, el: &HtmlElement) {
    event::disable_context_menu();
    let mp = Arc::new(Mutex::new(MousePhysics::new(gc)));
    let uel = UserEventListener::new(&gc.state(),el,&mp);
    let mut ec_canv = EventControl::new(Box::new(uel),());
    ec_canv.add_event(EventType::MouseClickEvent);
    ec_canv.add_event(EventType::MouseDownEvent);
    ec_canv.add_event(EventType::MouseMoveEvent);
    ec_canv.add_event(EventType::MouseWheelEvent);        
    let elel: Element = el.clone().into();
    ec_canv.add_element(&elel,());
    let uel_body = UserEventListenerBody::new(&mp);
    let mut ec_body = EventControl::new(Box::new(uel_body),());
    ec_body.add_event(EventType::MouseUpEvent);
    ec_body.add_element(&domutil::query_select("body"),());        
    gc.add_control(Box::new(ec_canv));
    gc.add_control(Box::new(ec_body));
}
