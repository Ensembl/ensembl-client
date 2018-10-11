use std::sync::{ Arc, Mutex };

use stdweb::unstable::TryInto;
use stdweb::web::{ IElement, HtmlElement, Element };

use print::{ PrintRun, Programs };
use composit::{ Compositor, StateManager };
use controller::input::{ Event, events_run };
use drawing::AllCanvasMan;
use dom::domutil;
use stage::Stage;
use types::{ Dot };
use wglraw;

use webgl_rendering_context::WebGLRenderingContext as glctx;
use stdweb::web::html_element::{
    CanvasElement
};
pub struct CanvasState {
    canv_el: HtmlElement,
    ctx: glctx,
    progs: Programs,
    acm: AllCanvasMan,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>
}

impl CanvasState {
    pub fn new(state: &Arc<Mutex<StateManager>>, canv_el: &HtmlElement) -> CanvasState {
        let canvas = canv_el.clone().try_into().unwrap();
        let ctx = wglraw::prepare_context(&canvas);
        let progs = Programs::new(&ctx);
        CanvasState {
            canv_el: canv_el.clone(),
            ctx, progs,
            acm: AllCanvasMan::new("#managedcanvasholder"),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new())),
            state: state.clone(),
        }
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        let mut pr = PrintRun::new();
        pr.go(&mut compo,&oom,&stage,&mut self.progs,&self.ctx,&mut self.acm);
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
    
    pub fn run_events(self: &CanvasState, evs: Vec<Event>) {
        events_run(self,evs);
    }
    
    pub fn check_size(self: &CanvasState) {
        events_run(self,vec! {
            Event::Resize(domutil::size(&self.canv_el))
        });
    }
 
    pub fn force_size(self: &CanvasState, sz: Dot<i32,i32>) {
        // force CSS onto attributes of canvas tag
        let elel: Element =  self.canv_el.clone().into();
        let elc : CanvasElement = elel.clone().try_into().unwrap();
        elc.set_width(sz.0 as u32);
        elc.set_height(sz.1 as u32);
        let stage = self.stage.lock().unwrap();
        let sz = stage.get_size();
        self.ctx.viewport(0,0,sz.0,sz.1);
    }
}
