use std::collections::HashMap;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use shape::{ ShapeManager, Shape };

use canvasutil;
use wglraw;

use program::{ Program, GPUSpec, UniformValue };
use onoff::{ OnOffManager, OnOffExpr };

use coord::{
    COrigin,
};

use geometry::{
    stretch_geom,      stretchtex_geom,   stretchspot_geom,
    stretchstrip_geom, fix_geom,          fixtex_geom,
    pin_geom,          pintex_geom,       pinspot_geom,
    pinstrip_geom,     pinstripspot_geom, page_geom,
    pagetex_geom,
};

use drawing::{
    LeafDrawingManager,
    Drawing,
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
    pub leafdrawman: LeafDrawingManager,
    pub ctx: glctx,
    pub gpuspec: GPUSpec
}

impl ArenaData {
    /* help the borrow checker by splitting a mut in a way that it
     * understands is disjoint.
     */
    pub fn burst_texture<'a>(&'a mut self) -> (&'a mut ArenaCanvases, &'a mut LeafDrawingManager,&'a mut ArenaDims) {
        (&mut self.canvases, &mut self.leafdrawman,
         &mut self.dims)
    }
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

pub struct Arena {
    pub data: Rc<RefCell<ArenaData>>,
    order: Vec<String>,
    map: HashMap<String,Program>,
    shapes: ShapeManager
}

impl Arena {
    pub fn new(selector: &str, mcsel: &str, spec: ArenaSpec) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector,mcsel,spec.debug);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(2,2));
        let data = Rc::new(RefCell::new(ArenaData {
            ctx, spec, 
            gpuspec: GPUSpec::new(),
            leafdrawman: LeafDrawingManager::new(),
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
        let arena = Arena {
            shapes: ShapeManager::new(),
            data, 
            order: vec_s! {
                "stretch", "stretchstrip", "stretchspot", "stretchtex", 
                "pin", "pinstrip", "pinspot", "pinstripspot",  "pintex",
                "page", "pagetex",
                "fix", "fixtex"
            },
            map: hashmap_s! {
                "stretch" => stretch_geom(&data_b),
                "stretchstrip" => stretchstrip_geom(&data_b),
                "stretchspot" => stretchspot_geom(&data_b),
                "stretchtex" => stretchtex_geom(&data_b),
                "pin" => pin_geom(&data_b),
                "pinstrip" => pinstrip_geom(&data_b),
                "pinstripspot" => pinstripspot_geom(&data_b),
                "pinspot" => pinspot_geom(&data_b),
                "pintex" => pintex_geom(&data_b),
                "fix" => fix_geom(&data_b),
                "fixtex" => fixtex_geom(&data_b),
                "page" => page_geom(&data_b),
                "pagetex" => pagetex_geom(&data_b)
            }
        };
        arena
    }

    pub fn get_geom(&mut self, name: &str) -> &mut Program {
        self.map.get_mut(name).unwrap()
    }

    pub fn add_shape(&mut self,req: Option<Drawing>, item: Box<Shape>, ooe: Rc<OnOffExpr>) {
        let datam = &mut self.data.borrow_mut();
        self.shapes.add_item(req,item,ooe);
    }

    pub fn dims(&self) -> ArenaDims {
        self.data.borrow().dims
    }
        
    pub fn populate(&mut self, oom: &OnOffManager) {
        let datam = &mut self.data.borrow_mut();
        {
            let (canvases,leafdrawman,_) = datam.burst_texture();
            let size = leafdrawman.allocate();
            canvases.flat = Rc::new(canvasutil::FlatCanvas::create(size.0,size.1));
        }
        {
            let (canvases,leafdrawman,_) = datam.burst_texture();
            leafdrawman.draw(canvases);
        }
        self.shapes.into_objects(&mut self.map,datam,oom);
        self.shapes.clear();
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.objects_to_gl(datam);
        }
        datam.leafdrawman.clear();

    }

    pub fn draw(&mut self, stage: &Stage) {
        // prepare arena
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        // draw each geometry
        let datam = &mut self.data.borrow_mut();
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
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
