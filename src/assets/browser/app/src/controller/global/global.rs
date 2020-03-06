use commander::{ Agent, RunConfig };
use std::cell::RefCell;
use hashbrown::{ HashMap, HashSet };
use std::rc::{ Rc, Weak };

use stdweb::web::{ document, HtmlElement, window };
use url::Url;
use crate::util::{ set_instance_id, get_instance_id };

use crate::controller::input::{
    register_startup_events, register_shutdown_events, register_direct_events
};
use crate::controller::global::{ AppRunner, Booting };
use crate::controller::output::Counter;
use crate::controller::scheduler::Commander;
use crate::data::{ BackendConfigBootstrap, HttpManager };
use crate::dom::domutil;
use stdweb::unstable::TryInto;
use crate::debug::{ BlackboxSender, BlackboxIntegration };
use blackbox::blackbox_integration;

use super::activate::activate;
use crate::dom::domutil::browser_time;

const SCHEDULER_ALLOC : f64 = 12.; /* ms per raf */

pub struct GlobalImpl {
    inst_id: String,
    app_runners: HashMap<String,AppRunner>,
    http_manager: HttpManager,
    counter: Counter,
    ar_init: Vec<Box<dyn FnMut(&AppRunner)>>,
    commander: Commander,
    blackbox_senders: HashSet<BlackboxSender>
}

impl GlobalImpl {
    pub fn new() -> GlobalImpl {
        set_instance_id();
        let commander = Commander::new(&document().document_element().unwrap().try_into().unwrap());
        let mut out = GlobalImpl {
            counter: Counter::new(),
            inst_id: get_instance_id(),
            app_runners: HashMap::new(),
            http_manager: HttpManager::new(&commander),
            ar_init: Vec::new(),
            commander,
            blackbox_senders: HashSet::new()
        };
        out.init_http_manager();
        out
    }

    fn init_http_manager(&mut self) {
        let mut exe = self.commander.executor();
        let rc = RunConfig::new(None,0,None);
        let agent = exe.new_agent(&rc,"http-manager");
        exe.add(self.http_manager.clone().main_loop(agent.clone()),agent);
    }

    fn add_blackbox(&mut self, sender: BlackboxSender) {
        self.blackbox_senders.insert(sender);
    }

    fn blackbox_send(&mut self) {
        for sender in self.blackbox_senders.iter() {
            sender.send(&self.http_manager,browser_time());
        }
    }

    pub fn counter(&self) -> Counter {
        self.counter.clone()
    }

    pub fn get_instance_id(&self) -> &str { &self.inst_id }

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
        console!("A");
        out.init_blackbox_loop();
        out
    }
    
    pub fn counter(&self) -> Counter {
        self.0.borrow().counter()
    }

    pub fn add_blackbox(&self, sender: BlackboxSender) {
        self.0.borrow_mut().add_blackbox(sender);
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

    async fn boot(mut self, agent: Agent, key: String, el: HtmlElement, debug: bool, config_url: Url) {
        let http_manager = &self.0.borrow().http_manager.clone();
        BackendConfigBootstrap::new(&agent,self,&http_manager.clone(),&config_url,&el,&key,debug).await;
    }

    async fn blackbox_loop(mut self, agent: Agent) {
        loop {
            self.0.borrow_mut().blackbox_send();
            agent.timer(10000.).await;
        }
    }

    #[cfg(blackbox)]
    fn init_blackbox_loop(&self) {
        blackbox_integration(BlackboxIntegration{});
        let cmd = self.0.borrow_mut().commander.clone();
        let mut exe = cmd.executor();
        let rc = RunConfig::new(None,0,None);
        let agent = exe.new_agent(&rc,"blackbox");
        exe.add(self.clone().blackbox_loop(agent.clone()),agent);
    }

    #[cfg(not(blackbox))]
    fn init_blackbox_loop(&self) {}

    pub fn trigger_app(&mut self, key: &str, el: &HtmlElement, debug: bool, config_url: &Url) {
        self.unregister_app(key,true);
        let cmd = self.0.borrow_mut().commander.clone();
        let mut exe = cmd.executor();
        let rc = RunConfig::new(None,0,None);
        let agent = exe.new_agent(&rc,"legacy-app");
        exe.add(self.clone().boot(agent.clone(),key.to_string(),el.clone(),debug,config_url.clone()),agent);
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
