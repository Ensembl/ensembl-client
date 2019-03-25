use shape::{ Spot, CanvasIdx };
use super::GLProgs;
use super::super::drawing::{ CarriageCanvases, OneCanvasManager };
use program::{ CanvasCache, CanvasWeave };

use dom::webgl::WebGLRenderingContext as glctx;

pub struct GLProgData {
    spot: Spot,
    canvas: CanvasIdx,
    cc: CarriageCanvases
}

impl GLProgData {
    pub fn new(cc: CarriageCanvases) -> GLProgData {
        let mut out = GLProgData {
            spot: Spot::new(),
            canvas: CanvasIdx::new(cc.indices()),
            cc
        };
        out
    }
        
    pub fn spot(&mut self) -> &mut Spot { &mut self.spot }
    pub fn canvas(&mut self) -> &mut CanvasIdx { &mut self.canvas }
        
    pub fn go(&mut self, progs: &mut GLProgs) {
        for (_,ref mut prog) in progs.map.iter_mut() {
            self.spot.into_objects(&mut prog.data);
            self.canvas.into_objects(&mut prog.data);
        }
    }
    
    pub fn destroy(self) -> CarriageCanvases {
        self.cc
    }
    
    pub fn get_canvases(&self) -> &CarriageCanvases {
        &self.cc
    }
        
    pub fn get_canvases_mut(&mut self) -> &mut CarriageCanvases {
        &mut self.cc
    }
        
    pub fn get_canvas_cache(&self) -> &CanvasCache {
        self.cc.get_canvas_cache()
    }
}
