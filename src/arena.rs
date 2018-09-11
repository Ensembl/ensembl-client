use debug;
use dom::domutil;
use std::collections::HashMap;
use stdweb::web::{ Element, HtmlElement };

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;

use program::{ Program, GPUSpec, UniformValue, ProgramType };

use types::{ CFraction, CPixel, cfraction, cpixel };

use campaign::{ StateManager, CampaignManager };

pub struct ArenaCanvases {
    pub flat: Rc<canvasutil::FlatCanvas>,
    pub idx: i32,
}

#[allow(dead_code)]
pub struct ArenaData {
    pub canvases: ArenaCanvases,
    pub ctx: glctx,
    pub gpuspec: GPUSpec
}

pub struct ArenaPrograms {
    order: Vec<ProgramType>,
    pub map: HashMap<ProgramType,Program>,
}

impl ArenaPrograms {
    pub fn clear_objects(&mut self) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.clear();
        }        
    }

    pub fn finalize_objects(&mut self, adata: &mut ArenaData) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.objects_final(adata);
        }
    }
}

pub struct Arena {
    pub data: Rc<RefCell<ArenaData>>,
    pub progs: ArenaPrograms,
    cman: CampaignManager
}

impl Arena {
    pub fn new(el: &Element) -> Arena {
        let canvas = canvasutil::prepare_canvas(el);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(2,2));
        let data = Rc::new(RefCell::new(ArenaData {
            ctx,
            gpuspec: GPUSpec::new(),
            canvases: ArenaCanvases {
                flat,
                idx: 0,
            },
        }));
        {
            let mut gpuspec = GPUSpec::new();
            gpuspec.populate(&data.borrow_mut());
            data.borrow_mut().gpuspec = gpuspec;
        }
        let data_g = data.clone();
        let data_b = data_g.borrow();
        
        let order = ProgramType::all();
        let mut map = HashMap::<ProgramType,Program>::new();
        for pt in &order {
            debug!("webgl programs","=== {:?} ===",&pt);
            map.insert(*pt,pt.to_program(&data_b));
        }
        
        let arena = Arena {
            cman: CampaignManager::new(),
            progs: ArenaPrograms {
                    order, map
            }, data
        };
        arena
    }

    pub fn get_cman(&mut self) -> &mut CampaignManager {
        &mut self.cman
    }

    pub fn draw(&mut self, oom: &StateManager, stage: &Stage) {
        /* maybe update scene */
        {
            let (cman,datam,progs) = (
                &mut self.cman,
                &mut self.data.borrow_mut(),
                &mut self.progs);
            cman.into_objects(progs,datam,oom);
        }
        /* prepare arena */
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        /* draw each geometry */
        let datam = &mut self.data.borrow_mut();
        for k in &self.progs.order {
            let geom = self.progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms(&datam.canvases);
            for (key, value) in &u {
                if let Some(obj) = geom.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            geom.draw(datam,stage);
        }
    }
}

#[derive(Clone)]
pub struct Stage {
    dims: CPixel,
    pub pos: CFraction,
    pub zoom: f32,
    el: HtmlElement,
}

impl Stage {
    pub fn new(el: &HtmlElement) -> Stage {
        let size = cpixel(0,0);
        let mut out = Stage {
            pos: cfraction(0.,0.), zoom: 1.0, el: el.clone(),
            dims: size
        };
        out.recalc_size();
        out
    }

    pub fn get_size(&self) -> CPixel {
        self.dims
    }

    pub fn recalc_size(&mut self) {
        self.dims = domutil::size(&self.el);
    }

    pub fn get_uniforms(&self, canvs: &ArenaCanvases) -> HashMap<&str,UniformValue> {
        hashmap! {
            "uSampler" => UniformValue::Int(canvs.idx),
            "uStageHpos" => UniformValue::Float(self.pos.0),
            "uStageVpos" => UniformValue::Float((self.pos.1 + self.dims.1 as f32)/2.),
            "uStageZoom" => UniformValue::Float(self.zoom),
            "uSize" => UniformValue::Vec2F(
                self.dims.0 as f32/2.,
                self.dims.1 as f32/2.)
        }
    }
}
