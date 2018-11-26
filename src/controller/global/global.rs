use std::collections::{ HashMap, HashSet };
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
use dom::domutil;
use types::CPixel;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct Global {
    cg: Option<AppRunner>,
    elements: HashMap<String,Element>,
    active: HashSet<String>
}

impl Global {
    pub fn new() -> Global {
        Global {
            cg: None,
            elements: HashMap::<String,Element>::new(),
            active: HashSet::<String>::new()
        }
    }

    pub fn reset(&mut self) {
        self.cg.as_mut().map(|cg| { cg.unregister() });
        let el : Element = domutil::query_selector_new("#bpane-container .bpane-canv").unwrap();
        domutil::inner_html(&el,CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&el,"canvas").try_into().unwrap();
        let mut cg = AppRunner::new(&canv_el);
        cg.init();
        self.cg = Some(cg);
    }
        
    pub fn with_apprunner<F,G>(&mut self, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        if let Some(mut st) = self.cg.as_mut() {
            Some(cb(&mut st))
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
    register_startup_events();
    setup_testcards();
    if let Some(h) = find_main_element() {
        h.focus();
        domutil::add_attr(&h.clone().into(),"class","browser-app-ready");
        domutil::remove_attr(&h.into(),"class","browser-app-not-ready");
    }
}
