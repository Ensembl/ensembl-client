use std::rc::Rc;
use std::fmt;
use std::sync::{ Arc, Mutex };

use stdweb::serde::Serde;
use serde_json::Value as JSONValue;
use stdweb::Value as Value;
use stdweb::unstable::TryInto;
use stdweb::Reference;
use stdweb::web::Element;
use stdweb::web::event::{ IEvent, IUiEvent, IMouseEvent, IKeyboardEvent };
use types::{ CPixel, cpixel };

#[derive(Clone)]
pub struct EventListenerHandle<T>(
    Arc<Mutex<Box<EventListener<T>>>>
);

impl<T> EventListenerHandle<T> {
    pub fn new(el: Box<EventListener<T>>) -> EventListenerHandle<T> {
        EventListenerHandle(Arc::new(Mutex::new(el)))
    }
}

pub struct EventKiller<T>(Vec<ElementEvents<T>>);

impl<T: 'static> EventKiller<T> {
    pub fn new() -> EventKiller<T> {
        EventKiller(Vec::<ElementEvents<T>>::new())
    }
    
    pub fn kill(&mut self) {
        for ee in &mut self.0 {
            ee.clear();
        }
        self.0.clear();
    }
}

pub struct EventControl<T> {
    handle: EventListenerHandle<T>,
    mappings: Vec<EventType>,
}

impl<T: 'static> EventControl<T> {
    pub fn new(handle: &EventListenerHandle<T>) -> EventControl<T> {
        EventControl {
            handle: EventListenerHandle(handle.0.clone()),
            mappings: Vec::<EventType>::new(),
        }
    }
    
    pub fn add_event(&mut self, typ: EventType) {
        self.mappings.push(typ);
    }
    
    pub fn add_element(&self, ek: &mut EventKiller<T>, el: &Element, t: T) {
        let mut m = ElementEvents::new(el,t);
        for name in &self.mappings {
            m.add_event(name,&self.handle.0);
        }
        ek.0.push(m);
    }
}

#[allow(dead_code)]
#[derive(Debug,Clone)]
pub enum EventType {
    MouseUpEvent,
    MouseDownEvent,
    MouseWheelEvent,
    ClickEvent,
    MouseMoveEvent,
    KeyPressEvent,
    CustomEvent(String)
}

#[derive(Debug)]
pub enum EventData {
    MouseEvent(EventType,MouseData),
    KeyboardEvent(EventType,KeyboardData),
    CustomEvent(EventType,String,CustomData)
}

impl EventData {
    fn new(et: EventType, e: Reference) -> EventData {
        let e = e.clone();
        match &et {
            EventType::ClickEvent |
            EventType::MouseMoveEvent |
            EventType::MouseDownEvent |
            EventType::MouseUpEvent |
            EventType::MouseWheelEvent =>
                EventData::MouseEvent(et.clone(),MouseData(e)),

            EventType::KeyPressEvent =>
                EventData::KeyboardEvent(et.clone(),KeyboardData(e)),
                
            EventType::CustomEvent(n) =>
                EventData::CustomEvent(et.clone(),n.clone(),CustomData(e)),
        }
    }
}

impl EventType {
    fn get_name(&self) -> &str {
        match self {
            EventType::ClickEvent => "click",
            EventType::MouseDownEvent => "mousedown",
            EventType::MouseUpEvent => "mouseup",
            EventType::MouseMoveEvent => "mousemove",
            EventType::KeyPressEvent => "keypress",
            EventType::MouseWheelEvent => "wheel",
            EventType::CustomEvent(n) => &n
        }
    }
}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "MouseData")]
pub struct MouseData(Reference);

impl MouseData {
    pub fn at(&self) -> CPixel {
        cpixel(self.client_x(),self.client_y())
    }
    
    pub fn wheel_delta(&self) -> i32 {
        let delta : i32 = js! { return @{self.as_ref()}.deltaY; }.try_into().unwrap();
        let mode : i32 = js! { return @{self.as_ref()}.deltaMode; }.try_into().unwrap();
        match mode {
            0 => delta,
            1 => delta * 40,
            _ => delta * 800
        }
    }
}

impl fmt::Debug for MouseData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MouseData {{ x={} y={} }}",self.client_x(),self.client_y())
    }
}

impl IEvent for MouseData {}
impl IUiEvent for MouseData {}
impl IMouseEvent for MouseData {}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "KeyboardData")]
pub struct KeyboardData(Reference);

impl fmt::Debug for KeyboardData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "KeyboardData {{ code={} }}",self.code())
    }
}

impl IEvent for KeyboardData {}
impl IUiEvent for KeyboardData {}
impl IKeyboardEvent for KeyboardData {}

pub trait ICustomEvent {
    fn details(&self) -> Option<JSONValue>;
}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "CustomData")]
pub struct CustomData(Reference);

impl fmt::Debug for CustomData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "CustomData {{ {:?} }}",self.details())
    }
}

impl ICustomEvent for CustomData {
    fn details(&self) -> Option<JSONValue> {
        let js_val : Value = js! {
            return @{self.0.as_ref()}.detail;
        }.try_into().unwrap();
        let val : Serde<JSONValue> = js_val.try_into().ok().unwrap();
        Some(val.0)
    }
}

struct JsEventKiller {
    name: String,
    cb_js: Reference
}

pub struct ElementEvents<T> {
    el: Element,
    kills: Vec<JsEventKiller>,
    payload: Rc<T>
}

impl<T: 'static> ElementEvents<T> {
    fn new(el: &Element, p: T) -> ElementEvents<T> {
        ElementEvents {
            el: el.clone(),
            kills: Vec::<JsEventKiller>::new(),
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
        let name = typ.get_name().to_string();
        let el = &self.el;
        let p = self.payload.clone();
        let typc = typ.clone();
        let cb = enclose! { (el,evl) move |e: Reference| {
            let ed = EventData::new(typc.clone(),e);
            evl.lock().unwrap().receive(&el,&ed,&p);
        }};
        let v = js! {
            var cb = @{cb};
            @{el.as_ref()}.addEventListener(@{&name},cb);
            return cb;
        };
        let cb_js : Reference = v.try_into().unwrap();
        self.kills.push(JsEventKiller {
            name: name.to_string(),
            cb_js
        });
    }
}

pub trait EventListener<T> {
    fn receive(&mut self, _el: &Element, _ev: &EventData, _p: &T) {}
}
