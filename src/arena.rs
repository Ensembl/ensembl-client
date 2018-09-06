use std::collections::HashMap;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;

use program::{ Program, GPUSpec, UniformValue };

use coord::{
    COrigin,
};

use campaign::{ StateManager, CampaignManager };

use geometry::{
    ProgramType
};

pub struct ArenaCanvases {
    pub flat: Rc<canvasutil::FlatCanvas>,
    pub idx: i32,
}

#[derive(Clone,Copy)]
pub struct ArenaDims {
    pub aspect: f32,
    pub width_px: i32,
    pub height_px: i32,
}

#[allow(dead_code)]
pub struct ArenaData {
    spec: ArenaSpec,
    pub dims: ArenaDims,
    pub canvases: ArenaCanvases,
    pub ctx: glctx,
    pub gpuspec: GPUSpec
}

impl ArenaDims {
    #[allow(dead_code)]
    pub fn prop_x(&self,x_px: i32) -> f32 {
        (x_px as f64 * 2.0 / self.width_px as f64) as f32
    }

    #[allow(dead_code)]
    pub fn prop_y(&self,y_px: i32) -> f32 {
        (y_px as f64 * 2.0 / self.height_px as f64) as f32
    }        
}

pub struct ArenaSpec {
    pub debug: bool,
}

impl ArenaSpec {
    pub fn new() -> ArenaSpec {
        ArenaSpec {
            debug: false
        }
    }
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
    pub fn new(selector: &str, mcsel: &str, spec: ArenaSpec) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector,mcsel,spec.debug);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(2,2));
        console!("{:?} x {:?}",canvas.width(),canvas.height());
        let data = Rc::new(RefCell::new(ArenaData {
            ctx, spec, 
            gpuspec: GPUSpec::new(),
            dims: ArenaDims {
                aspect: canvasutil::aspect_ratio(&canvas),
                width_px: canvas.width() as i32,
                height_px: canvas.height() as i32,
            },
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

    pub fn dims(&self) -> ArenaDims {
        self.data.borrow().dims
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
            let u = stage.get_uniforms(&datam.canvases,
                                       &datam.dims);
            for (key, value) in &u {
                if let Some(obj) = geom.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            geom.draw(datam);
        }
    }
}

#[derive(Clone,Copy)]
pub struct Stage {
    pub pos: COrigin,
    pub zoom: f32,
}

impl Stage {
    pub fn new() -> Stage {
        Stage { pos: COrigin(0.,0.), zoom: 1.0 }
    }

    pub fn get_uniforms(&self, canvs: &ArenaCanvases, dims: &ArenaDims) -> HashMap<&str,UniformValue> {
        hashmap! {
            "uSampler" => UniformValue::Int(canvs.idx),
            "uStageHpos" => UniformValue::Float(self.pos.0),
            "uStageVpos" => UniformValue::Float((self.pos.1 + dims.height_px as f32)/2.),
            "uStageZoom" => UniformValue::Float(self.zoom),
            "uAspect" =>    UniformValue::Float(dims.aspect),
            "uSize" => UniformValue::Vec2F(
                dims.width_px as f32/2.,
                dims.height_px as f32/2.)
        }
    }
}
