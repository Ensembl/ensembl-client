use std::cell::RefCell;
use std::collections::HashMap;
use std::collections::hash_map::Entry;
use std::rc::{ Rc, Weak };
use std::sync::{ Arc, Mutex };

use serde_json::Value as JSONValue;
use stdweb::unstable::TryInto;
use stdweb::web::event::IEvent;
use stdweb::web::{ HtmlElement, Element, IHtmlElement, window };
use url::Url;

use controller::input::{
    register_startup_events, initial_actions, actions_run,
    run_direct_events,
    Timers
};
use controller::global::{ AppRunner, App };
use data::{ BackendConfigBootstrap, HttpManager, BackendConfig };
use debug::{ DebugBling, create_interactors };
use dom::{ domutil, Bling, NoBling };
use dom::event::{ EventListener, Target, EventData, EventType, EventControl, ICustomEvent };

pub struct GlobalImpl {
    apps: HashMap<String,AppRunner>,
    http_manager: HttpManager,
    timers: Timers
}

#[derive(Clone)]
struct BootingMissed(Arc<Mutex<Vec<(String,JSONValue)>>>);

struct BootingEventListener {
    missed: BootingMissed
}

impl BootingMissed {
    fn new() -> BootingMissed {
        BootingMissed(Arc::new(Mutex::new(Vec::<(String,JSONValue)>::new())))
    }
    
    fn add(&mut self, name: &str, details: JSONValue) {
        let mut v = self.0.lock().unwrap();
        v.push((name.to_string(),details));
    }
    
    fn run_missed(&mut self, app: &mut App) {
        let mut v = self.0.lock().unwrap();
        for (event,details) in v.drain(..) {
            match &event[..] {
                "bpane" => run_direct_events(app,&details),
                _ => ()
            };
        }
    }
}

impl BootingEventListener {
    fn new(missed: &BootingMissed) -> BootingEventListener {
        BootingEventListener {
            missed: missed.clone()
        }
    }
}

impl EventListener<()> for BootingEventListener {        
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        if let EventData::CustomEvent(_,_,_,c) = e {
            self.missed.add(&c.event_type(),c.details().unwrap());
        }
    }    
}

pub struct Booting {
    global: Global,
    http_manager: HttpManager,
    config_url: Url,
    el: HtmlElement,
    key: String,
    debug: bool,
    missed: BootingMissed,
    ec: EventControl<()>
}

impl Booting {
    fn new(g: &mut Global, http_manager: &HttpManager, config_url: &Url,
            el: &HtmlElement, key: &str, debug: bool) -> Booting {
        let missed = BootingMissed::new();
        let bel = BootingEventListener::new(&missed);
        let mut out = Booting {
            global: g.clone(),
            http_manager: http_manager.clone(),
            config_url: config_url.clone(),
            el: el.clone(),
            key: key.to_string(),
            debug,
            missed: missed.clone(),
            ec: EventControl::new(Box::new(bel),())
        };
        out.ec.add_event(EventType::CustomEvent("bpane".to_string()));
        out.ec.add_element(&el.clone().into(),());
        out
    }
    
    fn boot(&mut self, config: &BackendConfig) {
        console!("bootstrapping");
        let global = self.global.clone();
        let bling : Box<Bling> = if self.debug {
            Box::new(DebugBling::new(create_interactors()))
        } else { 
            Box::new(NoBling::new())
        };
        let ar = AppRunner::new(
            &GlobalWeak::new(&global),&self.http_manager,
            &self.el,bling,&self.config_url,config
        );
        {
            global.0.borrow_mut().register_app(&self.key,ar);
        }
        let ar = global.0.borrow_mut().get_apprunner(&self.key);
        if let Some(ar) = ar {
            let app = ar.clone().state();
            actions_run(&mut app.lock().unwrap(),&initial_actions());
            console!("fire retro");
            self.ec.reset();
            self.missed.run_missed(&mut app.lock().unwrap());
        }
    }
}

impl GlobalImpl {
    pub fn new() -> GlobalImpl {
        GlobalImpl {
            apps: HashMap::<String,AppRunner>::new(),
            http_manager: HttpManager::new(),
            timers: Timers::new()
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
        let mut out = Global(Rc::new(RefCell::new(GlobalImpl::new())));
        out.tick();
        out
    }
    
    pub fn tick(&mut self) {
        let http_manager = self.0.borrow().http_manager.clone();
        http_manager.tick();
        let mut out = self.clone();
        window().request_animation_frame(
            move |t| out.tick()
        );
    }
    
    pub fn unregister_app(&mut self, key: &str) {
        self.0.borrow_mut().unregister_app(key);
    }

    pub fn register_app(&mut self, key: &str, el: &HtmlElement, debug: bool, config_url: &Url) {
        self.unregister_app(key);
        let http_manager = &self.0.borrow().http_manager.clone();
        let mut bcb = BackendConfigBootstrap::new(&http_manager.clone(),config_url);
        console!("preparing to boot");
        let b : Rc<RefCell<Booting>> = Rc::new(
            RefCell::new(
                Booting::new(self,http_manager,config_url,el,key,debug)
            )
        );
        bcb.add_callback(Box::new(move |config| {
            b.borrow_mut().boot(config);
        }));
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
