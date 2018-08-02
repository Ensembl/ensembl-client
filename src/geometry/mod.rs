pub mod stretch;
pub mod pin;
pub mod fix;

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

/* Geometries must implement Geometry for the arena to use them */
pub trait Geometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>);
    fn populate(&mut self, &mut ArenaData);
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage);
}

pub fn draw(holder: &mut Geometry, adata: &ArenaData ,stage:&Stage) {
    let (std,types) = holder.gtypes();
    
    let indices = std.indices;
    let prog = std.prog.clone();

    // set uniforms
    let ctx = &adata.ctx;
    let aspect = adata.aspect;
    ctx.use_program(Some(&prog));
    wglraw::set_uniform_1f(&ctx,&prog,"uStageHpos",stage.hpos);
    wglraw::set_uniform_1f(&ctx,&prog,"uStageVpos",stage.vpos);
    wglraw::set_uniform_1f(&ctx,&prog,"uStageZoom",stage.zoom);
    wglraw::set_uniform_2f(&ctx,&prog,"uCursor",stage.cursor);
    wglraw::set_uniform_1f(&ctx,&prog,"uAspect",aspect);
    // link
    ctx.use_program(Some(&prog));
    for g in &types {
        g.link(adata,&prog);
    }      
    // draw
    ctx.draw_arrays(glctx::TRIANGLES,0,indices);
    // unlink
    for g in &types {
        g.unlink(&ctx,&prog);
    }
}

pub fn populate(holder: &mut Geometry, adata: &mut ArenaData) {
    let (std,mut types) = holder.gtypes();
    for g in &mut types {
        g.populate(adata);
    }
}

pub fn prog(adata: &ArenaData,v_src: &str, f_src: &str) -> glprog {
    let ctx = &adata.ctx;
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
    indices: i32,
    prog: Rc<glprog>    
}

impl GeomContext {
    pub fn new(adata: &ArenaData,vsrc: &str, fsrc: &str) -> GeomContext {
        GeomContext {
            prog: Rc::new(prog(adata,vsrc,fsrc)),
            indices: 0,
        }
    }
    
    pub fn advance(&mut self,amt: i32) { self.indices += amt; }
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

pub fn shader_v_solid(x: &str, y: &str) -> String{
    format!("
        attribute vec2 aVertexPosition;
        attribute vec3 aVertexColour;
        attribute vec2 aOrigin;

        uniform float uAspect;
        uniform float uStageHpos;
        uniform float uStageVpos;
        uniform float uStageZoom;
        uniform vec2 uCursor;

        varying lowp vec3 vColour;

        void main() {{
             gl_Position = vec4({},{},0.0, 1.0);
            vColour = aVertexColour;
        }}
    ",x,y).to_string()
}

pub fn shader_v_solid_3vec(x: &str, y: &str) -> String{
    format!("
        attribute vec3 aVertexPosition;
        attribute vec3 aVertexColour;

        uniform float uAspect;
        uniform float uStageHpos;
        uniform float uStageVpos;
        uniform float uStageZoom;
        uniform vec2 uCursor;

        varying lowp vec3 vColour;

        void main() {{
             gl_Position = vec4({},{},0.0, 1.0);
            vColour = aVertexColour;
        }}
    ",x,y).to_string()
}

pub fn shader_f_solid() -> String {
    "
    varying lowp vec3 vColour;

    void main() {
          gl_FragColor = vec4(vColour, 1.0);
    }
    ".to_string()
}
