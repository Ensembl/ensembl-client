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

pub struct Printer {
    canv_el: HtmlElement,
    ctx: glctx,
    progs: Programs,
    acm: AllCanvasMan,
}

impl Printer {
    pub fn new(canv_el: &HtmlElement) -> Printer {
        let canvas = canv_el.clone().try_into().unwrap();
        let ctx = wglraw::prepare_context(&canvas);
        let progs = Programs::new(&ctx);
        Printer {
            canv_el: canv_el.clone(),
            acm: AllCanvasMan::new("#managedcanvasholder"),
            ctx, progs
        }
    }
    
    pub fn draw(&mut self,stage: &Stage, oom: &StateManager, compo: &mut Compositor) {
        let mut pr = PrintRun::new();
        pr.go(compo,oom,stage,&mut self.progs,&self.ctx,&mut self.acm);
    }
    
    pub fn set_size(&mut self, s: Dot<i32,i32>) {
        let elel: Element =  self.canv_el.clone().into();
        let elc : CanvasElement = elel.clone().try_into().unwrap();
        elc.set_width(s.0 as u32);
        elc.set_height(s.1 as u32);
        self.ctx.viewport(0,0,s.0,s.1);
    }
    
    pub fn get_real_size(&self) -> Dot<i32,i32> {
        domutil::size(&self.canv_el)
    }
}
