use std::cell::RefCell;
use std::collections::{ HashMap, HashSet };
use std::collections::hash_map::Entry;
use std::rc::{ Rc, Weak };
use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ IElement, HtmlElement, Element, IHtmlElement };


use composit::{
    StateManager, ComponentSourceList, StickManager, Component,
    ComponentSource, Stick
};
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
    Timer, register_startup_events
};
use controller::global::{ AppRunner, App };
use debug::{ setup_testcards, DebugComponentSource, DebugBling, create_interactors };
use debug::debug_stick_manager;
use dom::{ domutil, NoBling, Bling };
use types::CPixel;



pub struct GlobalImpl {
    apps: HashMap<String,AppRunner>,
    elements: HashMap<String,Element>,
    csl: ComponentSourceList,
    sticks: Box<StickManager>
}

impl GlobalImpl {
    pub fn new() -> GlobalImpl {
        let mut out = GlobalImpl {
            apps: HashMap::<String,AppRunner>::new(),
            elements: HashMap::<String,Element>::new(),
            csl: ComponentSourceList::new(),
            sticks: Box::new(debug_stick_manager())
        };
        out.csl.add_compsource(Box::new(DebugComponentSource::new()));
        out
    }

    pub fn unregister_app(&mut self, key: &str) {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            e.get_mut().unregister();
        }
    }

    pub fn register_app(&mut self, key: &str, ar: AppRunner) {
        self.apps.insert(key.to_string(),ar);
    }
    
    pub fn get_component(&mut self, name: &str) -> Option<Component> {
        self.csl.get_component(name)
    }
    
    pub fn get_stick(&mut self, name: &str) -> Option<Stick> {
        self.sticks.get_stick(name)
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

#[derive(Clone)]
pub struct Global(Rc<RefCell<GlobalImpl>>);

#[derive(Clone)]
pub struct GlobalWeak(Weak<RefCell<GlobalImpl>>);

impl Global {
    pub fn new() -> Global {
        Global(Rc::new(RefCell::new(GlobalImpl::new())))
    }
    
    pub fn unregister_app(&mut self, key: &str) {
        self.0.borrow_mut().unregister_app(key);
    }

    pub fn register_app(&mut self, key: &str, el: &Element, debug: bool) {
        self.unregister_app(key);
        let bling : Box<Bling> = if debug {
            Box::new(DebugBling::new(create_interactors()))
        } else { 
            Box::new(NoBling::new())
        };
        let mut ar = AppRunner::new(&GlobalWeak::new(&self),&el,bling);
        self.0.borrow_mut().register_app(key,ar);
    }
    
    pub fn get_component(&mut self, name: &str) -> Option<Component> {
        self.0.borrow_mut().get_component(name)
    }
    
    pub fn get_stick(&mut self,name: &str) -> Option<Stick> {
        self.0.borrow_mut().get_stick(name)
    }
    
    pub fn with_apprunner<F,G>(&mut self, key: &str, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        self.0.borrow_mut().with_apprunner(key,cb)
    }    
}

impl GlobalWeak {
    pub fn new(g : &Global) -> GlobalWeak {
        GlobalWeak(Rc::downgrade(&g.0))
    }
    
    pub fn upgrade(&mut self) -> Option<Global> {
        self.0.upgrade().map(|x| Global(x))
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
