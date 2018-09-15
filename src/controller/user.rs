use std::rc::Rc;
use std::cell::RefCell;
use dom::event::{ EventListener, EventType, EventData, EventControl };
use stdweb::web::{ Element };
use types::{ Move, Distance, Units, CFraction, cfraction };

use controller::{ Event, EventRunner };

pub struct UserEventListener {
    runner: Rc<RefCell<EventRunner>>,
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
}

impl UserEventListener {
    pub fn new(er: &Rc<RefCell<EventRunner>>) -> UserEventListener {
        UserEventListener {
            runner: er.clone(), 
            down_at: None, delta_applied: None
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
        self.runner.borrow_mut().run(evs);
    }
}

pub struct UserEventManager {
    ec: EventControl<()>
}

impl UserEventManager {
    pub fn new(er: &Rc<RefCell<EventRunner>>, el: &Element) -> UserEventManager {
        let dlr = UserEventListener::new(er);
        let mut ec = EventControl::new(Box::new(dlr));
        ec.add_event(EventType::ClickEvent);
        ec.add_event(EventType::MouseDownEvent);
        ec.add_event(EventType::MouseUpEvent);
        ec.add_event(EventType::MouseMoveEvent);
        ec.add_event(EventType::MouseWheelEvent);        
        ec.add_element(el,());
        UserEventManager { ec }
    }
    
    pub fn reset(&mut self) {
        self.ec.reset();
    }
}
