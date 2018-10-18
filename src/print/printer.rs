use std::collections::HashMap;
use std::collections::hash_map::Entry;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element };

use print::{ PrintRun, Programs, PrintEdition, LeafPrinter };
use composit::{ Compositor, LeafComponent, StateManager, Leaf };
use drawing::{ DrawingSession, AllCanvasAllocator };
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
    ctx: Rc<glctx>,
    base_progs: Programs,
    acm: AllCanvasAllocator,
    lp: HashMap<Leaf,LeafPrinter>
}

impl Printer {
    pub fn new(canv_el: &HtmlElement) -> Printer {
        let canvas = canv_el.clone().try_into().unwrap();
        let ctx = Rc::new(wglraw::prepare_context(&canvas));
        let progs = Programs::new(&ctx);
        let acm = AllCanvasAllocator::new("#managedcanvasholder");
        Printer {
            canv_el: canv_el.clone(),
            acm, ctx,
            base_progs: progs,
            lp: HashMap::<Leaf,LeafPrinter>::new()
        }
    }

    pub fn finish(&mut self) {
        for (_i,mut lp) in &mut self.lp {
            lp.finish(&mut self.acm);
        }
        self.acm.finish();
    }

    pub fn get_lp_aca(&mut self, leaf: &Leaf) -> (&mut LeafPrinter, &mut AllCanvasAllocator) {
        let lp = match self.lp.entry(leaf.clone()) {
            Entry::Occupied(e) => e.into_mut(),
            Entry::Vacant(e) => {
                let progs = self.base_progs.clean_instance();
                e.insert(LeafPrinter::new(&mut self.acm,leaf,&progs,&self.ctx))
            }
        };        
        (lp, &mut self.acm)
    }
        
    pub fn go(&mut self,stage: &Stage, oom: &StateManager, compo: &mut Compositor) {
        for ref leaf in compo.leafs() {
            let redo = compo.calc_level(leaf,oom);
            let mut pr = PrintRun::new(leaf);
            pr.build_snap(compo,stage,self,redo);
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
