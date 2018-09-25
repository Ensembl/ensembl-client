use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::hash_map::Entry;
use serde_json::Value as JSONValue;

use stdweb::web::Element;

use dom::event::{
    EventListener, EventControl, EventType, EventData, ICustomEvent,
    Target
};
use dom::domutil;

pub struct DebugFolderEntry {
    pub name: String,
    contents: String,
    last: String,
    mul: u32
}

const MAX_LEN : i32 = 1000000;

impl DebugFolderEntry {
    pub fn new(name: &str) -> DebugFolderEntry {
        DebugFolderEntry {
            name: name.to_string(),
            contents: String::new(),
            last: String::new(),
            mul: 0
        }
    }
    
    pub fn reset(&mut self) {
        self.contents = String::new();
    }
    
    pub fn mark(&mut self) {
        self.add("-- MARK --");
    }
    
    pub fn add(&mut self, value: &str) {
        if value == self.last {
            self.mul += 1;
        } else {
            if self.mul >1 {
                self.contents.push_str(&format!(" [x{}]",self.mul));
            }
            self.contents.push_str("\n");
            self.contents.push_str(value);
            self.last = value.to_string();
            self.mul = 1;
        }
        let too_long = self.contents.len() as i32 - MAX_LEN;
        if too_long > 0 {
            self.contents = self.contents[too_long as usize..].to_string();
        }
    }
    
    pub fn get(&mut self) -> String {
        let mut out = self.contents.clone();
        if self.mul > 1 {
            out.push_str(&format!(" [x{}]",self.mul));
        }
        out
    }
}
pub struct DebugConsoleImpl {
    el: Element,
    base_el: Element,
    folder: HashMap<String,DebugFolderEntry>,
    selected: Option<String>,
    refresh: bool
}

impl DebugConsoleImpl {
    pub fn new(el: &Element, base_el: &Element) -> DebugConsoleImpl {
        DebugConsoleImpl {
            el: el.clone(),
            base_el: base_el.clone(),
            folder: HashMap::<String,DebugFolderEntry>::new(),
            selected: None,
            refresh: false
        }
    }
    
    fn entry(&mut self, k: &str) -> &mut DebugFolderEntry {
        let mut keys : Vec<String> = self.folder.keys().map(|s| s.to_string()).collect();
        match self.folder.entry(k.to_string()) {
            Entry::Occupied(e) => e.into_mut(),
            Entry::Vacant(e) => {
                keys.push(k.to_string());
                let out = DebugFolderEntry::new(k);
                domutil::send_custom_event(&self.base_el,"refresh",&json!({
                    "keys": keys
                }));
                self.refresh = true;
                e.insert(out)
            }
        }
    }
    
    pub fn select(&mut self, name: &str) {
        self.selected = Some(name.to_string());
        self.update_contents();
    }
    
    fn update_contents(&mut self) {
        let el = self.el.clone();
        domutil::text_content(&el,"");
        let sel = self.selected.clone();
        if let Some(ref sel) = sel {
            let e = self.entry(&sel);
            domutil::text_content(&el,&e.get());
        }
        domutil::scroll_to_bottom(&el);
    }
    
    fn maybe_update_contents(&mut self, name: &str) {
        if let Some(ref sel) = self.selected.clone() {
            if sel == name {
                self.update_contents();
            }
        }
    }
        
    pub fn mark(&mut self) {
        for e in &mut self.folder.values_mut() {
            e.mark();
        }
        self.update_contents();
    }
        
    pub fn add(&mut self, name: &str, value: &str) {
        self.entry(name).add(value);
        self.maybe_update_contents(name);
    }
    
    pub fn reset(&mut self,name: &str) {
        self.entry(name).reset();
    }
}

impl EventListener<()> for DebugConsoleImpl {
    fn receive(&mut self, _el: &Target, ev: &EventData, _p: &()) {
        if let EventData::CustomEvent(_,n,v) = ev {
            let mut data = HashMap::<String,String>::new();
            if let JSONValue::Object(map) = v.details().unwrap() {
                for (k,v) in &map {
                    if let JSONValue::String(v) = v {
                        data.insert(k.to_string(),v.to_string());
                    }
                }
            }
            match &n[..] {
                "reset" => { self.reset(data.get("name").unwrap()) },
                "mark" => { self.mark() },
                "select" => { self.select(data.get("name").unwrap()); },
                "add" => {
                    self.add(data.get("name").unwrap(),
                             data.get("value").unwrap());
                },
                _ => ()
            }
        }
    }
}

struct DebugConsoleListener(Rc<RefCell<DebugConsoleImpl>>);

impl EventListener<()> for DebugConsoleListener {
    fn receive(&mut self, el: &Target, ev: &EventData, p: &()) {
        self.0.borrow_mut().receive(el,ev,p);
    }
}

pub struct DebugConsole {
    imp: Rc<RefCell<DebugConsoleImpl>>,
    evctrl: EventControl<()>
}

impl DebugConsole {
    pub fn new(el: &Element, base_el: &Element) -> DebugConsole {
        let imp = Rc::new(RefCell::new(DebugConsoleImpl::new(el,base_el)));
        let li = DebugConsoleListener(imp.clone());
        let mut out = DebugConsole {
            imp,
            evctrl: EventControl::new(Box::new(li),())
        };
        out.evctrl.add_event(EventType::CustomEvent("add".to_string()));
        out.evctrl.add_event(EventType::CustomEvent("mark".to_string()));
        out.evctrl.add_event(EventType::CustomEvent("select".to_string()));
        out.evctrl.add_element(&el,());
        out
    }
        
    pub fn add(&mut self, name: &str, value: &str) {
        self.imp.borrow_mut().add(name,value);
    }

    pub fn select(&mut self, name: &str) {
        self.imp.borrow_mut().select(name);
    }
}
