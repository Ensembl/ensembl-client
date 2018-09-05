use canvasutil;
use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use program::Program;
use campaign::{ Campaign, OnOffManager };
use geometry::ProgramType;
use drawing::{ Drawing, LeafDrawingManager };
use shape::ShapeContext;

pub struct CampaignManager {
    idx: u32,
    contexts: Vec<Box<ShapeContext>>,
    requests: HashMap<u32,Campaign>
}

pub struct CampaignKiller(u32);

#[allow(unused)]
impl CampaignManager {
    pub fn new() -> CampaignManager {
        CampaignManager {
            requests: HashMap::<u32,Campaign>::new(),
            contexts: Vec::<Box<ShapeContext>>::new(),
            idx: 0
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn add_campaign(&mut self, c: Campaign) -> CampaignKiller {
        self.idx += 1;
        self.requests.insert(self.idx,c);
        CampaignKiller(self.idx)
    }

    pub fn remove(&mut self, k: CampaignKiller) {
        self.requests.remove(&k.0);
    }
    
    pub fn into_objects(&mut self, map: &mut HashMap<ProgramType,Program>,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        /* context */
        for c in &mut self.contexts {
            c.reset();
        }
        for (ref gk,ref mut geom) in map.iter_mut() {
            for c in &mut self.contexts {
                c.into_objects(gk,&mut geom.data,adata);
            }
        }
        /* canvas */
        let mut all_drawings = Vec::<Vec<Option<Drawing>>>::new();
        let mut leafdrawman = LeafDrawingManager::new();
        for r in &mut self.requests.values_mut() {
            all_drawings.push(r.draw_drawings(&mut leafdrawman,adata,oom));
        }
        let size = leafdrawman.allocate();
        adata.canvases.flat = Rc::new(canvasutil::FlatCanvas::create(size.0,size.1));
        leafdrawman.draw(&mut adata.canvases);
        /* shapes */
        for (i,r) in &mut self.requests.values_mut().enumerate() {
            r.into_objects(map,&mut leafdrawman,adata,oom,&all_drawings[i]);
        }
    }
}
