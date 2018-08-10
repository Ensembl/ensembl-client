pub mod stretch;
pub mod pin;
pub mod fix;
pub mod stretchtex;
pub mod pintex;
pub mod fixtex;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
    WebGLTexture as gltex,
    WebGLUniformLocation as gluni,
};

use arena::{
    Stage,
    ArenaData,
    ArenaDims,
};

use wglraw;
use std::rc::Rc;
use std::collections::HashMap;

#[derive(Clone,Copy)]
pub struct GCoord(pub f32,pub f32);

impl GCoord {
    fn mix(&self, other: GCoord) -> (GCoord,GCoord) {
        (GCoord(self.0,other.1), GCoord(other.0,self.1))
    }
}

#[derive(Clone,Copy)]
pub struct PCoord(pub f32,pub f32);

impl PCoord {
    fn mix(&self, other: PCoord) -> (PCoord,PCoord) {
        (PCoord(self.0,other.1), PCoord(other.0,self.1))
    }
    
    fn scale(&self, scale: PCoord) -> PCoord {
        PCoord(self.0 * scale.0, self.1 * scale.1)
    }
}

#[derive(Clone,Copy)]
pub struct Colour(pub f32,pub f32,pub f32);

/* Geometries must implement Geometry for the arena to use them */
pub trait Geometry {
    fn gtypes(&mut self) -> (&GLProgram,Vec<&mut GType>);
    fn populate(&mut self, &mut ArenaData);
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage);
    fn restage(&mut self, ctx: &glctx, prog: &glprog, stage: &Stage, dims: &ArenaDims);
}

pub fn draw(holder: &mut Geometry, adata: &ArenaData, stage:&Stage) {
    let prog;
    let indices;
    {
        let (std,types) = holder.gtypes();
        indices = std.indices;
        prog = std.prog.clone();
    }
    // link
    let ctx = &adata.ctx;
    let aspect = adata.dims.aspect;
    ctx.use_program(Some(&prog));
    {
        let (std,mut types) = holder.gtypes();
        for g in &mut types {
            g.link(adata,&prog);
        }
    }
    holder.restage(&ctx,&prog,stage,&adata.dims);
    // draw
    ctx.draw_arrays(glctx::TRIANGLES,0,indices);
    // unlink
    {
        let (std,types) = holder.gtypes();
        for g in &types {
            g.unlink(&ctx,&prog);
        }
    }
}

pub fn populate(holder: &mut Geometry, adata: &mut ArenaData) {
    let (_std,mut types) = holder.gtypes();
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
    fn populate(&mut self, _adata: &ArenaData) {}
    fn link(&mut self, _adata : &ArenaData, _prog : &glprog) {}
    fn unlink(&self, _ctx : &glctx, _prog : &glprog) {}
}

pub struct GLProgram {
    indices: i32,
    prog: Rc<glprog>,
    uniforms: HashMap<String,gluni>
}

fn find_uniforms(ctx: &glctx, prog: &Rc<glprog>, uniforms: &Vec<String>) -> HashMap<String,gluni> {
    let mut udata = HashMap::<String,gluni>::new();
    for u in uniforms {
        let loc = ctx.get_uniform_location(&prog,&u);
        if loc.is_some() {
            udata.insert(u.to_string(),loc.unwrap());
        }
    }
    udata
}

impl GLProgram {
    pub fn new(adata: &ArenaData,vsrc: &str, fsrc: &str, uniforms: &Vec<String>) -> GLProgram {
        let ctx = &adata.ctx;
        let prog = Rc::new(prog(adata,vsrc,fsrc));
        ctx.use_program(Some(&prog));
        let udata = find_uniforms(ctx,&prog,uniforms);
        GLProgram {
            prog,
            uniforms: udata,
            indices: 0,
        }
    }
    
    pub fn advance(&mut self,amt: i32) { self.indices += amt; }
    
    pub fn uniform(&self, name: &str) -> Option<&gluni> {
        self.uniforms.get(name)
    }

    pub fn set_uniform_1i(&self, ctx: &glctx, name:&str, value: i32) {
        if let Some(loc) = self.uniforms.get(name) {
            ctx.uniform1i(Some(&loc),value);
        }
    }
    
    pub fn set_uniform_1f(&self, ctx: &glctx, name:&str, value: f32) {
        if let Some(loc) = self.uniforms.get(name) {
            ctx.uniform1f(Some(&loc),value);
        }
    }
    
    pub fn set_uniform_2f(&self, ctx: &glctx, name:&str, value: [f32;2]) {
        if let Some(loc) = self.uniforms.get(name) {
            ctx.uniform2f(Some(&loc),value[0],value[1]);
        }
    }
    
}

/* GTypeCanvasTexture = GType for canvas-origin textures */
pub struct GTypeCanvasTexture {
    idx: Option<i32>,
    texture: Option<gltex>,
}

impl GTypeCanvasTexture {
    pub fn new() -> GTypeCanvasTexture {
        GTypeCanvasTexture {
            idx: None,
            texture: None
        }
    }

    fn set_uniform(&self, ctx: &glctx, std: &GLProgram, name: &str) {
        if let Some(idx) = self.idx {
            std.set_uniform_1i(ctx,name,idx);
        }
    }
}

impl GType for GTypeCanvasTexture {
    fn populate(&mut self, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn link(&mut self, adata : &ArenaData, prog : &glprog) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
            self.idx = Some(canvases.idx);
        }
    }
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
    
    fn add(&mut self,values : &[f32]) {
        for _i in 0..self.rep {
            self.vec.extend_from_slice(values);
        }
    }

    fn add_gc(&mut self,values : &[GCoord]) {
        for _i in 0..self.rep {
            for c in values {
                self.vec.extend_from_slice(&[c.0,c.1]);
            }
        }
    }

    fn add_px(&mut self,values : &[PCoord]) {
        for _i in 0..self.rep {
            for c in values {
                self.vec.extend_from_slice(&[c.0,c.1]);
            }
        }
    }
    
    fn add_col(&mut self, col: &Colour) {
        for _i in 0..self.rep {
            self.vec.extend_from_slice(&[col.0,col.1,col.2]);
        }
    }
}

impl GType for GTypeAttrib {
    fn populate(&mut self, adata: &ArenaData) {
        wglraw::populate_buffer(&adata.ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        self.vec.clear();
    }

    fn link(&mut self, adata : &ArenaData, prog : &glprog) {
        wglraw::link_buffer(&adata.ctx,prog,&self.name,self.size,&self.buf);
    }
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

pub fn shader_v_solid(x: &str, y: &str) -> String {
    format!("
        attribute vec2 aVertexPosition;
        attribute vec3 aVertexColour;
        attribute vec2 aOrigin;

        uniform float uAspect;
        uniform float uStageHpos;
        uniform float uStageVpos;
        uniform float uStageZoom;
        uniform vec2 uCursor;
        uniform vec2 uSize;

        varying lowp vec3 vColour;

        void main() {{
             gl_Position = vec4({},{},0.0, 1.0);
            vColour = aVertexColour;
        }}
    ",x,y).to_string()
}

pub fn shader_u_solid() -> Vec<String> {
    vec! {
        "uAspect".to_string(),
        "uStageHpos".to_string(),
        "uStageVpos".to_string(),
        "uStageZoom".to_string(),
        "uCursor".to_string(),        
        "uSize".to_string(),
    }
}

pub fn shader_v_texture(x: &str, y: &str) -> String {
    format!("
attribute vec2 aVertexPosition;
attribute vec2 aOrigin;
attribute vec2 aTextureCoord;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;
uniform vec2 uSize;
uniform vec2 uCursor;


varying highp vec2 vTextureCoord;

void main() {{
    gl_Position = vec4({}, {}, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}}
    ",x,y).to_string()
}

pub fn shader_u_texture() -> Vec<String> {
    vec! {
        "uAspect".to_string(),
        "uStageHpos".to_string(),
        "uStageVpos".to_string(),
        "uStageZoom".to_string(),
        "uSampler".to_string(),
        "uCursor".to_string(),
        "uSize".to_string(),
    }
}

pub fn shader_v_solid_3vec(x: &str, y: &str) -> String {
    format!("
        attribute vec3 aVertexPosition;
        attribute vec3 aVertexColour;

        uniform float uAspect;
        uniform float uStageHpos;
        uniform float uStageVpos;
        uniform float uStageZoom;
        uniform vec2 uCursor;
        uniform vec2 uSize;

        varying lowp vec3 vColour;

        void main() {{
             gl_Position = vec4({},{},0.0, 1.0);
            vColour = aVertexColour;
        }}
    ",x,y).to_string()
}

pub fn shader_v_texture_3vec(x: &str, y: &str) -> String {
    format!("
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
        

        uniform float uAspect;
        uniform float uStageHpos;
        uniform float uStageVpos;
        uniform float uStageZoom;
        uniform vec2 uCursor;
        uniform vec2 uSize;

        varying highp vec2 vTextureCoord;

        void main() {{
             gl_Position = vec4({},{},0.0, 1.0);
             vTextureCoord = aTextureCoord;
        }}
    ",x,y).to_string()
}

pub fn shader_u_texture_3vec() -> Vec<String> {
    vec! {
        "uAspect".to_string(),
        "uStageHpos".to_string(),
        "uStageVpos".to_string(),
        "uStageZoom".to_string(),
        "uCursor".to_string(),
        "uSampler".to_string(),
        "uSize".to_string(),
    }
}

pub fn shader_f_solid() -> String {
    "
    varying lowp vec3 vColour;

    void main() {
          gl_FragColor = vec4(vColour, 1.0);
    }
    ".to_string()
}

pub fn shader_f_texture() -> String {
    "
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;

        void main() {{
              gl_FragColor = texture2D(uSampler, vTextureCoord);
        }}
    ".to_string()
}
