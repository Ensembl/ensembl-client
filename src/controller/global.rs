use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };
use dom::domutil;
use stdweb::web::{ IElement, HtmlElement };
use arena::{ Arena, Stage };
use types::{ CPixel };

use campaign::{ StateManager };
use controller::EventRunner;
use controller::direct::DirectEventManager;
use controller::user::UserEventManager;

const CANVAS : &str = r##"
    <canvas id="glcanvas"></canvas>
"##;

pub struct Global {
    inst: u32,
    root: HtmlElement,
    arena: Option<Arc<Mutex<Arena>>>,
    stage: Arc<Mutex<Stage>>,
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
            userev: None,
            directev: None
        }
    }
    
    pub fn dims(&mut self) -> CPixel {
        self.stage.lock().unwrap().get_size()
    }
    
    pub fn reset(&mut self) -> String {
        let el = &self.root.clone().into();
        if let Some(ref mut ev) = self.userev { ev.reset(); }
        if let Some(ref mut ev) = self.directev { ev.reset(); }        
        self.inst += 1;
        domutil::inner_html(el,CANVAS);
        let canv_el = domutil::query_selector(el,"canvas");
        let inst_s = format!("{}",self.inst);
        debug!("global","start card {}",inst_s);
        self.root.set_attribute("data-inst",&inst_s).ok();
        self.arena = Some(Arc::new(Mutex::new(Arena::new(&canv_el))));
        let er = Rc::new(RefCell::new(EventRunner::new(
                            self.arena.as_ref().unwrap().clone(),
                            self.stage.clone())));
        self.userev = Some(UserEventManager::new(&er,&canv_el));
        self.directev = Some(DirectEventManager::new(&er,&canv_el));
        format!("{}",self.inst)
    }
        
    pub fn with_arena<F>(&self, mut cb: F) where F: FnMut(&mut Arena) -> () {
        let ar = &mut self.arena.as_ref().unwrap();
        let a = &mut ar.lock().unwrap();
        cb(a)
    }
    
    pub fn with_stage<F>(&self, mut cb: F) where F: FnMut(&mut Stage) -> () {
        let a = &mut self.stage.lock().unwrap();
        cb(a)
    }
    
    pub fn draw(&mut self, oom: &StateManager) {
        let stage = self.stage.lock().unwrap();
        let ar = &mut self.arena.as_ref().unwrap();
        ar.lock().unwrap().draw(oom,&stage);
    }
}

