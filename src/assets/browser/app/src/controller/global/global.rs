use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::{ Rc, Weak };

use stdweb::web::{ HtmlElement, window };
use url::Url;
use util::{ set_instance_id, get_instance_id };

use controller::input::{
    register_startup_events, register_shutdown_events, register_direct_events
};
use controller::global::{ AppRunner, Booting };
use controller::output::Counter;
use controller::scheduler::{ Scheduler, SchedulerGroup };
use data::{ BackendConfigBootstrap, HttpManager };
use dom::domutil;

use super::activate::activate;

const SCHEDULER_ALLOC : f64 = 12.; /* ms per raf */

pub struct GlobalImpl {
    inst_id: String,
    app_runners: HashMap<String,AppRunner>,
    http_manager: HttpManager,
    scheduler: Scheduler,
    sched_group: SchedulerGroup,
    counter: Counter,
    ar_init: Vec<Box<dyn FnMut(&AppRunner)>>
}

impl GlobalImpl {
    pub fn new() -> GlobalImpl {
        let scheduler = Scheduler::new();
        let sched_group = scheduler.make_group();
        set_instance_id();
        let mut out = GlobalImpl {
            counter: Counter::new(),
            inst_id: get_instance_id(),
            app_runners: HashMap::new(),
            http_manager: HttpManager::new(),
            scheduler,
            sched_group,
            ar_init: Vec::new()
        };
        out.init();
        out
    }

    fn init(&mut self) {
        self.scheduler.set_timesig(2);
        let http_manager = self.http_manager.clone();
        self.sched_group.add("http-manager",Box::new(move |sr| {
            if !http_manager.tick() {
                sr.unproductive();
            }
        }),3,false);
    }

    pub fn counter(&self) -> Counter {
        self.counter.clone()
    }

    pub fn get_instance_id(&self) -> &str { &self.inst_id }

    pub fn scheduler(&self) -> Scheduler {
        self.scheduler.clone()
    }

    pub fn destroy(&mut self) {
        for app_runner in self.app_runners.values_mut() {
            app_runner.destroy();
        }
    }

    pub fn unregister_app(&mut self, key: &str, call_destroy: bool) {
        if let Some(mut app) = self.app_runners.remove(key) {
            if call_destroy {
                app.destroy();
            }
        }
    }

    pub fn register_ar_init(&mut self, mut cb: Box<dyn FnMut(&AppRunner)>) {
        for ar in self.app_runners.values_mut() {
            cb(&ar.clone());
        }
        self.ar_init.push(cb);
    }

    pub fn register_app(&mut self, key: &str, app_runner: AppRunner) {
        for ari in &mut self.ar_init {
            ari(&app_runner.clone());
        }
        self.app_runners.insert(key.to_string(),app_runner);
    }

    pub fn find_app(&mut self, el: &HtmlElement) -> Option<AppRunner> {
        for ar in self.app_runners.values_mut() {
            if ar.find_app(el) {
                return Some(ar.clone())
            }
        }
        return None
    }

    pub fn any_app(&mut self) -> Option<AppRunner> {
        for ar in self.app_runners.values_mut() {
            return Some(ar.clone());
        }
        None
    }        
}

#[derive(Clone)]
pub struct Global(Rc<RefCell<GlobalImpl>>);

impl Global {
    pub fn new() -> Global {
        let mut out = Global(Rc::new(RefCell::new(GlobalImpl::new())));
        register_startup_events(&mut out);
        register_shutdown_events(&mut out);
        out.tick();
        out
    }

    /* scheduler-related */    
    pub fn tick(&mut self) {
        let sched = self.0.borrow_mut().scheduler().clone();
        sched.beat(SCHEDULER_ALLOC);
        let mut out = self.clone();
        window().request_animation_frame(
            move |_| out.tick()
        );
    }
    
    pub fn scheduler(&self) -> Scheduler {
        self.0.borrow().scheduler()
    }    
    
    pub fn counter(&self) -> Counter {
        self.0.borrow().counter()
    }

    /* app registration */
    pub fn unregister_app(&mut self, key: &str, call_destroy: bool) {
        self.0.borrow_mut().unregister_app(key, call_destroy);
    }

    pub fn find_app(&mut self, el: &HtmlElement) -> Option<AppRunner> {
        self.0.borrow_mut().find_app(el)
    }

    pub fn any_app(&mut self) -> Option<AppRunner> {
        self.0.borrow_mut().any_app()
    }

    pub fn trigger_app(&mut self, key: &str, el: &HtmlElement, debug: bool, config_url: &Url) {
        self.unregister_app(key,true);
        let http_manager = &self.0.borrow().http_manager.clone();
        let mut bcb = BackendConfigBootstrap::new(&http_manager.clone(),config_url);
        let b : Rc<RefCell<Booting>> = Rc::new(
            RefCell::new(
                Booting::new(self,http_manager,config_url,el,key,debug)
            )
        );
        bcb.add_callback(Box::new(move |config| {
            b.borrow_mut().boot(config);
        }));
    }
    
    pub fn register_app_now(&mut self, key: &str, ar: AppRunner) {
        self.0.borrow_mut().register_app(key,ar);
    }

    pub fn register_ar_init(&mut self, cb: Box<dyn FnMut(&AppRunner)>) {
        self.0.borrow_mut().register_ar_init(cb);
    }

    /* destruction */
    pub fn destroy(&mut self) {
        self.0.borrow_mut().destroy();
    }
}

#[derive(Clone)]
pub struct GlobalWeak(Weak<RefCell<GlobalImpl>>);

impl GlobalWeak {
    pub fn new(g : &Global) -> GlobalWeak {
        GlobalWeak(Rc::downgrade(&g.0))
    }
    
    pub fn upgrade(&mut self) -> Option<Global> {
        self.0.upgrade().map(|x| Global(x))
    }
}

pub fn setup_global() {
    /* setup */
    let mut g = Global::new();
    /* mark as ready */
    let body = domutil::query_selector_ok_doc("body","Cannot find body element");
    domutil::add_attr(&body,"class","browser-app-ready");
    domutil::remove_attr(&body.into(),"class","browser-app-not-ready");
    let mut eqm = register_direct_events(&g);
    g.register_ar_init(Box::new(move |ar| eqm.register_ar(&ar)));
    /* setup ping/pong */
    activate();
}
