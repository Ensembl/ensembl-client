use std::rc::Rc;
use std::fmt;
use std::sync::{ Arc, Mutex };
use std::marker::PhantomData;

use stdweb::unstable::TryInto;
use stdweb::Reference;
use stdweb::web::Element;
use stdweb::web::event::{ IEvent, IUiEvent, IMouseEvent, IKeyboardEvent };

#[derive(Clone)]
pub struct EventListenerHandle<T>(
    Arc<Mutex<Box<EventListener<T>>>>
);

impl<T> EventListenerHandle<T> {
    pub fn new(el: Box<EventListener<T>>) -> EventListenerHandle<T> {
        EventListenerHandle(Arc::new(Mutex::new(el)))
    }
}

pub struct EventControl<T> {
    mappings: Vec<(EventType,EventListenerHandle<T>)>,
    phantom: PhantomData<T>
}

impl<T: 'static> EventControl<T> {
    pub fn new() -> EventControl<T> {
        EventControl {
            mappings: Vec::<(EventType,EventListenerHandle<T>)>::new(),
            phantom: PhantomData
        }
    }
    
    pub fn add_event(&mut self, typ: EventType, cb: &EventListenerHandle<T>) {
        let cbc = EventListenerHandle(cb.0.clone());
        self.mappings.push((typ,cbc));
    }
    
    pub fn add_element(&self, el: &Element, t: T) -> ElementEvents<T> {
        let mut m = ElementEvents::new(el,t);
        for (name,cb) in &self.mappings {
            m.add_event(name,&cb.0);
        }
        m
    }
}

#[allow(dead_code)]
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

pub struct ElementEvents<T> {
    el: Element,
    kills: Vec<EventKiller>,
    payload: Rc<T>
}

macro_rules! event_type {
    ($obj:ident, $el:ident, $name:ident, $typc:ident,
     $evtype:ident, $cbname:ident, $payload:ident) => {{
        let elc1 = $el.clone();
        let elc2 = $el.clone();
        let p = $payload;
        let cb = move |e: Reference| {
            $obj.lock().unwrap().$cbname(
                &elc1,&$typc,&$evtype(e.clone()),&p);
        };
        let v = js! {
            var cb = @{cb};
            @{elc2.as_ref()}.addEventListener(@{$name},cb);
            return cb;
        };
        v.try_into().unwrap()
    }}
}

impl<T: 'static> ElementEvents<T> {
    fn new(el: &Element, p: T) -> ElementEvents<T> {
        ElementEvents {
            el: el.clone(),
            kills: Vec::<EventKiller>::new(),
            payload: Rc::new(p)
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
    
    fn add_event(&mut self, typ: &EventType, evl: &Arc<Mutex<Box<EventListener<T>>>>) {
        let obj = evl.clone();
        let typc = *typ;
        let name = typ.get_name();
        let el = &self.el;
        let p = self.payload.clone();
        let cb_js : Reference = match typ {
            EventType::ClickEvent |
            EventType::MouseMoveEvent => {
                event_type!(obj,el,name,typc,MouseEvent,receive_mouse,p)
            },
            EventType::KeyPressEvent => {
                event_type!(obj,el,name,typc,KeyboardEvent,receive_keyboard,p)
            }
        };
        self.kills.push(EventKiller {
            name: name.to_string(),
            cb_js
        });
    }
}

pub trait EventListener<T> {
    fn receive_mouse(&mut self, _el: &Element, _typ: &EventType, _ev: &MouseEvent, _p: &T) {}
    fn receive_keyboard(&mut self, _el: &Element, _typ: &EventType, _ev: &KeyboardEvent, _p: &T) {}
}
