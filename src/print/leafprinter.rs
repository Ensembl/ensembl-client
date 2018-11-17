use std::rc::Rc;

use print::{ Programs, PrintEdition };
use program::ProgramType;
use composit::{ LeafComponent, Leaf, Stage, ComponentRedo, ScaleCompositor };
use drawing::{ DrawingSession, AllCanvasAllocator };
use webgl_rendering_context::WebGLRenderingContext as glctx;

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
        
    fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, comps: &mut Vec<&mut LeafComponent>) {
        self.ds.finish(alloc);
        self.ds = DrawingSession::new(alloc);
        for mut c in comps.iter_mut() {
            self.ds.redraw_component(*c);
        }
        self.ds.finalise(alloc);
    }
    
    fn redraw_objects(&mut self, comps: &mut Vec<&mut LeafComponent>,
                          e: &mut PrintEdition) {
        for c in comps.iter_mut() {
            if c.is_on() {
                c.into_objects(&mut self.progs,&mut self.ds,e);
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
                        sc: &mut ScaleCompositor,
                        aca: &mut AllCanvasAllocator,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        debug!("redraw","{:?}",level);
        if let Some(ref mut comps) = sc.get_components(leaf) {
            if comps.len() > 0 {            
                self.init();
                if level == ComponentRedo::Major {
                    self.redraw_drawings(aca,comps);
                }
                let mut e = self.new_edition();
                self.redraw_objects(comps,&mut e);
                self.fini(&mut e);
            }
        }
    }

    pub fn take_snap(&mut self, stage: &Stage, opacity: f32) {
        self.ctx.enable(glctx::DEPTH_TEST);
        self.ctx.enable(glctx::BLEND);
        self.ctx.blend_func_separate(
            glctx::SRC_ALPHA,
            glctx::ONE_MINUS_SRC_ALPHA,
            glctx::ONE,
            glctx::ONE_MINUS_SRC_ALPHA);        
        self.ctx.depth_mask(true);
        self.ctx.clear(glctx::COLOR_BUFFER_BIT | glctx::DEPTH_BUFFER_BIT);

        
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
