use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use arena::{ ArenaPrograms };
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
        let standin = acm.flat_allocate(cpixel(2,2),&CanvasWeave::Pixelate);
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
    
    pub fn finalise(&mut self, progs: &mut ArenaPrograms, 
                acm: &mut AllCanvasMan, ctx: &glctx) {
        for (ref weave,ref mut ocm) in &mut self.canvases {                    
            let size = ocm.allocate();
            let mut canv = acm.flat_allocate(size,*weave);
            canv.apply_context(progs,ctx);
            ocm.draw(canv);
        }
    }
}
