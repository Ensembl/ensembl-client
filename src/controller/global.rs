use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };
use dom::domutil;
use stdweb::web::{ IElement, HtmlElement, Element };
use arena::{ Arena, Stage };
use types::{ CPixel };

use campaign::{ StateManager };
use controller::EventRunner;
use controller::direct::DirectEventManager;
use controller::user::UserEventManager;

const CANVAS : &str = r##"<canvas id="glcanvas"></canvas>"##;

pub struct Global {
    inst: u32,
    root: HtmlElement,
    arena: Option<Arc<Mutex<Arena>>>,
    stage: Arc<Mutex<Stage>>,
    state: Arc<Mutex<StateManager>>,
    userev: Option<UserEventManager>,
    directev: Option<DirectEventManager>
}

impl Global {
    pub fn new(root: &HtmlElement) -> Global {
        let s = Arc::new(Mutex::new(Stage::new(root)));
        Global {
            inst: 0,
            root: root.clone(),
            arena: None,
            stage: s.clone(),
            state: Arc::new(Mutex::new(StateManager::new())),
            userev: None,
            directev: None
        }
    }
    
    pub fn dims(&mut self) -> CPixel {
        self.stage.lock().unwrap().get_size()
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
        if let Some(ref mut ev) = self.userev {ev.reset(); }
        if let Some(ref mut ev) = self.directev { ev.reset(); }
        self.userev = None;
        self.directev = None;
    }

    fn setup_new_events(&mut self, el: &Element, canv_el: &Element) {
        let er = Rc::new(RefCell::new(EventRunner::new(
                            self.arena.as_ref().unwrap().clone(),
                            self.stage.clone(),
                            self.state.clone())));
        self.userev = Some(UserEventManager::new(&er,canv_el));
        self.directev = Some(DirectEventManager::new(&er,el));
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        self.clear_old_events();
        let (canv_el,inst_s) = self.setup_dom(el);
        self.arena = Some(Arc::new(Mutex::new(Arena::new(&canv_el))));
        self.setup_new_events(&el,&canv_el);
        inst_s
    }
        
    pub fn with_arena<F>(&self, mut cb: F) where F: FnOnce(&mut Arena) -> () {
        let ar = &mut self.arena.as_ref().unwrap();
        let a = &mut ar.lock().unwrap();
        cb(a)
    }
    
    pub fn with_stage<F>(&self, mut cb: F) where F: FnOnce(&mut Stage) -> () {
        let a = &mut self.stage.lock().unwrap();
        cb(a)
    }
    
    pub fn with_state<F,G>(&self, mut cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
        let a = &mut self.state.lock().unwrap();
        cb(a)
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let ar = &mut self.arena.as_ref().unwrap();
        ar.lock().unwrap().draw(&oom,&stage);
    }
}

