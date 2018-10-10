use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use arena::{ ArenaPrograms };
use composit::{ Component, StateManager };
use drawing::{ AllCanvasMan, DrawingSession };
use shape::{ ShapeContext };
use composit::state::ComponentRedo;

pub struct Compositor {
    idx: u32,
    contexts: Vec<Box<ShapeContext>>,
    components: HashMap<u32,Component>,
    ds: Option<DrawingSession>
}

pub struct ComponentRemover(u32);

#[allow(unused)]
impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            components: HashMap::<u32,Component>::new(),
            contexts: Vec::<Box<ShapeContext>>::new(),
            ds: None,
            idx: 0
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn add_component(&mut self, c: Component) -> ComponentRemover {
        self.idx += 1;
        self.components.insert(self.idx,c);
        ComponentRemover(self.idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    fn calc_level(&mut self, oom: &StateManager) -> ComponentRedo {
        let mut redo = ComponentRedo::None;
        for c in &mut self.components.values_mut() {
            redo = redo | c.update_state(oom);
        }
        redo
    }
    
    fn apply_contexts(&mut self, progs: &mut ArenaPrograms,
                      ctx: &glctx) {
        for c in &mut self.contexts {
            c.reset();
        }
        for (ref gk,ref mut geom) in progs.map.iter_mut() {
            for c in &mut self.contexts {
                c.into_objects(gk,&mut geom.data,ctx);
            }
        }
    }

    fn redraw_drawings(&mut self, progs: &mut ArenaPrograms, acm: &mut AllCanvasMan, ctx: &glctx) {
        self.ds = Some(DrawingSession::new(acm));
        for (idx,c) in &mut self.components {
            self.ds.as_mut().unwrap().redraw_component(c);
        }
        self.ds.as_mut().unwrap().finalise(progs,acm,ctx);
    }

    fn redraw_objects(&mut self, progs: &mut ArenaPrograms, ctx: &glctx) {
        for (i,c) in &mut self.components {
            if c.is_on() {
                let mut ds = self.ds.as_mut().unwrap();
                c.into_objects(progs,ds);
            }
        }
    }

    pub fn into_objects(&mut self, progs: &mut ArenaPrograms,
                        ctx: &glctx,
                        acm: &mut AllCanvasMan,
                        oom: &StateManager) {
        let redo = self.calc_level(oom);
        if redo == ComponentRedo::None { return; }
        debug!("redraw","{:?}",redo);
        progs.clear_objects();
        self.apply_contexts(progs,ctx);
        if redo == ComponentRedo::Major {
            self.redraw_drawings(progs,acm,ctx);
        }
        self.redraw_objects(progs,ctx);
        progs.finalize_objects(ctx,acm);
    }
}
