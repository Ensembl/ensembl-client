use std::collections::HashMap;
use std::collections::hash_map::Entry;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use print::Programs;
use composit::{ Component };
use drawing::{ OneCanvasManager, FlatCanvas, AllCanvasMan, ShapeContextList };
use program::{ CanvasWeave };
use types::cpixel;
use shape::{ ShapeContext, CanvasIdx };

pub struct DrawingSession {
    next_canv_idx: u32,
    canvases: HashMap<CanvasWeave,OneCanvasManager>,
    standin: FlatCanvas,
    contexts: ShapeContextList
}

impl DrawingSession {
    pub fn new(acm: &mut AllCanvasMan) -> DrawingSession {
        let standin = acm.flat_allocate(cpixel(2,2),&CanvasWeave::Pixelate);
        DrawingSession {
            next_canv_idx: 0,
            canvases: HashMap::<CanvasWeave,OneCanvasManager>::new(),
            contexts: ShapeContextList::new(),
            standin,
        }
    }

    pub fn all_ocm(&self) -> Vec<&OneCanvasManager> {
        self.canvases.values().collect()
    }

    pub fn get_ocm(&mut self, weave: CanvasWeave) -> &mut OneCanvasManager {
        let standin = self.standin.clone();
        match self.canvases.entry(weave) {
            Entry::Occupied(e) => e.into_mut(),
            Entry::Vacant(e) => {
                self.next_canv_idx += 1;
                e.insert(OneCanvasManager::new(self.next_canv_idx-1,&standin))
            }
        }
    }

    pub fn reset_contexts(&mut self) {
        self.contexts.reset();
    }

    pub fn go_contexts(&mut self, ctx: &glctx, progs: &mut Programs) {
        self.contexts.go(ctx,progs);
    }

    pub fn redraw_component(&mut self, c: &mut Component) {
        c.draw_drawings(self);
    }
    
    pub fn finalise(&mut self, progs: &mut Programs, 
                acm: &mut AllCanvasMan, ctx: &glctx) {
        let mut idx : u32 = 0;
        let mut sc = Vec::<Box<ShapeContext>>::new();
        for (ref weave,ref mut ocm) in &mut self.canvases {                    
            let size = ocm.allocate();
            let mut canv = acm.flat_allocate(size,*weave);
            ocm.draw(acm,canv);
            self.contexts.add(Box::new(ocm.index().clone()));
            idx += 1;
        }
    }
    
    pub fn finish(&mut self, acm: &mut AllCanvasMan) {
        self.standin.remove(acm);
        for ocm in self.canvases.values() {
            ocm.finish(acm);
        }
    }
}
