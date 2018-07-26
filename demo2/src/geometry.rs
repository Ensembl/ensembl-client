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

use wglraw;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{
    TypedArray,
};

pub trait Geometry {
    fn populate(&mut self);
    fn draw(&self,stage:&Stage);
}

pub struct StdGeometry {
    adata: Rc<RefCell<ArenaData>>,
    indices: i32,
    prog: glprog,
    buffers : Vec<Box<GeomBufGeneric>>,
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
            buffers :  Vec::<Box<GeomBufGeneric>>::new(),
            indices : 0,
        };
        geom
    }
    
    pub fn add_spec(&mut self,spec: &GeomBufGenerator) {
        
        let ctx = &self.adata.borrow().ctx;
        self.buffers.push(spec.new(ctx));
    }
    
    pub fn populate(&mut self) {
        let ctx = &self.adata.borrow().ctx;
        for g in &mut self.buffers {
            g.populate(&ctx);
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
            g.link(&ctx,&self.prog);
        }      
        // draw
        self.draw_triangles();
        // unlink
        for g in &self.buffers {
            g.unlink(&ctx,&self.prog);
        }      
    }
}

pub trait GeomBufGenerator {
    fn new(&self, ctx: &glctx) -> Box<GeomBufGeneric>;
}

pub struct GeomBufSpec<'a> {
    pub name: &'a str,
    pub size: i8,
    pub rep: i8,
}

impl<'a> GeomBufGenerator for GeomBufSpec<'a> {
    fn new(&self, ctx: &glctx) -> Box<GeomBufGeneric> {
        Box::new(GeomBuf {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&ctx),
            name: self.name.to_string(),
            size: self.size,
            rep: self.rep,
        })
    }
}

pub trait GeomBufGeneric {
    fn add(&mut self,values : &[f32]) {}
    fn populate(&mut self, ctx: &glctx) {}
    fn link(&self, ctx : &glctx, prog : &glprog) {}
    fn unlink(&self, ctx : &glctx, prog : &glprog) {}
}

struct GeomBuf {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: i8,
    rep: i8
}

impl GeomBufGeneric for GeomBuf {
    fn add(&mut self,values : &[f32]) {
        for _i in 0..self.rep {
            self.vec.extend_from_slice(values);
        }
    }

    fn populate(&mut self, ctx: &glctx) {
        wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        self.vec.clear();
    }

    fn link(&self, ctx : &glctx, prog : &glprog) {
        wglraw::link_buffer(ctx,prog,&self.name,self.size,&self.buf);
    }
}

pub struct TexGeomBufSpec<'a> {
    pub uname: &'a str,
    pub slot: i8,
    pub texture : &'a [u8],
}

struct TexGeomBuf {
    uname: String,
    slot: i8,
    texture : gltex,
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl GeomBufGeneric for TexGeomBuf {
    fn link(&self, ctx : &glctx, prog : &glprog) {
        ctx.active_texture(TEXIDS[self.slot as usize]);
        ctx.bind_texture(glctx::TEXTURE_2D,Some(&self.texture));        
        wglraw::set_uniform_1i(ctx,prog,&self.uname,self.slot as i32);
    }
}

impl<'a> GeomBufGenerator for TexGeomBufSpec<'a> {
    fn new(&self, ctx: &glctx) -> Box<GeomBufGeneric> {
        Box::new(TexGeomBuf {
            uname: self.uname.to_string(),
            slot: self.slot,
            texture: wglraw::make_texture(ctx,4,1,self.texture),
        })
    }
}
