use std::collections::HashMap;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::unstable::TryInto;
use stdweb::web::HtmlElement;
use webgl_rendering_context::WebGLRenderingContext as glctx;

use drawing::{ FlatCanvas, AllCanvasMan };
use wglraw;
use stage::Stage;
use program::{ Program, GPUSpec, ProgramType, CanvasWeave };
use composit::{ StateManager, Compositor };
use print::PrintRun;
use types::{ Dot };

pub struct Programs {
    pub order: Vec<ProgramType>,
    pub map: HashMap<ProgramType,Program>,
}

impl Programs {
    pub fn new(ctx: &glctx) -> Programs {
        let mut gpuspec = GPUSpec::new();
        gpuspec.populate(&ctx);
        let order = ProgramType::all();
        let mut map = HashMap::<ProgramType,Program>::new();
        for pt in &order {
            debug!("webgl programs","=== {:?} ===",&pt);
            map.insert(*pt,pt.to_program(&gpuspec,&ctx));
        }
        Programs { order, map }
    }

    
    pub fn clear_objects(&mut self) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.clear();
        }        
    }

    pub fn finalize_objects(&mut self, ctx: &glctx, acm: &mut AllCanvasMan) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.objects_final(ctx,acm);
        }
    }
}
