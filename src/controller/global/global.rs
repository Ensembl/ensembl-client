use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };

use stdweb::web::{ IElement, HtmlElement, Element };

use arena::Arena;
use composit::{ Compositor, StateManager };
use controller::input::{
    register_direct_events, register_user_events, Event, events_run,
    Timers, Timer
};
use controller::global::{ CanvasRunner, CanvasState };
use controller::output::Projector;
use dom::domutil;
use dom::event::EventControl;
use stage::Stage;
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
        
    fn setup_dom(&mut self, el: &Element) -> (Element,String) {
        self.inst += 1;
        domutil::inner_html(el,CANVAS);
        let canv_el = domutil::query_selector(el,"canvas");
        debug!("global","start card {}",self.inst);
        let inst_s = format!("{}",self.inst);
        self.root.set_attribute("data-inst",&inst_s).ok();
        (canv_el,inst_s)
    }

    fn clear_old_events(&mut self) {
        self.cg.as_mut().map(|cg| { cg.unregister() });
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        self.clear_old_events();
        let (canv_el,inst_s) = self.setup_dom(el);
        let arena = Arc::new(Mutex::new(Arena::new(&canv_el)));
        let compo = Arc::new(Mutex::new(Compositor::new()));
        let stage = Arc::new(Mutex::new(Stage::new(&self.root)));
        let mut cg = CanvasRunner::new(
                CanvasState {
                    arena, stage, compo,
                    state: self.state.clone(),
                }
        );
        register_user_events(&mut cg,&canv_el);
        register_direct_events(&mut cg,&el);
        cg.start_projector();
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
