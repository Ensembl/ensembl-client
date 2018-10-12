use shape::Spot;
use shape::ShapeContext;
use print::Programs;

use webgl_rendering_context::WebGLRenderingContext as glctx;

pub struct PrintEdition {
    spot: Spot
}

impl PrintEdition {
    pub fn new() -> PrintEdition {
        PrintEdition {
            spot: Spot::new()
        }
    }
    
    pub fn spot(&mut self) -> &mut Spot { &mut self.spot }
    
    pub fn reset(&mut self) {
        self.spot.reset();
    }
    
    pub fn go(&mut self, ctx: &glctx, progs: &mut Programs) {
        for (ref gk,ref mut prog) in progs.map.iter_mut() {
            self.spot.into_objects(gk,&mut prog.data,ctx);
        }
    }
    
}
