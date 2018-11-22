use std::collections::{ HashMap, HashSet };
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element };

use print::{ Programs, LeafPrinter };
use composit::{ Compositor, ScaleCompositor, StateManager, Leaf, Stage };
use drawing::{ AllCanvasAllocator };
use dom::domutil;
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
        let acm = AllCanvasAllocator::new("#bpane-container .managedcanvasholder");
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

    fn create_new_leafs(&mut self, leafs: &Vec<Leaf>) {
        for leaf in leafs.iter() {
            if !self.lp.contains_key(leaf) {
                let progs = self.base_progs.clean_instance();
                self.lp.insert(leaf.clone(),LeafPrinter::new(&mut self.acm,leaf,&progs,&self.ctx));
            }
        }
    }

    fn remove_old_leafs(&mut self, leafs: &Vec<Leaf>) {
        let mut ls = HashSet::new();
        for leaf in leafs {
            ls.insert(leaf);
        }
        let keys : Vec<Leaf> = self.lp.keys().map(|s| s.clone()).collect();
        for leaf in keys {
            if !ls.contains(&leaf) {
                if let Some(mut lp) = self.lp.remove(&leaf) {
                    lp.finish(&mut self.acm);
                }
            }
        }
    }

    fn manage_leafs(&mut self, c: &mut Compositor) {
        let leafs = c.all_leafs();
        self.create_new_leafs(&leafs);
        self.remove_old_leafs(&leafs);        
    }

    fn prepare_all(&mut self) {
        self.ctx.enable(glctx::DEPTH_TEST);
        self.ctx.enable(glctx::BLEND);
        self.ctx.blend_func_separate(
            glctx::SRC_ALPHA,
            glctx::ONE_MINUS_SRC_ALPHA,
            glctx::ONE,
            glctx::ONE_MINUS_SRC_ALPHA);        
        self.ctx.depth_mask(false);
        self.ctx.clear(glctx::COLOR_BUFFER_BIT | glctx::DEPTH_BUFFER_BIT);
    }

    fn prepare_scale(&mut self, stage: &Stage, oom: &StateManager, 
                     sc: &mut ScaleCompositor, opacity: f32) {
        let leafs = sc.leafs();
        for ref leaf in &leafs {
            if let Some(lp) = &mut self.lp.get_mut(&leaf) {
                let redo = sc.calc_level(leaf,oom);
                lp.into_objects(&leaf,sc,&mut self.acm,redo);
                lp.take_snap(stage,opacity);
            }
        }
    }
        
    fn execute(&mut self, stage: &Stage, oom: &StateManager, c: &mut Compositor) {
        let leafs = c.all_leafs();
        for pt in &self.base_progs.order {
            for ref leaf in &leafs {
                let lp = &mut self.lp.get_mut(&leaf).unwrap();
                lp.execute(&pt);
            }
        }
    }

    pub fn go(&mut self, stage: &Stage, oom: &StateManager, compo: &mut Compositor) {
        self.manage_leafs(compo);
        self.prepare_all();
        let prop = compo.get_prop_trans();
        if let Some(current_sc) = compo.get_current_sc() {
            self.prepare_scale(stage,oom,current_sc,1.-prop);
        }
        if let Some(transition_sc) = compo.get_transition_sc() {
            self.prepare_scale(stage,oom,transition_sc,prop);
        }
        self.execute(stage,oom,compo);
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
