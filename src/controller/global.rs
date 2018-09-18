use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };

use stdweb::web::{ IElement, HtmlElement, Element };

use dom::domutil;
use arena::Arena;
use stage::Stage;
use campaign::{ StateManager };
use controller::EventRunner;
use controller::direct::DirectEventManager;
use controller::user::UserEventManager;
use controller::projector::Projector;
use controller::timers::{ Timers, Timer };
use controller::runner::Event;
use types::CPixel;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct CanvasGlobal {
    pub er: Rc<RefCell<EventRunner>>,
    arena: Arc<Mutex<Arena>>,
    stage: Arc<Mutex<Stage>>,
    state: Arc<Mutex<StateManager>>,
    userev: UserEventManager,
    directev: DirectEventManager,
    projector: Option<Projector>,
}

pub struct CanvasGlobalInst {
    pub cg: CanvasGlobal,
    timers: Timers
}

impl CanvasGlobal {
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        self.arena.lock().unwrap().draw(&oom,&stage);
    }

    pub fn with_arena<F,G>(&mut self, cb: F) -> G where F: FnOnce(&mut Arena) -> G {
        let a = &mut self.arena.lock().unwrap();
        cb(a)
    }
    
    pub fn with_stage<F,G>(&mut self, cb: F) -> G where F: FnOnce(&mut Stage) -> G {
        let a = &mut self.stage.lock().unwrap();
        cb(a)
    }

    pub fn with_state<F,G>(&self, cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
        let a = &mut self.state.lock().unwrap();
        cb(a)
    }
}

impl CanvasGlobalInst {
    pub fn add_timer<F>(&mut self, cb: F) -> Timer 
                            where F: FnMut(&mut CanvasGlobal, f64) + 'static {
        self.timers.add(cb)
    }

    pub fn run_timers(&mut self, time: f64) {
        self.timers.run(&mut self.cg, time);
    }
}

pub struct Global {
    root: HtmlElement,
    cg: Option<Rc<RefCell<CanvasGlobalInst>>>,
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
        if let Some(ref mut cg) = self.cg {
            let mut cg = cg.borrow_mut();
            cg.cg.userev.reset();
            cg.cg.directev.reset();
            cg.cg.projector = None;
        }
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        self.clear_old_events();
        let (canv_el,inst_s) = self.setup_dom(el);
        let arena = Arc::new(Mutex::new(Arena::new(&canv_el)));
        let stage = Arc::new(Mutex::new(Stage::new(&self.root)));
        let er = Rc::new(RefCell::new(EventRunner::new(
                            arena.clone(),
                            stage.clone(),
                            self.state.clone())));
        let mut timers = Timers::new();
        self.cg = Some(Rc::new(RefCell::new(
            CanvasGlobalInst {
                cg: CanvasGlobal {
                    arena, stage,
                    er: er.clone(),
                    state: self.state.clone(),
                    userev: UserEventManager::new(&er,&canv_el,&mut timers),
                    directev: DirectEventManager::new(&er,el),
                    projector: None
                },
                timers
            })));
        self.cg.as_ref().unwrap().borrow_mut().cg.projector = Some(
            Projector::new(self.cg.as_ref().unwrap())
        );
        inst_s
    }
    
    pub fn add_events(&mut self, evv: Vec<Event>) {
        self.cg.as_mut().map(|cg| {
            let cg = &mut cg.borrow_mut();
            cg.cg.er.borrow_mut().run(evv);
        });
    }
    
    pub fn with_arena<F,G>(&mut self, cb: F) -> Option<G> where F: FnOnce(&mut Arena) -> G {
        self.cg.as_mut().map(|cg| {
            cg.borrow_mut().cg.with_arena(cb)
        })
    }
    
    /* only for test-cards, etc, which need to know how big to draw */
    pub fn canvas_size(&self) -> CPixel {
        let cg = &self.cg.as_ref().unwrap().borrow();
        let out = cg.cg.stage.lock().unwrap().get_size();
        out
    }

    pub fn draw(&mut self) {
        self.cg.as_ref().unwrap().borrow_mut().cg.draw();
    }
    
    pub fn add_timer<F>(&mut self, cb: F) -> Option<Timer> 
                            where F: FnMut(&mut CanvasGlobal, f64) + 'static {
        self.cg.as_mut().map(|cg| cg.borrow_mut().add_timer(cb))
    }    
}
