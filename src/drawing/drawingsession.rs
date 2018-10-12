use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use print::Programs;
use composit::{ Component };
use drawing::{ OneCanvasManager, FlatCanvas, AllCanvasMan };
use program::{ CanvasWeave };
use types::cpixel;

pub struct DrawingSession {
    canvases: HashMap<CanvasWeave,OneCanvasManager>,
    standin: FlatCanvas,
}

impl DrawingSession {
    pub fn new(acm: &mut AllCanvasMan) -> DrawingSession {
        let standin = acm.flat_allocate(cpixel(2,2),&CanvasWeave::Pixelate,None);
        DrawingSession {
            canvases: HashMap::<CanvasWeave,OneCanvasManager>::new(),
            standin
        }
    }

    pub fn get_ocm(&mut self, weave: CanvasWeave) -> &mut OneCanvasManager {
        let standin = self.standin.clone();
        self.canvases.entry(weave).or_insert_with(||
            OneCanvasManager::new(&standin)
        )
    }

    pub fn redraw_component(&mut self, c: &mut Component) {
        c.draw_drawings(self);
    }
    
    pub fn finalise(&mut self, progs: &mut Programs, 
                acm: &mut AllCanvasMan, ctx: &glctx) {
        let mut idx : u32 = 0;
        for (ref weave,ref mut ocm) in &mut self.canvases {                    
            let size = ocm.allocate();
            let mut canv = acm.flat_allocate(size,*weave,Some(idx));
            canv.apply_context(progs,ctx);
            ocm.draw(acm,canv);
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
