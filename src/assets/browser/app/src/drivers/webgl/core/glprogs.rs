use hashbrown::HashMap;

use dom::webgl::WebGLRenderingContext as glctx;

use drivers::webgl::GLProgData;

use super::super::program::{ Program, GPUSpec, ProgramType };

pub struct GLProgs {
    order: Vec<Program>,
    map: HashMap<ProgramType,usize>,
}

impl GLProgs {
    pub fn new(ctx: &glctx) -> GLProgs {
        let mut gpuspec = GPUSpec::new();
        gpuspec.populate(&ctx);
        let ordering = ProgramType::all();
        let mut map = HashMap::new();
        let mut order = Vec::new();
        for pt in &ordering {
            blackbox_log!("webgl-programs","=== {:?} ===",&pt);
            map.insert(*pt,order.len());
            order.push(pt.to_program(&gpuspec,&ctx));
        }
        GLProgs { order, map }
    }

    pub fn size(&self) -> usize {
        let mut size = 0;
        for p in &self.order {
            size += p.size();
        }
        size
    }
    
    pub fn clear_objects(&mut self, ctx: &glctx) {
        for prog in &mut self.order {
            prog.clear(ctx);
        }        
    }

    pub fn finalize_objects(&mut self, ctx: &glctx, e: &mut GLProgData) {
        for prog in &mut self.order {
            prog.data.objects_final(ctx,e);
        }
    }
    
    pub fn clean_instance(&self) -> GLProgs {
        GLProgs {
            order: self.order.iter().map(|prog| prog.clean_instance()).collect(),
            map: self.map.clone()
        }
    }

    pub fn each(&mut self) -> &mut Vec<Program> {
        &mut self.order
    }

    pub fn get_mut<'a>(&'a mut self, pt: &ProgramType) -> Option<&'a mut Program> {
        if let Some(idx) = self.map.get(pt) {
            self.order.get_mut(*idx)
        } else {
            None
        }
    }
}
