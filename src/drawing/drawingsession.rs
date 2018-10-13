use std::collections::HashMap;
use std::collections::hash_map::Entry;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use print::Programs;
use composit::{ Component };
use drawing::{ OneCanvasManager, FlatCanvas, AllCanvasMan, ShapeContextList, AllCanvasAllocator };
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
    pub fn new(aca: &mut AllCanvasAllocator) -> DrawingSession {
        let standin = aca.flat_allocate(cpixel(2,2),&CanvasWeave::Pixelate);
        DrawingSession {
            next_canv_idx: 0,
            canvases: HashMap::<CanvasWeave,OneCanvasManager>::new(),
            contexts: ShapeContextList::new(),
            standin,
        }
    }

    pub fn indices(&self) -> HashMap<CanvasWeave,u32> {
        let mut out = HashMap::<CanvasWeave,u32>::new();
        for (w,ocm) in &self.canvases {
            out.insert(*w,ocm.index2());
        }
        out
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
                e.insert(OneCanvasManager::new(self.next_canv_idx-1,weave,&standin))
            }
        }
    }

    pub fn reset_contexts(&mut self) {
        self.contexts.reset();
    }

    pub fn go_contexts(&mut self, progs: &mut Programs) {
        self.contexts.go(progs);
    }

    pub fn redraw_component(&mut self, c: &mut Component) {
        c.draw_drawings(self);
    }
    
    pub fn finalise(&mut self, progs: &mut Programs, 
                aca: &mut AllCanvasAllocator, ctx: &glctx) {
        let mut sc = Vec::<Box<ShapeContext>>::new();
        for (ref weave,ref mut ocm) in &mut self.canvases {                    
            let size = ocm.allocate();
            let mut canv = aca.flat_allocate(size,*weave);
            ocm.draw(aca,canv);
            self.contexts.add(Box::new(ocm.index().clone()));
        }
    }
    
    pub fn finish(&self, aca: &mut AllCanvasAllocator) {
        self.standin.remove(aca);
        for ocm in self.canvases.values() {
            ocm.finish(aca);
        }
    }
}
