use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element };

use print::{ PrintRun, Programs };
use composit::{ Compositor, Component, StateManager };
use drawing::{ AllCanvasMan, DrawingSession };
use shape::ShapeContext;
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
    ds: Option<DrawingSession>,
    contexts: Vec<Box<ShapeContext>>,
}

impl Printer {
    pub fn new(canv_el: &HtmlElement) -> Printer {
        let canvas = canv_el.clone().try_into().unwrap();
        let ctx = wglraw::prepare_context(&canvas);
        let progs = Programs::new(&ctx);
        Printer {
            canv_el: canv_el.clone(),
            acm: AllCanvasMan::new("#managedcanvasholder"),
            contexts: Vec::<Box<ShapeContext>>::new(),
            ctx, progs,
            ds: None
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn redraw_objects(&mut self, comps: &mut Vec<&mut Component>) {
        for c in comps.iter_mut() {
            if c.is_on() {
                c.into_objects(&mut self.progs,self.ds.as_mut().unwrap());
            }
        }
    }
    
    pub fn apply_contexts(&mut self) {
        for c in &mut self.contexts {
            c.reset();
        }
        for (ref gk,ref mut prog) in self.progs.map.iter_mut() {
            for ref mut c in &mut self.contexts {
                c.into_objects(gk,&mut prog.data,&self.ctx);
            }
        }
    }
    
    pub fn clear_objects(&mut self) {
        self.progs.clear_objects();
    }
    
    pub fn finalize_objects(&mut self) {
        self.progs.finalize_objects(&self.ctx,&mut self.acm);
    }
    
    pub fn redraw_drawings(&mut self, comps: &mut Vec<&mut Component>) {
        if let Some(ref mut ds) = self.ds {
            ds.finish(&mut self.acm);
        }
        self.ds = Some(DrawingSession::new(&mut self.acm));
        for mut c in comps.iter_mut() {
            self.ds.as_mut().unwrap().redraw_component(*c);
        }
        self.ds.as_mut().unwrap().finalise(&mut self.progs,&mut self.acm,&self.ctx);
    }
    
    pub fn draw(&mut self,stage: &Stage, oom: &StateManager, compo: &mut Compositor) {
        let redo = compo.calc_level(oom);
        let mut pr = PrintRun::new();
        pr.go(compo,stage,self,redo);
    }
    
    pub fn go(&mut self, stage: &Stage) {
        self.ctx.enable(glctx::DEPTH_TEST);
        self.ctx.depth_func(glctx::LEQUAL);
        for k in &self.progs.order {
            let prog = self.progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms();
            for (key, value) in &u {
                if let Some(obj) = prog.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            prog.execute(&self.ctx);
        }
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
