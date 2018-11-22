use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ IElement, HtmlElement, Element, IHtmlElement };


use composit::StateManager;
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
    Timer
};
use controller::global::{ CanvasRunner, CanvasState };
use debug::setup_stage_debug;
use debug::setup_testcards;
use dom::domutil;
use types::CPixel;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct Global {
    root: HtmlElement,
    cg: Option<CanvasRunner>,
    inst: u32,
    state: Arc<Mutex<StateManager>>,
}

impl Global {
    pub fn new(root: &HtmlElement) -> Global {
        Global {
            cg: None,
            inst: 0,
            root: root.clone(),
            state: Arc::new(Mutex::new(StateManager::new())),
        }
    }
        
    fn setup_dom(&mut self, el: &Element) -> (HtmlElement,String) {
        self.inst += 1;
        domutil::inner_html(el,CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(el,"canvas").try_into().unwrap();
        debug!("global","start card {}",self.inst);
        let inst_s = format!("{}",self.inst);
        self.root.set_attribute("data-inst",&inst_s).ok();
        (canv_el,inst_s)
    }
    
    pub fn reset(&mut self) -> String {
        let el : HtmlElement = self.root.clone().into();
        let elel : Element = self.root.clone().into();
        self.cg.as_mut().map(|cg| { cg.unregister() });
        let (canv_el,inst_s) = self.setup_dom(&elel);
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
        if let Some(st) = self.cg.as_mut() {
            let mut st = st.state();
            let mut st = st.lock().unwrap();
            Some(cb(&mut st))
        } else {
            None
        }
    }
    
    /* only for test-cards, etc, which need to know how big to draw */
    pub fn canvas_size(&self) -> CPixel {
        let cg = self.cg.as_ref().unwrap().state();
        let st = cg.lock().unwrap();
        let out = st.stage.lock().unwrap().get_size();
        out
    }
    
    /* only for animated test-cards */
    pub fn add_timer<F>(&mut self, cb: F) -> Option<Timer> 
                            where F: FnMut(&mut CanvasState, f64) + 'static {
        self.cg.as_mut().map(|cg| cg.add_timer(cb))
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
    setup_testcards();
    if let Some(h) = find_main_element() {
        h.focus();
        domutil::add_attr(&h.clone().into(),"class","browser-app-ready");
        domutil::remove_attr(&h.into(),"class","browser-app-not-ready");
    }
}
