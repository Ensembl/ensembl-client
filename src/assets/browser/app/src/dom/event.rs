use std::rc::Rc;
use std::fmt;
use std::sync::{ Arc, Mutex };

use stdweb::serde::Serde;
use serde_json::Value as JSONValue;
use stdweb::Value as Value;
use stdweb::unstable::TryInto;
use stdweb::Reference;
use stdweb::web::{ window, Element };
use stdweb::web::event::{ IEvent, IUiEvent, IMouseEvent, IKeyboardEvent };
use types::{ CPixel, cpixel };

pub struct EventControl<T> {
    handle: Arc<Mutex<Box<dyn EventListener<T>>>>,
    mappings: Vec<EventType>,
    window: ElementEvents<T>,
    current: Vec<ElementEvents<T>>
}

impl<T: 'static> EventControl<T> {
    pub fn new(handle: Box<dyn EventListener<T>>, p: T) -> EventControl<T> {
        EventControl {
            handle: Arc::new(Mutex::new(handle)),
            mappings: Vec::<EventType>::new(),
            window: ElementEvents::<T>::new(&Target::WindowState,p),
            current: Vec::<ElementEvents<T>>::new()
        }
    }
    
    pub fn reset(&mut self) {
        for ee in &mut self.current {
            ee.clear();
        }
        self.current.clear();
        self.window.clear();
    }
    
    pub fn add_event(&mut self, typ: EventType) {
        if window_event(&typ) {
            self.window.add_event(&typ,&self.handle);
        } else {
            self.mappings.push(typ);
        }
    }
    
    pub fn add_element(&mut self, el: &Element, t: T) {
        let mut m = ElementEvents::new(&Target::Element(el.clone()),t);
        for name in &self.mappings {
            m.add_event(name,&self.handle);
        }
        self.current.push(m);
    }
}

#[allow(dead_code)]
#[derive(Debug,Clone)]
pub enum EventType {
    MouseUpEvent,
    MouseDownEvent,
    MouseClickEvent,
    MouseDblClickEvent,
    MouseWheelEvent,
    MouseMoveEvent,
    KeyPressEvent,
    ResizeEvent,
    CustomEvent(String),
    ContextMenuEvent,
    UnloadEvent,
    MessageEvent
}

fn window_event(et: &EventType) -> bool {
    match et {
        EventType::ResizeEvent => true,
        EventType::UnloadEvent => true,
        EventType::MessageEvent => true,
        _ => false
    }
}

#[derive(Debug)]
pub struct EventContext {
    e: Reference
}

impl EventContext {
    pub fn new(e: &Reference) -> EventContext {
        EventContext {
            e: e.clone()
        }
    }
    
    pub fn target(&self) -> Element {
        let el = js!{ return @{&self.e}.target; }.try_into().unwrap();
        el
    }
    
    pub fn stop_propagation(&self) {
        js!{ @{&self.e}.stopPropagation(); };
    }

    pub fn prevent_default(&self) {
        js!{ @{&self.e}.preventDefault(); };
    }
}

#[derive(Debug)]
pub enum EventData {
    MouseEvent(EventType,EventContext,MouseData),
    KeyboardEvent(EventType,EventContext,KeyboardData),
    CustomEvent(EventType,EventContext,String,CustomData),
    MessageEvent(EventType,EventContext,MessageData),
    GenericEvent(EventType,EventContext),
}

impl EventData {
    fn new(et: EventType, e: Reference) -> EventData {
        let e = e.clone();
        let ec = EventContext::new(&e);
        match &et {
            EventType::MouseMoveEvent |
            EventType::MouseDownEvent |
            EventType::MouseUpEvent |
            EventType::MouseClickEvent |
            EventType::MouseDblClickEvent |
            EventType::MouseWheelEvent =>
                EventData::MouseEvent(et.clone(),ec,MouseData(e)),
            EventType::KeyPressEvent =>
                EventData::KeyboardEvent(et.clone(),ec,KeyboardData(e)),
            EventType::CustomEvent(n) =>
                EventData::CustomEvent(et.clone(),ec,n.clone(),CustomData(e)),
            EventType::MessageEvent =>
                EventData::MessageEvent(et.clone(),ec,MessageData(e)),
            EventType::ResizeEvent |
            EventType::UnloadEvent |
            EventType::ContextMenuEvent =>
                EventData::GenericEvent(et.clone(),ec)
        }
    }
    
    pub fn context(&self) -> &EventContext {
        match self {
            EventData::MouseEvent(_,ec,_) => ec,
            EventData::KeyboardEvent(_,ec,_) => ec,
            EventData::CustomEvent(_,ec,_,_) => ec,
            EventData::MessageEvent(_,ec,_) => ec,
            EventData::GenericEvent(_,ec) => ec,
        }
    }
}

impl EventType {
    fn get_name(&self) -> &str {
        match self {
            EventType::MouseClickEvent => "click",
            EventType::MouseDblClickEvent => "dblclick",
            EventType::MouseDownEvent => "mousedown",
            EventType::MouseUpEvent => "mouseup",
            EventType::MouseMoveEvent => "mousemove",
            EventType::KeyPressEvent => "keypress",
            EventType::MouseWheelEvent => "wheel",
            EventType::ResizeEvent => "resize",
            EventType::ContextMenuEvent => "contextmenu",
            EventType::UnloadEvent => "unload",
            EventType::CustomEvent(n) => &n,
            EventType::MessageEvent => "message"
        }
    }
}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "MouseData")]
pub struct MouseData(Reference);

fn float_or_int(in_: &Value) -> f32 {
    let out_int: Result<i64,_> = in_.clone().try_into();
    if let Ok(out) = out_int { return out as f32; }
    let out_int: Result<f64,_> = in_.clone().try_into();
    if let Ok(out) = out_int { return out as f32; }
    return 0.;
}

impl MouseData {
    pub fn at(&self) -> CPixel {
        cpixel(self.client_x(),self.client_y())
    }
    
    pub fn wheel_delta(&self) -> f32 {
        let delta : f32 = float_or_int(&js! { return @{self.as_ref()}.deltaY; });
        let mode : i32 = js! { return @{self.as_ref()}.deltaMode; }.try_into().unwrap();
        match mode {
            0 => delta,
            1 => delta * 40.,
            _ => delta * 800.
        }
    }
    
    pub fn button(&self) -> i8 {
        let out: i8 = js! { return @{self.as_ref()}.button; }.try_into().unwrap();
        out
    }
    
    pub fn shift_key(&self) -> bool {
        let out: bool = js! { return @{self.as_ref()}.shiftKey; }.try_into().unwrap();
        out
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

impl KeyboardData {
    pub fn key_char(&self) -> String {
        return js! { return @{self.as_ref()}.key; }.try_into().unwrap();
    }
}

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

impl IEvent for CustomData {}

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

pub trait IMessageEvent {
    fn data(&self) -> Option<JSONValue>;
}

#[derive(ReferenceType,Clone,PartialEq,Eq)]
#[reference(instance_of = "MessageData")]
pub struct MessageData(Reference);

impl IEvent for MessageData {}

impl fmt::Debug for MessageData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MessageData {{ {:?} }}",self.data())
    }
}

impl IMessageEvent for MessageData {
    fn data(&self) -> Option<JSONValue> {
        let js_val : Value = js! {
            return @{self.0.as_ref()}.data;
        }.try_into().unwrap();
        let val : Serde<JSONValue> = js_val.try_into().ok().unwrap();
        Some(val.0)
    }
}

struct JsEventKiller {
    name: String,
    cb_js: Reference
}

#[derive(Clone,Debug)]
pub enum Target {
    Element(Element),
    WindowState
}

pub struct ElementEvents<T> {
    el: Target,
    kills: Vec<JsEventKiller>,
    payload: Rc<T>
}

impl<T: 'static> ElementEvents<T> {
    fn new(el: &Target, p: T) -> ElementEvents<T> {
        ElementEvents {
            el: el.clone(),
            kills: Vec::<JsEventKiller>::new(),
            payload: Rc::new(p)
        }
    }
    
    fn as_ref(&self) -> Reference {
        match &self.el {
            Target::Element(el) => el.as_ref().clone(),
            Target::WindowState => window().as_ref().clone()
        }
    }
    
    pub fn clear(&mut self) {
        for ek in &self.kills {
            let el = self.as_ref();
            let name = &ek.name;
            let cb_js = &ek.cb_js;
            js! { @(no_return)
               var cb = @{cb_js};
               @{el}.removeEventListener(@{&name},cb);
               cb.drop();
            };
        }
    }
    
    fn add_event(&mut self, typ: &EventType, evl: &Arc<Mutex<Box<dyn EventListener<T>>>>) {
        let name = typ.get_name().to_string();
        let el = &self.el;
        let p = self.payload.clone();
        let typc = typ.clone();
        let cb = enclose! { (el,evl) move |e: Reference| {
            let ed = EventData::new(typc.clone(),e);
            evl.lock().unwrap().receive(&el,&ed,&p);
        }};
        let v;
        {
            let elr = self.as_ref();
            v = js! {
                var cb = @{cb};
                @{elr}.addEventListener(@{&name},cb);
                return cb;
            };
        };
        let cb_js : Reference = v.try_into().unwrap();
        self.kills.push(JsEventKiller {
            name: name.to_string(),
            cb_js
        });
    }
}

pub trait EventListener<T> {
    fn receive(&mut self, _el: &Target, _ev: &EventData, _p: &T) {}
}
