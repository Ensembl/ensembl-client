use shape::{ Spot, CanvasIdx };
use print::Programs;
use drawing::DrawingSession;

use webgl_rendering_context::WebGLRenderingContext as glctx;

pub struct PrintEdition {
    spot: Spot,
    canvas: CanvasIdx
}

impl PrintEdition {
    pub fn new(ds: &DrawingSession) -> PrintEdition {
        PrintEdition {
            spot: Spot::new(),
            canvas: CanvasIdx::new(ds.indices())
        }
    }
    
    pub fn spot(&mut self) -> &mut Spot { &mut self.spot }
    pub fn canvas(&mut self) -> &mut CanvasIdx { &mut self.canvas }
        
    pub fn go(&mut self, ctx: &glctx, progs: &mut Programs) {
        for (_,ref mut prog) in progs.map.iter_mut() {
            self.spot.into_objects(&mut prog.data);
            self.canvas.into_objects(&mut prog.data);
        }
    }
}
