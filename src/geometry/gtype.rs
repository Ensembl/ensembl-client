use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
    WebGLShader as glshader,
    WebGLUniformLocation as gluni,
    GLenum,
    GLint,
};

use wglraw;

use geometry::{
    GLProgram
};

use arena::{
    Stage,
    ArenaData,
    ArenaDims,
};

use geometry::coord::{
    GLData,
    GCoord,
    PCoord,
    Colour,
};

/* This is the meat of each GType implementation */
pub trait GType {
    fn add_data(&mut self, values: &[&GLData]) {}
    fn populate(&mut self, _adata: &ArenaData) {}
    fn link(&self, _adata : &ArenaData, _std: &GLProgram,
            stage: &Stage, dims: &ArenaDims) {}
}

pub struct GTypeStage {
}

impl GTypeStage {
    pub fn new() -> GTypeStage {
        GTypeStage {}
    }
}

impl GType for GTypeStage {    
    fn link(&self, adata : &ArenaData, std: &GLProgram, stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        std.set_uniform_1f(ctx,"uStageHpos",stage.pos.0);
        std.set_uniform_1f(ctx,"uStageVpos",stage.pos.1 + (dims.height_px as f32/2.));
        std.set_uniform_1f(ctx,"uStageZoom",stage.zoom);
        std.set_uniform_1f(ctx,"uAspect",dims.aspect);
        std.set_uniform_2f(ctx,"uSize",[
            dims.width_px as f32/2.,
            dims.height_px as f32/2.]);
    }
}

/* GTypeCanvasTexture = GType for canvas-origin textures */
pub struct GTypeCanvasTexture {
    name: String,
    texture: Option<gltex>,
}

impl GTypeCanvasTexture {
    pub fn new(name: &str) -> GTypeCanvasTexture {
        GTypeCanvasTexture {
            name: name.to_string(),
            texture: None
        }
    }
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl GType for GTypeCanvasTexture {
    fn populate(&mut self, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn link(&self, adata : &ArenaData, std: &GLProgram, stage: &Stage, dims: &ArenaDims) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
            std.set_uniform_1i(&adata.ctx,&self.name,canvases.idx);
        }
    }

    fn add_data(&mut self, values: &[&GLData]) {}
}

pub struct GTypeAttrib {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: u8
}

impl GTypeAttrib {
    pub fn new(adata: &ArenaData, name: &str,size: u8) -> GTypeAttrib {
        GTypeAttrib {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&adata.ctx),
            name: name.to_string(),
            size
        }
    }
    
    pub fn add_f32(&mut self,values : &[f32]) {
        self.vec.extend_from_slice(values);
    }
}

impl GType for GTypeAttrib {
    fn populate(&mut self, adata: &ArenaData) {
        wglraw::populate_buffer(&adata.ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        self.vec.clear();
    }

    fn link(&self, adata : &ArenaData, std: &GLProgram, stage: &Stage, dims: &ArenaDims) {
        std.set_attribute(&adata.ctx,&self.name,&self.buf,self.size);
    }

    fn add_data(&mut self, values: &[&GLData]) {
        for v in values {
            v.to_f32(self);
        }
    }
}
