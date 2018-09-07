use std::sync::{ Arc, Mutex };
use stdweb::unstable::TryInto;
use stdweb::Reference;
use stdweb::web::Element;

pub struct EventControl {
    mappings: Vec<(String,Arc<Mutex<Box<EventListener>>>)>
}

impl EventControl {
    pub fn new() -> EventControl {
        EventControl {
            mappings: Vec::<(String,Arc<Mutex<Box<EventListener>>>)>::new()
        }
    }
    
    pub fn add_event(&mut self, name: &str, cb: Box<EventListener>) {
        self.mappings.push((name.to_string(),Arc::new(Mutex::new(cb))));
    }
    
    pub fn add_element(&self, el: &Element) -> ElementEvents {
        let mut m = ElementEvents::new(el);
        for (name,cb) in &self.mappings {
            m.add_event(name,cb);
        }
        m
    }    
}

struct EventKiller {
    name: String,
    cb_js: Reference
}

pub struct ElementEvents {
    el: Element,
    kills: Vec<EventKiller>
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
    
    fn add_event(&mut self, name: &str, evl: &Arc<Mutex<Box<EventListener>>>) {
        let obj = evl.clone();
        let elc = self.el.clone();
        let cb_name = name.to_string();
        let cb = move |_e: Reference| {
            obj.lock().unwrap().receive(&elc,&cb_name)
        };
        let eljs = self.el.clone();
        let cb_js : Reference = js! {
            var cb = @{cb};
            @{eljs.as_ref()}.addEventListener(@{name},cb);
            return cb;
        }.try_into().unwrap();
        self.kills.push(EventKiller {
            name: name.to_string(),
            cb_js
        });
    }
    
}

pub trait EventListener {
    fn receive(&mut self, el: &Element, name: &str);
}
