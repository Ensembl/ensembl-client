use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };

use stdweb::web::{ IElement, HtmlElement, Element };

use dom::domutil;
use dom::event::EventControl;
use arena::Arena;
use stage::Stage;
use composit::{ StateManager };
use controller::direct::register_direct_events;
use controller::user::register_user_events;
use controller::projector::Projector;
use controller::timers::{ Timers, Timer };
use controller::runner::Event;
use composit::Compositor;
use types::CPixel;
use controller::runner::events_run;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct CanvasGlobal {
    arena: Arc<Mutex<Arena>>,
    stage: Arc<Mutex<Stage>>,
    state: Arc<Mutex<StateManager>>,
    compo: Arc<Mutex<Compositor>>,
    projector: Option<Projector>,
    controls: Vec<Box<EventControl<()>>>
}

pub struct CanvasGlobalInst {
    pub cg: Arc<Mutex<CanvasGlobal>>,
    pub timers: Timers
}

impl CanvasGlobal {
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        self.arena.lock().unwrap().draw(&mut compo,&oom,&stage);
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
    
    pub fn add_control(&mut self, control: Box<EventControl<()>>) {
        self.controls.push(control);
    }

    pub fn unregister(&mut self) {
        for c in &mut self.controls.iter_mut() {
            c.reset();
        }
        self.controls.clear();
    }
}

impl CanvasGlobalInst {
    pub fn add_timer<F>(&mut self, cb: F) -> Timer 
                            where F: FnMut(&mut CanvasGlobal, f64) + 'static {
        self.timers.add(cb)
    }

    pub fn run_timers(&mut self, time: f64) {
        self.timers.run(&mut self.cg.lock().unwrap(), time);
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
            cg.cg.lock().unwrap().unregister();
            cg.cg.lock().unwrap().projector = None;
        }
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        self.clear_old_events();
        let (canv_el,inst_s) = self.setup_dom(el);
        let arena = Arc::new(Mutex::new(Arena::new(&canv_el)));
        let compo = Arc::new(Mutex::new(Compositor::new()));
        let stage = Arc::new(Mutex::new(Stage::new(&self.root)));
        let timers = Timers::new();
        self.cg = Some(Rc::new(RefCell::new(
            CanvasGlobalInst {
                cg: Arc::new(Mutex::new(CanvasGlobal {
                    arena, stage, compo,
                    state: self.state.clone(),
                    projector: None,
                    controls: Vec::<Box<EventControl<()>>>::new()
                })),
                timers
            })));
        {
            let cgr = &mut self.cg.as_ref().unwrap().borrow_mut();        
            register_user_events(cgr,&canv_el);
            register_direct_events(cgr,&el);
        }
        let cg = &mut self.cg.as_ref().unwrap().borrow_mut();
        let cg = &mut cg.cg.lock().unwrap();
        cg.projector = Some(Projector::new(self.cg.as_ref().unwrap()));
        inst_s
    }
    
    pub fn add_events(&mut self, evv: Vec<Event>) {
        self.cg.as_mut().map(|cg| {
            let cg = &mut cg.borrow_mut();
            events_run(&cg.cg.lock().unwrap(),evv);
        });
    }
    
    pub fn with_compo<F,G>(&mut self, cb: F) -> Option<G> where F: FnOnce(&mut Compositor) -> G {
        self.cg.as_mut().map(|cg| {
            let cg = &mut cg.borrow_mut();
            let cg = cg.cg.lock().unwrap();
            cg.with_compo(cb)
        })
    }
    
    /* only for test-cards, etc, which need to know how big to draw */
    pub fn canvas_size(&self) -> CPixel {
        let cg = &self.cg.as_ref().unwrap().borrow();
        let st = cg.cg.lock().unwrap();
        let out = st.stage.lock().unwrap().get_size();
        out
    }

    pub fn draw(&mut self) {
        let cg = &mut self.cg.as_ref().unwrap().borrow_mut();
        cg.cg.lock().unwrap().draw();
    }
    
    pub fn add_timer<F>(&mut self, cb: F) -> Option<Timer> 
                            where F: FnMut(&mut CanvasGlobal, f64) + 'static {
        self.cg.as_mut().map(|cg| cg.borrow_mut().add_timer(cb))
    }
}
