use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::HtmlElement;

use print::{ Printer, PrintRun, Programs };
use composit::{ Compositor, StateManager };
use controller::input::{ Event, events_run };
use stage::Stage;
use wglraw;

pub struct CanvasState {
    pub printer: Arc<Mutex<Printer>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>
}

impl CanvasState {
    pub fn new(state: &Arc<Mutex<StateManager>>, canv_el: &HtmlElement) -> CanvasState {
        CanvasState {
            printer: Arc::new(Mutex::new(Printer::new(&canv_el))),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new())),
            state: state.clone(),
        }
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        self.printer.lock().unwrap().draw(&stage,&oom,&mut compo);
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

    pub fn with_printer<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Printer) -> G {
        let a = &mut self.printer.lock().unwrap();
        cb(a)
    }
    
    pub fn run_events(self: &CanvasState, evs: Vec<Event>) {
        events_run(self,evs);
    }
    
    pub fn check_size(self: &CanvasState) {
        let sz = self.printer.lock().unwrap().get_real_size();
        events_run(self,vec! {
            Event::Resize(sz)
        });
    }
 
    pub fn force_size(self: &CanvasState) {
        let stage = self.stage.lock().unwrap();
        self.printer.lock().unwrap().set_size(stage.get_size());
    }
}
