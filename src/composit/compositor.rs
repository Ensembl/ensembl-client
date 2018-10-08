use std::rc::Rc;
use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use arena::{ ArenaPrograms };
use composit::{ Component, StateManager };
use drawing::{ Drawing, OneCanvasManager, FlatCanvas, AllCanvasMan };
use shape::{ ShapeContext, CanvasIdx };
use composit::state::ComponentRedo;
use program::{ CanvasWeave };

pub struct DrawingSession {
    onecanvman: OneCanvasManager,
    contexts: Vec<Box<ShapeContext>>,
    all_drawings: HashMap<u32,Vec<Option<Drawing>>>
}

impl DrawingSession {
    fn new(acm: &mut AllCanvasMan) -> DrawingSession {
        DrawingSession {
            onecanvman: OneCanvasManager::new(acm),
            all_drawings: HashMap::<u32,Vec<Option<Drawing>>>::new(),
            contexts: Vec::<Box<ShapeContext>>::new(),
        }
    }

    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
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

    fn redraw_campaign(&mut self, idx: u32, c: &mut Component) {
        self.all_drawings.insert(idx,c.draw_drawings(&mut self.onecanvman));
    }
    
    fn finalise(&mut self, progs: &mut ArenaPrograms, 
                acm: &mut AllCanvasMan, ctx: &glctx) {
        let size = self.onecanvman.allocate();
        let canv = acm.flat_allocate(size,CanvasWeave::Pixelate);
        let canvas_idx = CanvasIdx::new(self,canv.index());
        self.onecanvman.draw(canv,canvas_idx);
        self.apply_contexts(progs,ctx);
    }
    
    fn drawings_for(&self, idx: u32) -> &Vec<Option<Drawing>> {
        self.all_drawings.get(&idx).unwrap()
    }
}

pub struct Compositor {
    idx: u32,
    contexts: Vec<Box<ShapeContext>>,
    campaigns: HashMap<u32,Component>,
    ds: Option<DrawingSession>
}

pub struct ComponentRemover(u32);

#[allow(unused)]
impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            campaigns: HashMap::<u32,Component>::new(),
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
        self.campaigns.insert(self.idx,c);
        ComponentRemover(self.idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.campaigns.remove(&k.0);
    }
    
    fn calc_level(&mut self, oom: &StateManager) -> ComponentRedo {
        let mut redo = ComponentRedo::None;
        for c in &mut self.campaigns.values_mut() {
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
        for (idx,c) in &mut self.campaigns {
            self.ds.as_mut().unwrap().redraw_campaign(*idx,c);
        }
        self.ds.as_mut().unwrap().finalise(progs,acm,ctx);
    }

    fn redraw_objects(&mut self, progs: &mut ArenaPrograms, ctx: &glctx) {
        for (i,c) in &mut self.campaigns {
            if c.is_on() {
                let ds = self.ds.as_ref().unwrap();
                let d = ds.drawings_for(*i);
                c.into_objects(progs,&ds.onecanvman,d);
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
