use std::rc::Rc;

use super::{ Programs, PrintEdition };
use program::ProgramType;
use model::train::{ Train, Traveller, Carriage };
use composit::{ Leaf, Stage, ComponentRedo, StateManager };
use drawing::{ CarriageCanvases, AllCanvasAllocator };
use dom::webgl::WebGLRenderingContext as glctx;

pub struct CarriagePrinter {
    prev_cc: Option<CarriageCanvases>,
    leaf: Leaf,
    progs: Programs,
    ctx: Rc<glctx>
}

impl CarriagePrinter {
    pub fn new(acm: &mut AllCanvasAllocator, leaf: &Leaf, progs: &Programs, ctx: &Rc<glctx>) -> CarriagePrinter {
        CarriagePrinter {
            prev_cc: None,
            leaf: leaf.clone(),
            progs: progs.clean_instance(),
            ctx: ctx.clone()
        }
    }

    pub fn destroy(&mut self, alloc: &mut AllCanvasAllocator) {
        if let Some(cc) = self.prev_cc.take() {
            cc.destroy(alloc);
        }
    }

    fn new_edition(&mut self, cc: CarriageCanvases) -> PrintEdition {
        PrintEdition::new(cc)
    }
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, comps: &mut Vec<&mut Traveller>) -> CarriageCanvases {
        let mut cc = alloc.make_carriage_canvases();
        for mut c in comps.iter_mut() {
            c.draw_drawings(&mut cc);
        }
        cc.finalise(alloc);
        cc
    }
    
    fn redraw_objects(&mut self, travs: &mut Vec<&mut Traveller>,
                          e: &mut PrintEdition) {
        for t in travs.iter_mut() {
            if t.is_on() {
                t.into_objects(&mut self.progs,e);
            }
        }
    }

    fn redraw_travellers(&mut self, travs: &mut Vec<&mut Traveller>, aca: &mut AllCanvasAllocator, do_drawings: bool) {
        self.progs.clear_objects(&self.ctx);
        let cc = if self.prev_cc.is_some() && !do_drawings {
            self.prev_cc.take().unwrap() // Use previous
        } else {
            if let Some(prev_cc) = self.prev_cc.take() {
                prev_cc.destroy(aca);
            }
            self.redraw_drawings(aca,travs)
        };
        let mut e = self.new_edition(cc);
        self.redraw_objects(travs,&mut e);
        self.progs.finalize_objects(&self.ctx,&mut e);
        e.go(&mut self.progs);
        self.prev_cc = Some(e.destroy());
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
        for k in &self.progs.order {
            let prog = self.progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms(&self.leaf, opacity);
            for (key, value) in &u {
                if let Some(obj) = prog.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
        }
    }
    
    pub fn execute(&mut self, pt: &ProgramType) {
        let prog = self.progs.map.get_mut(pt).unwrap();
        prog.execute(&self.ctx);
    }
}
