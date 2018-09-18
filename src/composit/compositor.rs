use canvasutil;
use std::rc::Rc;
use std::collections::HashMap;

use arena::{ ArenaData, ArenaPrograms };
use composit::{ Component, StateManager };
use drawing::{ Drawing, LeafDrawingManager };
use shape::ShapeContext;
use composit::state::ComponentRedo;

pub struct DrawingSession {
    drawman: LeafDrawingManager,
    all_drawings: HashMap<u32,Vec<Option<Drawing>>>
}

impl DrawingSession {
    fn new() -> DrawingSession {
        DrawingSession {
            drawman: LeafDrawingManager::new(),
            all_drawings: HashMap::<u32,Vec<Option<Drawing>>>::new(),
        }
    }

    fn redraw_campaign(&mut self, adata: &mut ArenaData, idx: u32, c: &mut Component) {
        self.all_drawings.insert(idx,c.draw_drawings(&mut self.drawman,adata));
    }
    
    fn finalise(&mut self, adata: &mut ArenaData) {
        let size = self.drawman.allocate();
        canvasutil::FlatCanvas::reset();
        adata.canvases.flat = Rc::new(canvasutil::FlatCanvas::create(size.0,size.1));
        self.drawman.draw(&mut adata.canvases);
    }
    
    fn drawings_for(&self, idx: u32) -> &Vec<Option<Drawing>> {
        self.all_drawings.get(&idx).unwrap()
    }
}

pub struct Compositor {
    idx: u32,
    contexts: Vec<Box<ShapeContext>>,
    campaigns: HashMap<u32,Component>,
    ds: DrawingSession
}

pub struct ComponentRemover(u32);

#[allow(unused)]
impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            campaigns: HashMap::<u32,Component>::new(),
            contexts: Vec::<Box<ShapeContext>>::new(),
            ds: DrawingSession::new(),
            idx: 0
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn add_campaign(&mut self, c: Component) -> ComponentRemover {
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
                      adata: &mut ArenaData) {
        for c in &mut self.contexts {
            c.reset();
        }
        for (ref gk,ref mut geom) in progs.map.iter_mut() {
            for c in &mut self.contexts {
                c.into_objects(gk,&mut geom.data,adata);
            }
        }
    }

    fn redraw_drawings(&mut self, adata: &mut ArenaData) {
        self.ds = DrawingSession::new();
        for (idx,c) in &mut self.campaigns {
            self.ds.redraw_campaign(adata,*idx,c);
        }
        self.ds.finalise(adata);
    }

    fn redraw_objects(&mut self, progs: &mut ArenaPrograms, adata: &mut ArenaData) {
        for (i,c) in &mut self.campaigns {
            if c.is_on() {
                let d = self.ds.drawings_for(*i);
                c.into_objects(progs,&self.ds.drawman,adata,d);
            }
        }
    }

    pub fn into_objects(&mut self, progs: &mut ArenaPrograms,
                        adata: &mut ArenaData, oom: &StateManager) {
        let redo = self.calc_level(oom);
        if redo == ComponentRedo::None { return; }
        debug!("redraw","{:?}",redo);
        progs.clear_objects();
        self.apply_contexts(progs,adata);
        if redo == ComponentRedo::Major {
            self.redraw_drawings(adata);
        }
        self.redraw_objects(progs,adata);
        progs.finalize_objects(adata);
    }
}
