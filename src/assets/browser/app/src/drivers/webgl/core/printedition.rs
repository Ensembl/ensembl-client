use shape::{ Spot, CanvasIdx };
use super::Programs;
use drawing::{ CarriageCanvases, OneCanvasManager };
use program::{ CanvasCache, CanvasWeave };

use dom::webgl::WebGLRenderingContext as glctx;

pub struct PrintEditionAll {
    e: PrintEdition,
    progs: Programs
}

impl PrintEditionAll {
    pub fn new(cc: CarriageCanvases, mut progs: Programs, ctx: &glctx) -> PrintEditionAll {
        progs.clear_objects(ctx);
        PrintEditionAll {
            e: PrintEdition::new(cc),
            progs
        }
    }
    
    pub fn get_progs_data(&mut self) -> (&mut Programs, &mut PrintEdition) {
        (&mut self.progs,&mut self.e)
    }
    
    pub fn get_progs(&mut self) -> &mut Programs {
        &mut self.progs
    }
    
    pub fn get_data(&mut self) -> &mut PrintEdition {
        &mut self.e
    }
    
    pub fn destroy(self) -> (CarriageCanvases,Programs) {
        (self.e.destroy(),self.progs)
    }
    
    pub fn go(&mut self) {
        let (progs,data) = self.get_progs_data();
        data.go(progs);
    }
    
    pub fn finalize_objects(&mut self, ctx: &glctx) {
        self.progs.finalize_objects(ctx,&mut self.e);
    }
}

pub struct PrintEdition {
    spot: Spot,
    canvas: CanvasIdx,
    cc: CarriageCanvases
}

impl PrintEdition {
    fn new(cc: CarriageCanvases) -> PrintEdition {
        let mut out = PrintEdition {
            spot: Spot::new(),
            canvas: CanvasIdx::new(cc.indices()),
            cc
        };
        out
    }
        
    pub fn spot(&mut self) -> &mut Spot { &mut self.spot }
    pub fn canvas(&mut self) -> &mut CanvasIdx { &mut self.canvas }
        
    pub fn go(&mut self, progs: &mut Programs) {
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
