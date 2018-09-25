use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex, Weak };

use stdweb::web::{ IElement, HtmlElement, Element };

use arena::Arena;
use controller::input::{ Timers, Timer };
use controller::global::CanvasState;
use controller::output::Projector;
use dom::event::EventControl;

struct CanvasRunnerImpl {
    cg: Arc<Mutex<CanvasState>>,
    projector: Option<Projector>,
    controls: Vec<Box<EventControl<()>>>,
    timers: Timers
}

#[derive(Clone)]
pub struct CanvasRunner(Arc<Mutex<CanvasRunnerImpl>>);

#[derive(Clone)]
pub struct CanvasRunnerWeak(Weak<Mutex<CanvasRunnerImpl>>);

impl CanvasRunner {
    pub fn new(st: CanvasState) -> CanvasRunner {
        CanvasRunner(Arc::new(Mutex::new(CanvasRunnerImpl {
            cg: Arc::new(Mutex::new(st)),
            projector: None,
            controls: Vec::<Box<EventControl<()>>>::new(),
            timers: Timers::new()
        })))
    }
    
    pub fn add_timer<F>(&mut self, cb: F) -> Timer 
                            where F: FnMut(&mut CanvasState, f64) + 'static {
        self.0.lock().unwrap().timers.add(cb)
    }

    pub fn run_timers(&mut self, time: f64) {
        let mut imp = self.0.lock().unwrap();
        let state = &mut imp.cg.clone();
        imp.timers.run(&mut state.lock().unwrap(), time);
    }
    
    pub fn init(&mut self) {
        /* start projector */
        {
            let w = CanvasRunnerWeak(Arc::downgrade(&self.0.clone()));
            let proj = Projector::new(&w);
            let mut imp = self.0.lock().unwrap();
            imp.projector = Some(proj);
        }
        /* size canvas */
        let r = self.state();
        r.lock().unwrap().check_size();
    }
    
    pub fn draw(&mut self) {
        let imp = self.0.lock().unwrap();
        imp.cg.lock().unwrap().draw();
    }
    
    pub fn add_control(&mut self, control: Box<EventControl<()>>) {
        self.0.lock().unwrap().controls.push(control);
    }
    
    pub fn state(&self) -> Arc<Mutex<CanvasState>> {
        self.0.lock().unwrap().cg.clone()
    }
    
    pub fn unregister(&mut self) {
        {
            let cc = &mut self.0.lock().unwrap().controls;
            for c in &mut cc.iter_mut() {
                c.reset();
            }
            cc.clear();
        }
        self.0.lock().unwrap().projector = None;
    }    
}

impl CanvasRunnerWeak {
    pub fn upgrade(&self) -> Option<CanvasRunner> {
        self.0.upgrade().map(|cr| CanvasRunner(cr))
    }    
}
