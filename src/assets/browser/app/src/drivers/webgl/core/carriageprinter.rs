use std::rc::Rc;

use super::{ Programs, PrintEdition };
use program::ProgramType;
use model::train::{ Train, Traveller, Carriage };
use composit::{ Leaf, Stage, ComponentRedo };
use drawing::{ DrawingSession, AllCanvasAllocator };
use dom::webgl::WebGLRenderingContext as glctx;

pub struct CarriagePrinter {
    ds: DrawingSession,
    leaf: Leaf,
    progs: Programs,
    ctx: Rc<glctx>
}

impl CarriagePrinter {
    pub fn new(acm: &mut AllCanvasAllocator, leaf: &Leaf, progs: &Programs, ctx: &Rc<glctx>) -> CarriagePrinter {
        CarriagePrinter {
            ds: acm.make_drawing_session(),
            leaf: leaf.clone(),
            progs: progs.clean_instance(),
            ctx: ctx.clone()
        }
    }

    pub fn finish(&mut self, alloc: &mut AllCanvasAllocator) {
        self.ds.finish(alloc);
    }

    fn new_edition(&mut self) -> PrintEdition {
        PrintEdition::new(&mut self.ds)
    }
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, comps: &mut Vec<&mut Traveller>) {
        self.ds.finish(alloc);
        self.ds = alloc.make_drawing_session();
        for mut c in comps.iter_mut() {
            c.draw_drawings(&mut self.ds);
        }
        self.ds.finalise(alloc);
    }
    
    fn redraw_objects(&mut self, comps: &mut Vec<&mut Traveller>,
                          e: &mut PrintEdition) {
        for c in comps.iter_mut() {
            if c.is_on() {
                let old_len = self.progs.size();
                c.into_objects(&mut self.progs,&mut self.ds,e);
                //console!("{:?} has {} objects",c,self.progs.size()-old_len);
            }
        }
    }

    fn init(&mut self) {
        self.progs.clear_objects(&self.ctx);
    }
    
    fn fini(&mut self, e: &mut PrintEdition) {
        self.progs.finalize_objects(&self.ctx,&mut self.ds);
        e.go(&mut self.progs);
    }

    fn redraw_travellers(&mut self, travs: &mut Vec<&mut Traveller>, aca: &mut AllCanvasAllocator, do_drawings: bool) {
        self.init();
        let mut e = self.new_edition();
        if do_drawings {
            self.redraw_drawings(aca,travs);
        }
        self.redraw_objects(travs,&mut e);
        self.fini(&mut e);
    }
    
    pub fn prepare(&mut self,
                        carriage: &mut Carriage,
                        aca: &mut AllCanvasAllocator,
                        level: ComponentRedo,stage: &Stage, opacity: f32) {
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
