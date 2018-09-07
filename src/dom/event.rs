use std::fmt;
use std::sync::{ Arc, Mutex };
use stdweb::unstable::TryInto;
use stdweb::Reference;
use stdweb::web::Element;
use stdweb::web::event::{ IEvent, IUiEvent, IMouseEvent, IKeyboardEvent };

#[derive(Clone)]
pub struct EventListenerHandle(Arc<Mutex<Box<EventListener>>>);

impl EventListenerHandle {
    pub fn new(el: Box<EventListener>) -> EventListenerHandle {
        EventListenerHandle(Arc::new(Mutex::new(el)))
    }
}

pub struct EventControl {
    mappings: Vec<(EventType,EventListenerHandle)>
}

impl EventControl {
    pub fn new() -> EventControl {
        EventControl {
            mappings: Vec::<(EventType,EventListenerHandle)>::new()
        }
    }
    
    pub fn add_event(&mut self, typ: EventType, cb: &EventListenerHandle) {
        self.mappings.push((typ,cb.clone()));
    }
    
    pub fn add_element(&self, el: &Element) -> ElementEvents {
        let mut m = ElementEvents::new(el);
        for (name,cb) in &self.mappings {
            m.add_event(name,&cb.0);
        }
        m
    }
}

#[derive(Debug,Clone,Copy)]
pub enum EventType {
    ClickEvent,
    MouseMoveEvent,
    KeyPressEvent
}

impl EventType {
    fn get_name(&self) -> &str {
        match self {
            EventType::ClickEvent => "click",
            EventType::MouseMoveEvent => "mousemove",
            EventType::KeyPressEvent => "keypress",
        }
    } 
}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "MouseEvent")]
pub struct MouseEvent(Reference);

impl fmt::Debug for MouseEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MouseEvent {{ x={} y={} }}",self.client_x(),self.client_y())
    }
}

impl IEvent for MouseEvent {}
impl IUiEvent for MouseEvent {}
impl IMouseEvent for MouseEvent {}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "KeyboardEvent")]
pub struct KeyboardEvent(Reference);

impl fmt::Debug for KeyboardEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "KeyboardEvent {{ code={} }}",self.code())
    }
}

impl IEvent for KeyboardEvent {}
impl IUiEvent for KeyboardEvent {}
impl IKeyboardEvent for KeyboardEvent {}

struct EventKiller {
    name: String,
    cb_js: Reference
}

pub struct ElementEvents {
    el: Element,
    kills: Vec<EventKiller>
}

macro_rules! event_type {
    ($obj:ident, $el:ident, $name:ident, $typc:ident,
     $evtype:ident, $cbname:ident) => {{
        let elc1 = $el.clone();
        let elc2 = $el.clone();
        let cb = move |e: Reference| {
            $obj.lock().unwrap().$cbname(
                &elc1,&$typc,&$evtype(e.clone()));
        };
        let v = js! {
            var cb = @{cb};
            @{elc2.as_ref()}.addEventListener(@{$name},cb);
            return cb;
        };
        v.try_into().unwrap()
    }}
}

impl ElementEvents {
    fn new(el: &Element) -> ElementEvents {
        ElementEvents {
            el: el.clone(),
            kills: Vec::<EventKiller>::new()
        }
    }
    
    pub fn clear(&mut self) {
        let el = self.el.as_ref();
        for ek in &self.kills {
            let name = &ek.name;
            let cb_js = &ek.cb_js;
            js! { @(no_return)
               var cb = @{cb_js};
               @{el}.removeEventListener(@{&name},cb);
               cb.drop();
            };
        }
    }
    
    fn add_event(&mut self, typ: &EventType, evl: &Arc<Mutex<Box<EventListener>>>) {
        let obj = evl.clone();
        let typc = *typ;
        let name = typ.get_name();
        let el = &self.el;
        let cb_js : Reference = match typ {
            EventType::ClickEvent |
            EventType::MouseMoveEvent => {
                event_type!(obj,el,name,typc,MouseEvent,receive_mouse)
            },
            EventType::KeyPressEvent => {
                event_type!(obj,el,name,typc,KeyboardEvent,receive_keyboard)
            }
        };
        self.kills.push(EventKiller {
            name: name.to_string(),
            cb_js
        });
    }
}

pub trait EventListener {
    fn receive_mouse(&mut self, _el: &Element, _typ: &EventType, _ev: &MouseEvent) {}
    fn receive_keyboard(&mut self, _el: &Element, _typ: &EventType, _ev: &KeyboardEvent) {}
}
