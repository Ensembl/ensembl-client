use std::collections::HashMap;
use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ IElement, HtmlElement, Element, IHtmlElement };


use composit::StateManager;
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
    Timer, register_startup_events
};
use controller::global::{ CanvasRunner, CanvasState };
use debug::setup_testcards;
use dom::domutil;
use types::CPixel;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct Global {
    cg: Option<CanvasRunner>,
    inst: u32,
    state: Arc<Mutex<StateManager>>,
    elements: HashMap<String,Element>
    
}

impl Global {
    pub fn new() -> Global {
        Global {
            cg: None,
            inst: 0,
            state: Arc::new(Mutex::new(StateManager::new())),
            elements: HashMap::<String,Element>::new()
        }
    }
        
    fn setup_dom(&mut self, root: &Element, el: &Element) -> (HtmlElement,String) {
        self.inst += 1;
        domutil::inner_html(el,CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(el,"canvas").try_into().unwrap();
        debug!("global","start card {}",self.inst);
        let inst_s = format!("{}",self.inst);
        root.set_attribute("data-inst",&inst_s).ok();
        (canv_el,inst_s)
    }
    
    pub fn reset(&mut self) -> String {
        let root : HtmlElement = domutil::query_selector_new("#bpane-container .bpane-canv").unwrap().try_into().unwrap();
        let el : HtmlElement = root.clone().into();
        let elel : Element = root.clone().into();
        self.cg.as_mut().map(|cg| { cg.unregister() });
        let (canv_el,inst_s) = self.setup_dom(&root.into(),&elel);
        let cs = CanvasState::new(&self.state,&canv_el);
        let mut cg = CanvasRunner::new(cs);
        register_user_events(&mut cg,&canv_el);
        register_direct_events(&mut cg,&el);
        register_dom_events(&mut cg,&canv_el);
        cg.init();
        self.cg = Some(cg);
        inst_s
    }
    
    pub fn with_state<F,G>(&mut self, cb: F) -> Option<G>
            where F: FnOnce(&mut CanvasState) -> G {
        self.with_runner(|r| {
            let mut st = r.state();
            let mut st = st.lock().unwrap();
            cb(&mut st)
        })
    }
    
    pub fn with_runner<F,G>(&mut self, cb:F) -> Option<G>
            where F: FnOnce(&mut CanvasRunner) -> G {
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
