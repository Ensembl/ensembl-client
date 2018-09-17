use stdweb::unstable::TryInto;
use std::sync::{ Arc, Mutex };
use dom::domutil;
use std::rc::Rc;
use std::cell::RefCell;
use dom::event::{ EventListener, EventType, EventData, EventControl };
use stdweb::web::{ Element, HtmlElement, IHtmlElement };

use controller::{ Event, EventRunner };
use controller::physics::MousePhysics;
use controller::timers::Timers;

pub struct UserEventListener {
    canv_el: HtmlElement,
    runner: Rc<RefCell<EventRunner>>,
    mouse: Arc<Mutex<MousePhysics>>
}

impl UserEventListener {
    pub fn new(er: &Rc<RefCell<EventRunner>>,
               canv_el: &HtmlElement,
               mouse: &Arc<Mutex<MousePhysics>>) -> UserEventListener {
        UserEventListener {
            runner: er.clone(),
            mouse: mouse.clone(),
            canv_el: canv_el.clone()
        }
    }    
}

impl EventListener<()> for UserEventListener {    
    fn receive(&mut self, _el: &Element,  e: &EventData, _idx: &()) {
        let evs = match e {
            EventData::MouseEvent(EventType::MouseWheelEvent,e) =>
                {
                    let delta = e.wheel_delta();
                    vec! {
                        Event::Zoom(delta as f32/1000.)
                    }
                }
            EventData::MouseEvent(EventType::MouseDownEvent,e) =>
                { 
                    self.canv_el.focus();
                    domutil::clear_selection();
                    self.mouse.lock().unwrap().down(e.at());
                    Vec::<Event>::new()
                },
            EventData::MouseEvent(EventType::MouseMoveEvent,e) =>
                { 
                    self.mouse.lock().unwrap().move_to(e.at());
                    Vec::<Event>::new()
                },
            _ => Vec::<Event>::new()
        };
        self.runner.borrow_mut().run(evs);
    }
}

pub struct UserEventListenerBody {
    runner: Rc<RefCell<EventRunner>>,
    mouse: Arc<Mutex<MousePhysics>>
}

impl UserEventListenerBody {
    pub fn new(er: &Rc<RefCell<EventRunner>>,
               mouse: &Arc<Mutex<MousePhysics>>) -> UserEventListenerBody {
        UserEventListenerBody {
            runner: er.clone(),
            mouse: mouse.clone()
        }
    }
}

impl EventListener<()> for UserEventListenerBody {    
    fn receive(&mut self, _el: &Element,  e: &EventData, _idx: &()) {
        if let EventData::MouseEvent(EventType::MouseUpEvent,_) = e {
            self.mouse.lock().unwrap().up();
        }
    }
}

pub struct UserEventManager {
    ec_canv: EventControl<()>,
    ec_body: EventControl<()>
}

impl UserEventManager {
    pub fn new(er: &Rc<RefCell<EventRunner>>, el: &Element,
               timers: &mut Timers) -> UserEventManager {
        let html_el: HtmlElement = el.clone().try_into().unwrap();
        let mp = Arc::new(Mutex::new(MousePhysics::new(timers)));
        let uel = UserEventListener::new(er,&html_el,&mp);
        let mut ec_canv = EventControl::new(Box::new(uel));
        ec_canv.add_event(EventType::ClickEvent);
        ec_canv.add_event(EventType::MouseDownEvent);
        ec_canv.add_event(EventType::MouseMoveEvent);
        ec_canv.add_event(EventType::MouseWheelEvent);        
        ec_canv.add_element(el.into(),());
        let uel_body = UserEventListenerBody::new(er,&mp);
        let mut ec_body = EventControl::new(Box::new(uel_body));
        ec_body.add_event(EventType::MouseUpEvent);
        ec_body.add_element(&domutil::query_select("body"),());        
        UserEventManager { ec_canv, ec_body }
    }
    
    pub fn reset(&mut self) {
        self.ec_canv.reset();
        self.ec_body.reset();
    }
}
