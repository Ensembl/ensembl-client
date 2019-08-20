use std::collections::{ HashMap, HashSet };
use std::rc::Rc;

use super::{ GLTraveller, GLProgs, GLProgInstances };
use super::super::program::{ ProgramType, UniformValue };
use model::driver::DriverTraveller;
use model::stage::{ Position, Screen };
use model::train::Carriage;
use composit::Leaf;
use super::super::drawing::{ CarriageCanvases, AllCanvasAllocator };

use dom::webgl::WebGLRenderingContext as glctx;

pub struct GLCarriage {
    srr: HashSet<GLTraveller>,
    prev_cc: Option<CarriageCanvases>,
    leaf: Leaf,
    progs: Option<GLProgs>,
    ctx: Rc<glctx>
}

impl GLCarriage {
    pub fn new(leaf: &Leaf, progs: &GLProgs, ctx: &Rc<glctx>) -> GLCarriage {
        GLCarriage {
            srr: HashSet::<GLTraveller>::new(),
            prev_cc: None,
            leaf: leaf.clone(),
            progs: Some(progs.clean_instance()),
            ctx: ctx.clone()
        }
    }

    pub fn new_sr(&mut self, sr: &GLTraveller) {
        self.srr.insert(sr.clone());
    }
    
    pub fn destroy(&mut self, alloc: &mut AllCanvasAllocator) {
        if let Some(cc) = self.prev_cc.take() {
            cc.destroy(alloc);
        }
    }
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator) -> CarriageCanvases {
        let mut cc = alloc.make_carriage_canvases();
        for sr in self.srr.iter() {
            sr.redraw_drawings(&mut cc);
        }
        cc.finalise(alloc);
        cc
    }
    
    fn redraw_objects(&mut self, e: &mut GLProgInstances) {
        for sr in self.srr.iter() {
            sr.redraw_objects(e);
        }
    }

    fn redraw_travellers(&mut self, aca: &mut AllCanvasAllocator) {
        if let Some(prev_cc) = self.prev_cc.take() {
            prev_cc.destroy(aca);
        }
        let cc = self.redraw_drawings(aca);
        let mut e = GLProgInstances::new(cc,self.progs.take().unwrap(),&self.ctx);
        self.redraw_objects(&mut e);
        e.finalize_objects(&self.ctx);
        e.go();
        let (prev_cc,progs) = e.destroy();
        self.prev_cc = Some(prev_cc);
        self.progs = Some(progs);
    }
    
    pub fn redraw(&mut self,aca: &mut AllCanvasAllocator) {
        self.redraw_travellers(aca);
    }

    pub fn get_uniforms(&self, leaf: &Leaf, opacity: f32, screen: &Screen, pos: &Position) -> HashMap<String,UniformValue> {
        let bp_per_screen = pos.get_screen_in_bp();
        let bp_per_leaf = leaf.total_bp();
        let leaf_per_screen = bp_per_screen as f64 / bp_per_leaf;
        let middle_bp = pos.get_middle();
        let middle_leaf = middle_bp.0/bp_per_leaf; // including fraction of leaf
        let current_leaf_left = leaf.get_index() as f64;
        let screen_px = screen.get_size();
        hashmap_s! {
            "uOpacity" => UniformValue::Float(opacity),
            "uStageHpos" => UniformValue::Float((middle_leaf - current_leaf_left) as f32),
            "uStageVpos" => UniformValue::Float(middle_bp.1 as f32),
            "uStageZoom" => UniformValue::Float((2_f64/leaf_per_screen) as f32),
            "uSize" => UniformValue::Vec2F(
                screen_px.0 as f32/2.,
                screen_px.1 as f32/2.)
        }
    }

    pub fn set_context(&mut self, screen: &Screen, position: &Position, opacity: f32) {
        let u = self.get_uniforms(&self.leaf, opacity, screen, position);
        let progs = self.progs.as_mut().unwrap();
        for k in &progs.order {
            let prog = progs.map.get_mut(k).unwrap();
            for (key, value) in &u {
                if let Some(obj) = prog.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
        }
    }
    
    pub fn execute(&mut self, pt: &ProgramType) {
        let prog = self.progs.as_mut().unwrap().map.get_mut(pt).unwrap();
        prog.execute(&self.ctx);
    }    
}
