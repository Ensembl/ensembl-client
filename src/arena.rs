use std::collections::HashMap;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::HtmlElement;
use webgl_rendering_context::WebGLRenderingContext as glctx;

use drawing::{ FlatCanvas, AllCanvasMan };
use wglraw;
use stage::Stage;
use program::{ Program, GPUSpec, ProgramType, CanvasWeave };
use composit::{ StateManager, Compositor };
use print::{ Programs, PrintRun };
use types::{ Dot };

pub struct Arena {
    pub ctx: glctx,
    pub progs: Programs,
}

impl Arena {
    pub fn new(el: &HtmlElement) -> Arena {
        let canvas = el.clone().try_into().unwrap();
        let ctx = wglraw::prepare_context(&canvas);
        let progs = Programs::new(&ctx);
        let arena = Arena {
            progs, ctx,
        };
        arena
    }

    pub fn draw(&mut self, cman: &mut Compositor, oom: &StateManager, stage: &Stage, acm: &mut AllCanvasMan) {
        let mut pr = PrintRun::new();
        pr.go(cman,oom,stage,&mut self.progs,&self.ctx,acm);
    }
    
    pub fn update_viewport(&self, s: &Stage) {
        let sz = s.get_size();
        self.ctx.viewport(0,0,sz.0,sz.1);
    }
}
