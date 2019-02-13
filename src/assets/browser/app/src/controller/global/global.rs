use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::hash_map::Entry;
use std::rc::{ Rc, Weak };
use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element, IHtmlElement };

use controller::input::{
    register_startup_events, initial_actions, actions_run
};
use controller::global::AppRunner;
use debug::{ DebugBling, MiniBling, create_interactors };
use dom::{ domutil, Bling };

pub struct GlobalImpl {
    apps: HashMap<String,AppRunner>
}

impl GlobalImpl {
    pub fn new() -> GlobalImpl {
        GlobalImpl {
            apps: HashMap::<String,AppRunner>::new(),
        }
    }

    pub fn unregister_app(&mut self, key: &str) {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            e.get_mut().unregister();
        }
    }

    pub fn register_app(&mut self, key: &str, ar: AppRunner) {
        self.apps.insert(key.to_string(),ar);
    }
        
    pub fn with_apprunner<F,G>(&mut self, key: &str, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            let mut ar = e.get_mut().clone();
            Some(cb(&mut ar))
        } else {
            None
        }
    }    

    pub fn get_apprunner(&mut self, key: &str) -> Option<AppRunner> {
        if let Entry::Occupied(mut e) = self.apps.entry(key.to_string()) {
            let mut ar = e.get_mut().clone();
            Some(ar)
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

    pub fn register_app(&mut self, key: &str, el: &HtmlElement, debug: bool) {
        self.unregister_app(key);
        let bling : Box<Bling> = if debug {
            Box::new(DebugBling::new(create_interactors()))
        } else { 
            Box::new(MiniBling::new())
        };
        let ar = AppRunner::new(&GlobalWeak::new(&self),&el,bling);
        {
            self.0.borrow_mut().register_app(key,ar);
        }
        let ar = self.0.borrow_mut().get_apprunner(key);
        if let Some(ar) = ar {
            let app = ar.clone().state();
            actions_run(&mut app.lock().unwrap(),&initial_actions());
        }
    }
        
    #[allow(unused,dead_code)]
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
    for name in vec!{ "body" } {
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
    if let Some(h) = find_main_element() {
        h.focus();
        domutil::add_attr(&h.clone().into(),"class","browser-app-ready");
        domutil::remove_attr(&h.into(),"class","browser-app-not-ready");
    }
}
