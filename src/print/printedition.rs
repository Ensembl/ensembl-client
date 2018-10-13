use shape::{ Spot, CanvasIdx2 };
use shape::ShapeContext;
use print::Programs;
use drawing::DrawingSession;

use webgl_rendering_context::WebGLRenderingContext as glctx;

pub struct PrintEdition {
    spot: Spot,
    canvas: CanvasIdx2
}

impl PrintEdition {
    pub fn new(ds: &DrawingSession) -> PrintEdition {
        PrintEdition {
            spot: Spot::new(),
            canvas: CanvasIdx2::new(ds.indices())
        }
    }
    
    pub fn spot(&mut self) -> &mut Spot { &mut self.spot }
    pub fn canvas(&mut self) -> &mut CanvasIdx2 { &mut self.canvas }
    
    pub fn reset(&mut self) {
        self.spot.reset();
        self.canvas.reset();
    }
    
    pub fn go(&mut self, ctx: &glctx, progs: &mut Programs) {
        for (ref gk,ref mut prog) in progs.map.iter_mut() {
            self.spot.into_objects(gk,&mut prog.data);
            self.canvas.into_objects(gk,&mut prog.data);
        }
    }
}
