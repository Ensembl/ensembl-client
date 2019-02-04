use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use drawing::DrawingSession;
use program::{ Program, GPUSpec, ProgramType };

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

    pub fn size(&self) -> usize {
        let mut size = 0;
        for p in self.map.values() {
            size += p.size();
        }
        size
    }
    
    pub fn clear_objects(&mut self) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.clear();
        }        
    }

    pub fn finalize_objects(&mut self, ctx: &glctx, ds: &mut DrawingSession) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.objects_final(ctx,ds);
        }
    }
    
    pub fn clean_instance(&self) -> Programs {
        Programs {
            order: self.order.clone(),
            map: self.map.iter().map(|(k,v)| (*k,v.clean_instance())).collect()
        }
    }
}
