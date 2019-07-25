use std::sync::{ Arc, Mutex };

use serde_json::Value as JSONValue;
use stdweb::web::event::IEvent;
use stdweb::web::HtmlElement;
use url::Url;

use controller::input::{
    initial_actions, actions_run, run_direct_events
};
use controller::global::{ AppRunner, App, GlobalWeak, Global };

use data::{ HttpManager, BackendConfig };
use data::blackbox::BlackBoxDriver;

#[cfg(any(not(deploy),console))]
use data::blackbox::{ 
    BlackBoxDriverImpl, HttpBlackBoxDriverImpl,
    NullBlackBoxDriverImpl };

#[cfg(not(deploy))]
use debug::{ DebugBling, create_interactors };
use dom::{ Bling, NoBling };
use dom::event::{ EventListener, Target, EventData, EventType, EventControl, ICustomEvent };

pub struct Booting {
    global: Global,
    http_manager: HttpManager,
    config_url: Url,
    el: HtmlElement,
    key: String,
    debug: bool,
}

impl Booting {
    pub fn new(g: &mut Global, http_manager: &HttpManager, config_url: &Url,
            el: &HtmlElement, key: &str, debug: bool) -> Booting {
        let mut out = Booting {
            global: g.clone(),
            http_manager: http_manager.clone(),
            config_url: config_url.clone(),
            el: el.clone(),
            key: key.to_string(),
            debug,
        };
        out
    }
    
    #[cfg(any(not(deploy),console))]
    fn make_blackbox(&self, debug_url: &Option<String>) -> BlackBoxDriver {
        let reporter_driver : Box<BlackBoxDriverImpl> = if debug_url.is_some() {
            let debug_url = self.config_url.join(&debug_url.as_ref().unwrap()).ok().unwrap();
            console!("debug-url {:?}",debug_url);
            Box::new(HttpBlackBoxDriverImpl::new(&self.http_manager,&debug_url))
        } else {
            Box::new(NullBlackBoxDriverImpl::new())
        };
        BlackBoxDriver::new(reporter_driver)
    }

    #[cfg(all(deploy,not(console)))]
    fn make_blackbox(&self, _debug_url: &Option<String>) -> BlackBoxDriver {
        BlackBoxDriver::new()
    }

    #[cfg(not(deploy))]
    fn bling(&self) -> Box<Bling> {
        if self.debug {
            Box::new(DebugBling::new(create_interactors()))
        } else { 
            Box::new(NoBling::new())
        }
    }
    
    #[cfg(deploy)]
    fn bling(&self) -> Box<Bling> {
        Box::new(NoBling::new())
    }
    
    pub fn boot(&mut self, config: &BackendConfig) {
        let mut global = self.global.clone();
        let bling : Box<Bling> = self.bling();
        let debug_url = config.get_debug_url();
        let blackbox = self.make_blackbox(debug_url);
        let ar = AppRunner::new(
            &GlobalWeak::new(&global),&self.http_manager,
            &self.el,bling,&self.config_url,config,
            blackbox
        );
        {
            global.register_app_now(&self.key,ar.clone());
        }
        let app = ar.clone().state();
        app.lock().unwrap().run_actions(&initial_actions(),None);
        console!("booted");
    }
}
