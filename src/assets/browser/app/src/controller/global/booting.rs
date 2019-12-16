use stdweb::web::HtmlElement;
use url::Url;

use controller::input::{ initial_actions };
use controller::global::{ AppRunner, GlobalWeak, Global };

use data::{ HttpManager, BackendConfig };

#[cfg(not(deploy))]
use debug::{ DebugBling, create_interactors };
use dom::{ Bling, NoBling };

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
         Booting {
            global: g.clone(),
            http_manager: http_manager.clone(),
            config_url: config_url.clone(),
            el: el.clone(),
            key: key.to_string(),
            debug,
        }
    }
    
    #[cfg(not(deploy))]
    fn bling(&self) -> Box<dyn Bling> {
        if self.debug {
            Box::new(DebugBling::new(create_interactors()))
        } else { 
            Box::new(NoBling::new())
        }
    }
    
    #[cfg(deploy)]
    fn bling(&self) -> Box<dyn Bling> {
        Box::new(NoBling::new())
    }
    
    pub fn boot(&mut self, config: &BackendConfig) {
        let mut global = self.global.clone();
        let bling : Box<dyn Bling> = self.bling();
        let debug_url = config.get_debug_url();
        let ar = AppRunner::new(
            &GlobalWeak::new(&global),&self.http_manager,
            &self.el,bling,&self.config_url,config,
            &self.key
        );
        {
            global.register_app_now(&self.key,ar.clone());
        }
        let app = ar.state();
        app.lock().unwrap().run_actions(&initial_actions(),None);
        console!("booted");
    }
}
