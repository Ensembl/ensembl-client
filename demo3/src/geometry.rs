use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
    WebGLTexture as gltex,
};

use arena::{
    Stage,
    ArenaData
};

use canvasutil::{
    FlatCanvas
};

use wglraw;
use std::cell::RefCell;
use std::rc::Rc;
use domutil;

use stdweb::unstable::TryInto;
use stdweb::web::html_element::CanvasElement;

/* Geometries must implement Geometry for the arena to use them */
pub trait Geometry {
    fn populate(&mut self);
    fn draw(&self,stage:&Stage);
}

/* Usually StdGeometry provides all a Geometry needs, so compose it */
pub struct StdGeometry {
    adata: Rc<RefCell<ArenaData>>,
    indices: i32,
    prog: glprog,
    buffers : Vec<Box<GTypeImpl>>,
    num_idx : i8,
}

impl StdGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>,
               v_src: &str, f_src: &str, num_idx: i8) -> StdGeometry {
        let prog;
        {
            let ctx = &adata.borrow().ctx;
            prog = wglraw::prepare_shaders(&ctx,v_src,f_src);
        }
        let geom = StdGeometry {
            adata, prog, num_idx,
            buffers :  Vec::<Box<GTypeImpl>>::new(),
            indices : 0,
        };
        geom
    }
    
    pub fn get_adata(&self) -> Rc<RefCell<ArenaData>> {
        self.adata.clone()
    }
    
    pub fn add_spec(&mut self,spec: &GType) {
        //let ctx = &self.adata.borrow().ctx;
        //self.buffers.push(spec.new(ctx));
        self.buffers.push(spec.new(&self.adata.borrow()));
    }
    
    pub fn populate(&mut self) {
        let adata = &self.adata.borrow();
        for g in &mut self.buffers {
            g.populate(&adata);
        }
    }
    
    pub fn add(&mut self, i : usize, data : &[f32]) {
        self.buffers[i].add(data);
    }
    
    pub fn advance(&mut self) {
        self.indices = self.indices + (self.num_idx as i32);
    }
    
    pub fn select(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.use_program(Some(&self.prog));
    }

    pub fn draw_triangles(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }
    
    pub fn draw(&self,stage:&Stage) {
        // set uniforms
        let data = &self.adata.borrow();
        let ctx = &data.ctx;
        let aspect = data.aspect;
        ctx.use_program(Some(&self.prog));
        wglraw::set_uniform_1f(&ctx,&self.prog,"uStageHpos",stage.hpos);
        wglraw::set_uniform_1f(&ctx,&self.prog,"uStageVpos",stage.vpos);
        wglraw::set_uniform_1f(&ctx,&self.prog,"uStageZoom",stage.zoom);
        wglraw::set_uniform_2f(&ctx,&self.prog,"uCursor",stage.cursor);
        wglraw::set_uniform_1f(&ctx,&self.prog,"uAspect",aspect);
        // link
        self.select();
        for g in &self.buffers {
            g.link(&data,&self.prog);
        }      
        // draw
        self.draw_triangles();
        // unlink
        for g in &self.buffers {
            g.unlink(&ctx,&self.prog);
        }      
    }
}

/* To create a StdGeometry you will need to add some GTypes */
pub trait GType {
    fn new(&self, adata: &ArenaData) -> Box<GTypeImpl>;
}

/* This is the meat of each GType implementation */
pub trait GTypeImpl {
    fn add(&mut self,_values : &[f32]) {}
    fn populate(&mut self, _adata: &ArenaData) {}
    fn link(&self, _adata : &ArenaData, _prog : &glprog) {}
    fn unlink(&self, _ctx : &glctx, _prog : &glprog) {}
}

/* GTypeAttrib = GType for regular WebGL attribs */
pub struct GTypeAttrib<'a> {
    pub name: &'a str,
    pub size: i8,
    pub rep: i8,
}

impl<'a> GType for GTypeAttrib<'a> {
    fn new(&self, adata: &ArenaData) -> Box<GTypeImpl> {
        Box::new(GTypeAttribImpl {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&adata.ctx),
            name: self.name.to_string(),
            size: self.size,
            rep: self.rep,
        })
    }
}

struct GTypeAttribImpl {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: i8,
    rep: i8
}

impl GTypeImpl for GTypeAttribImpl {
    fn add(&mut self,values : &[f32]) {
        for _i in 0..self.rep {
            self.vec.extend_from_slice(values);
        }
    }

    fn populate(&mut self, adata: &ArenaData) {
        wglraw::populate_buffer(&adata.ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        self.vec.clear();
    }

    fn link(&self, adata : &ArenaData, prog : &glprog) {
        wglraw::link_buffer(&adata.ctx,prog,&self.name,self.size,&self.buf);
    }
}

/* GTypeTexture = GType for textures */
pub struct GTypeTexture<'a> {
    pub uname: &'a str,
    pub slot: i8,
    pub width: u32,
    pub height: u32,
    pub texture : &'a [u8],
}

struct GTypeTextureImpl {
    uname: String,
    slot: i8,
    texture : gltex,
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl GTypeImpl for GTypeTextureImpl {
    fn link(&self, adata : &ArenaData, prog : &glprog) {
        adata.ctx.active_texture(TEXIDS[self.slot as usize]);
        adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&self.texture));        
        wglraw::set_uniform_1i(&adata.ctx,prog,&self.uname,self.slot as i32);
    }
}

impl<'a> GType for GTypeTexture<'a> {
    fn new(&self, adata: &ArenaData) -> Box<GTypeImpl> {
        Box::new(GTypeTextureImpl {
            uname: self.uname.to_string(),
            slot: self.slot,
            texture: wglraw::make_texture(&adata.ctx,self.width,self.height,self.texture),
        })
    }
}

/* GTypeCanvasTexture = GType for canvas-origin textures */
pub struct GTypeCanvasTexture<'a> {
    pub uname: &'a str,
    pub slot: i8,
}

struct GTypeCanvasTextureImpl {
    uname: String,
    slot: i8,
    texture: Option<gltex>,
}

impl GTypeImpl for GTypeCanvasTextureImpl {
    fn populate(&mut self, adata: &ArenaData) {
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,adata.flat.element()));
    }

    fn link(&self, adata : &ArenaData, prog : &glprog) {
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[self.slot as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
        }
        wglraw::set_uniform_1i(&adata.ctx,prog,&self.uname,self.slot as i32);
    }
}

impl<'a> GType for GTypeCanvasTexture<'a> {
    fn new(&self, adata: &ArenaData) -> Box<GTypeImpl> {
        let cnv : CanvasElement = domutil::query_select("#managedcanvasholder canvas").try_into().unwrap();
        Box::new(GTypeCanvasTextureImpl {
            uname: self.uname.to_string(),
            slot: self.slot,
            texture: None,
        })
    }
}
