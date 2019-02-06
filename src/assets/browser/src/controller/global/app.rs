use std::sync::{ Arc, Mutex };

use stdweb::web::{ Element, HtmlElement };
use stdweb::unstable::TryInto;

use composit::{ Compositor, StateManager, Stage };
use controller::input::{ Event, events_run, startup_events };
use controller::global::{ Global, GlobalWeak };
use controller::output::Report;
use dom::domutil;
use print::Printer;

const CANVAS : &str = r##"<canvas></canvas>"##;

pub struct App {
    g: GlobalWeak,
    browser_el: HtmlElement,
    canv_el: HtmlElement,
    pub printer: Arc<Mutex<Printer>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>,
    last_boxsize: Option<f64>,
    report: Option<Report>
}

impl App {
    pub fn new(g: &GlobalWeak, browser_el: &HtmlElement) -> App {
        let browser_el = browser_el.clone();
        domutil::inner_html(&browser_el.clone().into(),CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&browser_el.clone().into(),"canvas").try_into().unwrap();
        let mut out = App {
            g: g.clone(),
            browser_el: browser_el.clone(),
            canv_el: canv_el.clone(),
            printer: Arc::new(Mutex::new(Printer::new(&canv_el))),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new())),
            state: Arc::new(Mutex::new(StateManager::new())),
            last_boxsize: None,
            report: None
        };
        out.run_events(&startup_events());
        out
    }
        
    pub fn get_report(&self) -> &Report { &self.report.as_ref().unwrap() }
        
    pub fn set_report(&mut self, report: Report) {
        self.report = Some(report);
    }
    
    pub fn with_global<F,G>(&mut self, cb:F) -> Option<G>
            where F: FnOnce(&mut Global) -> G {
        self.g.upgrade().as_mut().map(cb)
    }
    
    pub fn get_browser_element(&self) -> &HtmlElement { &self.browser_el }
    
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
        let s = &mut self.stage.lock().unwrap();
        let out = cb(s);
        if let Some(ref report) = self.report {
            s.update_report(report);
        }
        out
    }

    pub fn with_state<F,G>(&self, cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
        let a = &mut self.state.lock().unwrap();
        cb(a)
    }

    pub fn with_compo<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Compositor) -> G {
        let c = &mut self.compo.lock().unwrap();
        let out = cb(c);
        if let Some(ref report) = self.report {
            c.update_report(report);
        }
        out
    }
    
    pub fn run_events(self: &mut App, evs: &Vec<Event>) {
        events_run(self,evs);
    }
        
    pub fn check_size(self: &mut App) {
        let mut sz = self.printer.lock().unwrap().get_available_size();
        sz.0 = ((sz.0+3)/4)*4;
        sz.1 = ((sz.1+3)/4)*4;
        events_run(self,&vec! { Event::Resize(sz) });
    }
 
    pub fn force_size(self: &App) {
        let stage = self.stage.lock().unwrap();
        self.printer.lock().unwrap().set_size(stage.get_size());
    }
}
