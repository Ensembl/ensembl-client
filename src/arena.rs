use std::collections::HashMap;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;

use program::Program;

use coord::{
    GCoord,
    PCoord,
};

use geometry::{
    stretch_geom, stretchtex_geom,
    fix_geom,     fixtex_geom,
    pin_geom,     pintex_geom
};

use texture::text::TextTextureStore;
use texture::bitmap::BitmapTextureStore;

use texture::{
    TextureSourceManager,
};

pub struct ArenaTextures {
    pub text: TextTextureStore,
    pub bitmap: BitmapTextureStore,
}

impl ArenaTextures {
    pub fn new() -> ArenaTextures {
        ArenaTextures {
            text: TextTextureStore::new(),
            bitmap: BitmapTextureStore::new(),
        }
    }
}

pub struct ArenaCanvases {
    pub flat: Rc<canvasutil::FlatCanvas>,
    pub idx: i32,
}

#[derive(Clone,Copy)]
pub struct ArenaDims {
    pub aspect: f32,
    pub width_px: u32,
    pub height_px: u32,
}

#[allow(dead_code)]
pub struct ArenaData {
    spec: ArenaSpec,
    pub textures: ArenaTextures,
    pub dims: ArenaDims,
    pub canvases: ArenaCanvases,
    pub gtexreqman: TextureSourceManager,
    pub ctx: glctx,
}

impl ArenaData {
    /* help the borrow checker by splitting a mut in a way that it
     * understands is disjoint.
     */
    pub fn burst_texture<'a>(&'a mut self) -> (&'a mut ArenaCanvases, &'a mut ArenaTextures, &'a mut TextureSourceManager,&'a mut ArenaDims) {
        (&mut self.canvases,&mut self.textures, &mut self.gtexreqman,
         &mut self.dims)
    }
}

impl ArenaDims {
    #[allow(dead_code)]
    pub fn prop_x(&self,x_px: u32) -> f32 {
        (x_px as f64 * 2.0 / self.width_px as f64) as f32
    }

    #[allow(dead_code)]
    pub fn prop_y(&self,y_px: u32) -> f32 {
        (y_px as f64 * 2.0 / self.height_px as f64) as f32
    }
    
    fn nudge1(&self,val: f32, size: u32) -> f32 {
        let n = (val * size as f32 / 2.).round();
        n * 2. / size as f32
    }
    
    pub fn nudge_g(&self,input: GCoord) -> GCoord {
        GCoord(self.nudge1(input.0,self.width_px),
               self.nudge1(input.1,self.height_px))
    }

    pub fn nudge_p(&self,input: PCoord) -> PCoord {
        PCoord(self.nudge1(input.0,self.width_px),
               self.nudge1(input.1,self.height_px))
    }

    pub fn settle(&self, stage: &mut Stage) {
        // XXX settle should account for zoom
        stage.pos = self.nudge_g(stage.pos);
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
    map: HashMap<String,Program>
}

impl Arena {
    pub fn new(selector: &str, mcsel: &str, spec: ArenaSpec) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector,mcsel,spec.debug);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(2,2));
        let data = Rc::new(RefCell::new(ArenaData {
            ctx, spec, 
            textures: ArenaTextures::new(),
            gtexreqman: TextureSourceManager::new(),
            dims: ArenaDims {
                aspect: canvasutil::aspect_ratio(&canvas),
                width_px: canvas.width(),
                height_px: canvas.height(),
            },
            canvases: ArenaCanvases {
                flat,
                idx: 0,
            },
        }));
        let data_g = data.clone();
        let data_b = data_g.borrow();        
        let arena = Arena {
            data, 
            order: vec_s! {
                "stretch", "stretchtex", 
                "pin", "pintex",
                "fix", "fixtex"
            },
            map: hashmap_s! {
                "stretch" => stretch_geom(&data_b),
                "stretchtex" => stretchtex_geom(&data_b),
                "pin" => pin_geom(&data_b),
                "pintex" => pintex_geom(&data_b),
                "fix" => fix_geom(&data_b),
                "fixtex" => fixtex_geom(&data_b)
            }
        };
        arena
    }

    pub fn get_geom(&mut self, name: &str) -> &mut Program {
        self.map.get_mut(name).unwrap()
    }

    pub fn dims(&self) -> ArenaDims {
        self.data.borrow().dims
    }

    pub fn settle(&self, stage: &mut Stage) {
        self.data.borrow().dims.settle(stage);
    }  
        
    pub fn populate(&mut self) {
        let datam = &mut self.data.borrow_mut();
        {
            let (canvases,_textures,gtexreqman,_) = datam.burst_texture();
            let (x,y) = gtexreqman.allocate();
            canvases.flat = Rc::new(canvasutil::FlatCanvas::create(x,y));
        }
        {
            let (canvases,_,gtexreqman,_) = datam.burst_texture();
            gtexreqman.draw(canvases);
        }
        for k in &self.order {
            self.map.get_mut(k).unwrap().populate(datam);
        }
        datam.gtexreqman.clear();

    }

    pub fn animate(&mut self, stage: &Stage) {
        // prepare arena
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        // draw each geometry
        let datam = &mut self.data.borrow_mut();
        for k in &self.order {
            self.map.get_mut(k).unwrap().draw(datam,&stage);
        }
    }
}

#[derive(Clone,Copy)]
pub struct Stage {
    pub pos: GCoord,
    pub zoom: f32,
}

impl Stage {
    pub fn new() -> Stage {
        Stage { pos: GCoord(0.0,0.0), zoom: 1.0 }
    }
}
