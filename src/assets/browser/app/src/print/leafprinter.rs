use std::rc::Rc;

use print::{ Programs, PrintEdition };
use program::ProgramType;
use composit::{ Carriage, Leaf, Stage, ComponentRedo, Train };
use drawing::{ DrawingSession, AllCanvasAllocator };
use dom::webgl::WebGLRenderingContext as glctx;

pub struct LeafPrinter {
    ds: DrawingSession,
    leaf: Leaf,
    progs: Programs,
    ctx: Rc<glctx>
}

impl LeafPrinter {
    pub fn new(acm: &mut AllCanvasAllocator, leaf: &Leaf, progs: &Programs, ctx: &Rc<glctx>) -> LeafPrinter {
        LeafPrinter {
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
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, comps: &mut Vec<&mut Carriage>) {
        self.ds.finish(alloc);
        self.ds = DrawingSession::new(alloc);
        for mut c in comps.iter_mut() {
            self.ds.redraw_component(*c);
        }
        self.ds.finalise(alloc);
    }
    
    fn redraw_objects(&mut self, comps: &mut Vec<&mut Carriage>,
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
        self.progs.clear_objects();
    }
    
    fn fini(&mut self, e: &mut PrintEdition) {
        self.progs.finalize_objects(&self.ctx,&mut self.ds);
        e.go(&mut self.progs);
    }
    
    pub fn into_objects(&mut self, leaf: &Leaf,
                        sc: &mut Train,
                        aca: &mut AllCanvasAllocator,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        if let Some(ref mut comps) = sc.get_carriages(leaf) {
            if comps.len() > 0 {
                self.init();
                if level == ComponentRedo::Major {
                    self.redraw_drawings(aca,comps);
                }
                let mut e = self.new_edition();
                self.redraw_objects(comps,&mut e);
                /* Useful for debugging performance */
                self.fini(&mut e);
            }
        }
    }

    pub fn take_snap(&mut self, stage: &Stage, opacity: f32) {        
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
