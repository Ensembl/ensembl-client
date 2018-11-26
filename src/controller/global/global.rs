use std::collections::{ HashMap, HashSet };
use std::collections::hash_map::Entry;
use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ IElement, HtmlElement, Element, IHtmlElement };


use composit::StateManager;
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
    Timer, register_startup_events
};
use controller::global::{ AppRunner, App };
use debug::setup_testcards;
use dom::{ domutil, DebugBling, NoBling, Bling };
use types::CPixel;

pub struct Global {
    apps: HashMap<String,AppRunner>,
    elements: HashMap<String,Element>,
    active: HashSet<String>
}

impl Global {
    pub fn new() -> Global {
        Global {
            apps: HashMap::<String,AppRunner>::new(),
            elements: HashMap::<String,Element>::new(),
            active: HashSet::<String>::new()
        }
    }

    pub fn unregister_app(&mut self, key: &str) {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            e.get_mut().unregister();
        }
    }

    pub fn register_app(&mut self, key: &str, el: &Element, debug: bool) {
        self.unregister_app(key);
        let bling : Box<Bling> = if debug {
            Box::new(DebugBling::new())
        } else { 
            Box::new(NoBling::new())
        };
        let mut ar = AppRunner::new(&el,bling);
        self.apps.insert(key.to_string(),ar);
    }
        
    pub fn with_apprunner<F,G>(&mut self, key: &str, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            Some(cb(&mut e.get_mut()))
        } else {
            None
        }
    }
    
}

fn find_main_element() -> Option<HtmlElement> {
    for name in vec!{ "main", "body" } {
        let el : Option<Element> = domutil::query_selector_new(name);
        if let Some(el) = el {
            let el : Option<HtmlElement> = el.try_into().ok();
            if let Some(h) = el {
                return Some(h);   
            }
        }
    }
    None
}

pub fn setup_global() {
    let g = Arc::new(Mutex::new(Global::new()));
    register_startup_events(&g);
    setup_testcards();
    if let Some(h) = find_main_element() {
        h.focus();
        domutil::add_attr(&h.clone().into(),"class","browser-app-ready");
        domutil::remove_attr(&h.into(),"class","browser-app-not-ready");
    }
}
