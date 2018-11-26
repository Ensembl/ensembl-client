use std::sync::{ Arc, Mutex };

use stdweb::web::{ Element, HtmlElement };
use stdweb::unstable::TryInto;

use composit::{ Compositor, StateManager, Stage };
use controller::input::{ Event, events_run, startup_events };
use dom::{ domutil, Bling };
use print::Printer;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct App {
    el: Element,
    browser_el: Element,
    canv_el: HtmlElement,
    pub printer: Arc<Mutex<Printer>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>
}

impl App {
    pub fn new(el: &Element, bling: Box<Bling>) -> App {
        let el = el.clone();
        let browser_el : Element = bling.apply_bling(&el);
        domutil::inner_html(&browser_el,CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&browser_el,"canvas").try_into().unwrap();
        let out = App {
            el, browser_el, canv_el: canv_el.clone(),
            printer: Arc::new(Mutex::new(Printer::new(&canv_el))),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new())),
            state: Arc::new(Mutex::new(StateManager::new())),
        };
        out.run_events(startup_events());
        out
    }
    
    pub fn get_element(&self) -> &Element { &self.el }
    
    pub fn get_canvas_element(&self) -> &HtmlElement { &self.canv_el }
    
    pub fn finish(&mut self) {
        self.printer.lock().unwrap().finish();
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        self.printer.lock().unwrap().go(&stage,&oom,&mut compo);
    }
    
    pub fn with_stage<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Stage) -> G {
        let a = &mut self.stage.lock().unwrap();
        cb(a)
    }

    pub fn with_state<F,G>(&self, cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
        let a = &mut self.state.lock().unwrap();
        cb(a)
    }

    pub fn with_compo<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Compositor) -> G {
        let a = &mut self.compo.lock().unwrap();
        cb(a)
    }
    
    pub fn run_events(self: &App, evs: Vec<Event>) {
        events_run(self,evs);
    }
        
    pub fn check_size(self: &App) {
        let sz = self.printer.lock().unwrap().get_real_size();
        events_run(self,vec! {
            Event::Resize(sz)
        });
    }
 
    pub fn force_size(self: &App) {
        let stage = self.stage.lock().unwrap();
        self.printer.lock().unwrap().set_size(stage.get_size());
    }
}
