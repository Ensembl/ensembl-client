use std::collections::HashSet;
use std::rc::Rc;

use super::{ GLSourceResponse, Programs, PrintEdition, PrintEditionAll };
use program::ProgramType;
use model::train::{ Train, Traveller, Carriage };
use composit::{ Leaf, Stage, ComponentRedo, StateManager };
use drawing::{ CarriageCanvases, AllCanvasAllocator };
use dom::webgl::WebGLRenderingContext as glctx;

pub struct CarriagePrinter {
    srr: HashSet<GLSourceResponse>,
    prev_cc: Option<CarriageCanvases>,
    leaf: Leaf,
    progs: Option<Programs>,
    ctx: Rc<glctx>
}

impl CarriagePrinter {
    pub fn new(acm: &mut AllCanvasAllocator, leaf: &Leaf, progs: &Programs, ctx: &Rc<glctx>) -> CarriagePrinter {
        CarriagePrinter {
            srr: HashSet::<GLSourceResponse>::new(),
            prev_cc: None,
            leaf: leaf.clone(),
            progs: Some(progs.clean_instance()),
            ctx: ctx.clone()
        }
    }

    pub fn new_sr(&mut self, sr: &GLSourceResponse) {
        self.srr.insert(sr.clone());
    }

    pub fn remove_sr(&mut self, sr: GLSourceResponse) {
        self.srr.remove(&sr);
    }
    
    pub fn destroy(&mut self, alloc: &mut AllCanvasAllocator) {
        if let Some(cc) = self.prev_cc.take() {
            cc.destroy(alloc);
        }
    }
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, travs: &mut Vec<&mut Traveller>) -> CarriageCanvases {
        let mut cc = alloc.make_carriage_canvases();
        for mut t in travs.iter_mut() {
            if let Some(response) = t.get_response() {
                response.redraw(&mut cc);
            }
        }
        cc.finalise(alloc);
        cc
    }
    
    fn redraw_objects(&mut self, travs: &mut Vec<&mut Traveller>,
                          e: &mut PrintEditionAll) {
        console!("redraw_objects({:?})",self.srr);
        for t in travs.iter_mut() {
            if t.is_on() {
                if let Some(response) = t.get_response() {
                    response.into_objects(e);
                }
            }
        }
    }

    fn redraw_travellers(&mut self, travs: &mut Vec<&mut Traveller>, aca: &mut AllCanvasAllocator, do_drawings: bool) {
        let cc = if self.prev_cc.is_some() && !do_drawings {
            self.prev_cc.take().unwrap() // Use previous
        } else {
            if let Some(prev_cc) = self.prev_cc.take() {
                prev_cc.destroy(aca);
            }
            self.redraw_drawings(aca,travs)
        };
        let mut e = PrintEditionAll::new(cc,self.progs.take().unwrap(),&self.ctx);
        self.redraw_objects(travs,&mut e);
        e.finalize_objects(&self.ctx);
        e.go();
        let (prev_cc,progs) = e.destroy();
        self.prev_cc = Some(prev_cc);
        self.progs = Some(progs);
    }
    
    pub fn prepare(&mut self,
                        oom: &StateManager,
                        carriage: &mut Carriage,
                        aca: &mut AllCanvasAllocator,
                        stage: &Stage, opacity: f32) {
        let level = carriage.update_state(oom);
        if level != ComponentRedo::None {
            let mut travs = carriage.all_travellers_mut();
            if travs.len() > 0 {
                self.redraw_travellers(&mut travs,aca,level == ComponentRedo::Major);
            }
        }
        let mut progs = self.progs.as_mut().unwrap();
        for k in &progs.order {
            let prog = progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms(&self.leaf, opacity);
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
