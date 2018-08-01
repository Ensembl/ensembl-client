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
    fn draw(&mut self,stage:&Stage);
}

pub fn draw(holder: &mut GTypeHolder,stage:&Stage) {
    let (std,mut types) = holder.gtypes();
    
    let adatac = std.adata.clone();
    let data = adatac.borrow();
    let indices = std.indices;
    let prog = std.prog.clone();

    // set uniforms
    let ctx = &data.ctx;
    let aspect = data.aspect;
    ctx.use_program(Some(&prog));
    wglraw::set_uniform_1f(&ctx,&prog,"uStageHpos",stage.hpos);
    wglraw::set_uniform_1f(&ctx,&prog,"uStageVpos",stage.vpos);
    wglraw::set_uniform_1f(&ctx,&prog,"uStageZoom",stage.zoom);
    wglraw::set_uniform_2f(&ctx,&prog,"uCursor",stage.cursor);
    wglraw::set_uniform_1f(&ctx,&prog,"uAspect",aspect);
    // link
    ctx.use_program(Some(&prog));
    for g in &types {
        g.link(&data,&prog);
    }      
    // draw
    ctx.draw_arrays(glctx::TRIANGLES,0,indices);
    // unlink
    for g in &types {
        g.unlink(&ctx,&prog);
    }
}

pub fn populate(holder: &mut GTypeHolder) {
    let (std,mut types) = holder.gtypes();
    let adatac = std.adata.clone();
    let adata = adatac.borrow();
    for g in &mut types {
        g.populate(&adata);
    }
}

pub fn prog(adata: Rc<RefCell<ArenaData>>,v_src: &str, f_src: &str) -> glprog {
    let ctx = &adata.borrow().ctx;
    wglraw::prepare_shaders(&ctx,v_src,f_src)
}

/* This is the meat of each GType implementation */
pub trait GType {
    fn add(&mut self,_values : &[f32]) {}
    fn populate(&mut self, _adata: &ArenaData) {}
    fn link(&self, _adata : &ArenaData, _prog : &glprog) {}
    fn unlink(&self, _ctx : &glctx, _prog : &glprog) {}
}

pub struct GeomContext {
    adata: Rc<RefCell<ArenaData>>,
    indices: i32,
    prog: Rc<glprog>    
}

impl GeomContext {
    pub fn new(adata: Rc<RefCell<ArenaData>>, vsrc: &str, fsrc: &str) -> GeomContext {
        GeomContext {
            adata: adata.clone(),
            prog: Rc::new(prog(adata.clone(),vsrc,fsrc)),
            indices: 0,
        }
    }
    
    pub fn advance(&mut self,amt: i32) { self.indices += amt; }
    pub fn get_adata(&self) -> Rc<RefCell<ArenaData>> {
        return self.adata.clone();
    }
}

pub trait GTypeHolder {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>);
}

impl Geometry for GTypeHolder {
    fn populate(&mut self) { populate(self); }
    fn draw(&mut self,stage:&Stage) { draw(self,stage); }
}

pub struct GTypeAttrib {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: i8,
    rep: i8
}

impl GTypeAttrib {
    pub fn new(adata: &ArenaData, name: &str,size: i8, rep: i8) -> GTypeAttrib {
        GTypeAttrib {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&adata.ctx),
            name: name.to_string(),
            size, rep
        }
    }
}

impl GType for GTypeAttrib {
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

pub struct GTypeTexture {
    uname: String,
    slot: i8,
    texture : gltex,
}

impl GTypeTexture {
    pub fn new(adata: &ArenaData,name: &str, slot: i8, texture: &[u8], width: u32, height: u32) -> GTypeTexture {
        GTypeTexture {
            uname: name.to_string(),
            slot,
            texture: wglraw::make_texture(&adata.ctx,width,height,texture)
        }
    }
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl GType for GTypeTexture {
    fn link(&self, adata : &ArenaData, prog : &glprog) {
        adata.ctx.active_texture(TEXIDS[self.slot as usize]);
        adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&self.texture));        
        wglraw::set_uniform_1i(&adata.ctx,prog,&self.uname,self.slot as i32);
    }
}

/* GTypeCanvasTexture = GType for canvas-origin textures */
pub struct GTypeCanvasTexture {
    uname: String,
    slot: i8,
    texture: Option<gltex>,
}

impl GTypeCanvasTexture {
    pub fn new(name: &str, slot: i8) -> GTypeCanvasTexture {
        GTypeCanvasTexture {
            uname: name.to_string(),
            slot,
            texture: None
        }
    }
}

impl GType for GTypeCanvasTexture {
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
