use std::collections::HashMap;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;

use geometry::{
    GLProgram
};
use geometry::coord::{
    GCoord,
    PCoord,
    Colour
};

use geometry::stretch::stretch_geom;
use geometry::stretchtex::stretchtex_geom;
use geometry::fix::fix_geom;
use geometry::fixtex::fixtex_geom;
use geometry::pin::pin_geom;
use geometry::pintex::pintex_geom;

use canvasutil::FCFont;

use texture::text::TextTextureStore;
use texture::bitmap::BitmapTextureStore;

use texture::{
    TextureSourceManager,
};

use shape::fixtexture::fix_texture;
use shape::pintexture::pin_texture;
use shape::stretchtexture::stretch_texture;

struct ArenaTextures {
    text: TextTextureStore,
    bitmap: BitmapTextureStore,
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
    textures: ArenaTextures,
    pub dims: ArenaDims,
    pub canvases: ArenaCanvases,
    pub gtexreqman: TextureSourceManager,
    pub ctx: glctx,
}

impl ArenaData {
    /* help the borrow checker by splitting a mut in a way that it
     * understands is disjoint.
     */
    fn burst_texture<'a>(&'a mut self) -> (&'a mut ArenaCanvases, &'a mut ArenaTextures, &'a mut TextureSourceManager,&'a mut ArenaDims) {
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
    data: Rc<RefCell<ArenaData>>,
    order: Vec<String>,
    map: HashMap<String,GLProgram>
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

    pub fn get_geom(&mut self, name: &str) -> &mut GLProgram {
        self.map.get_mut(name).unwrap()
    }

    pub fn dims(&self) -> ArenaDims {
        self.data.borrow().dims
    }

    pub fn settle(&self, stage: &mut Stage) {
        self.data.borrow().dims.settle(stage);
    }  

    pub fn text_pin(&mut self, origin:&GCoord,chars: &str,font: &FCFont, col: &Colour) {
        let tr;
        {
            let datam = &mut self.data.borrow_mut();
            let (canvases,textures,gtexreqman,_) = datam.burst_texture();
            tr = textures.text.add(gtexreqman,canvases,chars,font,col);
        }
        pin_texture(self,tr,origin,&PCoord(1.,1.));
    }

    pub fn bitmap_stretch(&mut self, pos:&[GCoord;2], data: Vec<u8>, width: u32, height: u32) {
        let tr;
        {
            let datam = &mut self.data.borrow_mut();
            let (canvases,textures,gtexreqman,_) = datam.burst_texture();
            tr = textures.bitmap.add(gtexreqman,canvases,data,width,height);
        }
        stretch_texture(self,tr,pos);
    }

    pub fn bitmap_pin(&mut self, origin:&GCoord, scale: &PCoord, data: Vec<u8>, width: u32, height: u32) {
        let tr;
        {
            let datam = &mut self.data.borrow_mut();
            let (canvases,textures,gtexreqman,_) = datam.burst_texture();
            tr = textures.bitmap.add(gtexreqman,canvases,data,width,height);
        }
        pin_texture(self,tr,origin,scale);
    }

    pub fn bitmap_fix(&mut self, pos: &PCoord, scale: &PCoord, data: Vec<u8>, width: u32, height: u32) {
        let tr;
        {
            let datam = &mut self.data.borrow_mut();
            let (canvases,textures,gtexreqman,_) = datam.burst_texture();
            tr = textures.bitmap.add(gtexreqman,canvases,data,width,height);
        }
        fix_texture(self,tr,pos,scale);
    }
        
    pub fn text_fix(&mut self, origin:&PCoord,chars: &str,font: &FCFont, col: &Colour) {
        let tr;
        {
            let datam = &mut self.data.borrow_mut();
            let (canvases,textures,gtexreqman,_) = datam.burst_texture();
            tr = textures.text.add(gtexreqman,canvases,chars,font,col);
        }
        fix_texture(self,tr,origin,&PCoord(1.,1.));
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
