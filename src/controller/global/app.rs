use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;

use composit::{ Compositor, StateManager, Stage };
use controller::input::{ Event, events_run, startup_events };
use print::Printer;

pub struct App {
    pub printer: Arc<Mutex<Printer>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>
}

impl App {
    pub fn new(state: &Arc<Mutex<StateManager>>, canv_el: &HtmlElement) -> App {
        let out = App {
            printer: Arc::new(Mutex::new(Printer::new(&canv_el))),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new())),
            state: state.clone(),
        };
        out.run_events(startup_events());
        out
    }
    
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

    pub fn with_app<F,G>(&self, cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
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
