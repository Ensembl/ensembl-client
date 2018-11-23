use std::sync::{ Arc, Mutex };

use dom::domutil;
use stdweb::web::{ Element, HtmlElement };

use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ events_run, Event };
use dom::event::{ 
    EventListener, EventControl, EventType, EventData, Target
};

pub struct DomEventListener {
    el: HtmlElement,
    cg: Arc<Mutex<CanvasState>>,
}

impl DomEventListener {
    pub fn new(cg: &Arc<Mutex<CanvasState>>, el: &HtmlElement) -> DomEventListener {
        DomEventListener { cg: cg.clone(), el: el.clone() }
    }        
}

impl EventListener<()> for DomEventListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        let evs = match e {
            EventData::GenericEvent(EventType::ResizeEvent,_) => {
                vec! {
                    Event::Resize(domutil::size(&self.el))
                }
            }
            _ => Vec::<Event>::new()
        };
        events_run(&self.cg.lock().unwrap(),evs);
    }
}

pub fn register_dom_events(gc: &mut CanvasRunner, el: &HtmlElement) {
    let elel : Element = el.clone().into();
    let dlr = DomEventListener::new(&gc.state(),el);
    let mut ec = EventControl::new(Box::new(dlr),());
    ec.add_event(EventType::ResizeEvent);
    ec.add_element(&elel,());
    gc.add_control(Box::new(ec));
}
