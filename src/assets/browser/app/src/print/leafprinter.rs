use std::rc::Rc;

use print::{ Programs, PrintEdition };
use program::ProgramType;
use composit::{ Traveller, Leaf, Stage, ComponentRedo, Train };
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
    
    pub fn into_objects(&mut self, leaf: &Leaf,
                        sc: &mut Train,
                        aca: &mut AllCanvasAllocator,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        if let Some(ref mut travs) = sc.get_travellers(leaf) {
            if travs.len() > 0 {
                self.redraw_travellers(travs,aca,level == ComponentRedo::Major);
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
