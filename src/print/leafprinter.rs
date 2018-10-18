use std::rc::Rc;

use print::{ PrintRun, Programs, PrintEdition };
use composit::{ Compositor, LeafComponent, StateManager, Leaf };
use drawing::{ DrawingSession, AllCanvasAllocator, FlatCanvas };
use stage::Stage;
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

    pub fn new_edition(&mut self) -> PrintEdition {
        PrintEdition::new(&mut self.ds)
    }
        
    pub fn redraw_drawings(&mut self, alloc: &mut AllCanvasAllocator, comps: &mut Vec<&mut LeafComponent>) {
        self.ds.finish(alloc);
        self.ds = DrawingSession::new(alloc);
        for mut c in comps.iter_mut() {
            self.ds.redraw_component(*c);
        }
        self.ds.finalise(alloc);
    }
    
    pub fn redraw_objects(&mut self, comps: &mut Vec<&mut LeafComponent>,
                          e: &mut PrintEdition) {
        for c in comps.iter_mut() {
            if c.is_on() {
                c.into_objects(&mut self.progs,&mut self.ds,e);
            }
        }
    }

    pub fn init(&mut self) {
        self.progs.clear_objects();
    }
    
    pub fn fini(&mut self, e: &mut PrintEdition) {
        self.progs.finalize_objects(&self.ctx,&mut self.ds);
        e.go(&mut self.progs);
    }
    
    pub fn take_snap(&mut self, stage: &Stage) {
        self.ctx.enable(glctx::DEPTH_TEST);
        self.ctx.depth_func(glctx::LEQUAL);
        for k in &self.progs.order {
            let prog = self.progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms(&self.leaf);
            for (key, value) in &u {
                if let Some(obj) = prog.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            prog.execute(&self.ctx);
        }
    }
}
