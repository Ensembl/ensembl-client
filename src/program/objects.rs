use std::collections::HashMap;
use texture::TextureDrawRequestHandle;
use stdweb::web::TypedArray;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
    WebGLUniformLocation as gluni,
    WebGLProgram as glprog,
};

use wglraw;

use program::data::DataBatch;

use arena::{
    Stage,
    ArenaData,
    ArenaDims,
};

use coord::{
    Input,
};

/* This is the meat of each Object implementation */
pub trait Object {
    fn add_f32(&mut self, _values: &[f32], _batch: &mut DataBatch) {}
    fn add_tdr(&mut self, _value: &TextureDrawRequestHandle) {}

    fn get_tdr(&self) -> Vec<TextureDrawRequestHandle> {
        Vec::<TextureDrawRequestHandle>::new()
    }

    fn add_data(&mut self, _batch: &mut DataBatch, _values: &[&Input]) {}
    fn to_gl(&mut self, _batch: &mut DataBatch, _adata: &ArenaData) {}
    fn stage_gl(&mut self, _adata: &ArenaData, _stage: &Stage) {}
    fn execute(&self, _adata : &ArenaData, _batch: &DataBatch,
               _stage: &Stage, _dims: &ArenaDims) {}
}

/* ObjectCanvasTexture = Object for canvas-origin textures */
pub struct ObjectCanvasTexture {
    texture: Option<gltex>,
}

impl ObjectCanvasTexture {
    pub fn new() -> ObjectCanvasTexture {
        ObjectCanvasTexture {
            texture: None
        }
    }
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl Object for ObjectCanvasTexture {
    fn to_gl(&mut self, _batch: &mut DataBatch, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn execute(&self, adata : &ArenaData, _batch: &DataBatch,
               _stage: &Stage, _dims: &ArenaDims) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
        }
    }
}

#[derive(Clone,Copy)]
pub enum UniformValue {
    Float(f32),
    Vec2F(f32,f32),
    Int(i32)
}

pub struct ObjectUniform {
    name: String,
    val: Option<UniformValue>,
    buf: Option<gluni>,
}

impl ObjectUniform {
    pub fn new(adata: &ArenaData, prog: &glprog, name: &str) -> ObjectUniform {
        ObjectUniform {
            name: name.to_string(),
            buf: adata.ctx.get_uniform_location(prog,name),
            val: None
        }
    }
}

impl Object for ObjectUniform {
    fn execute(&self, adata : &ArenaData, _batch: &DataBatch, _stage: &Stage, _dims: &ArenaDims) {
        if let Some(ref loc) = self.buf {
            match self.val {
                Some(UniformValue::Vec2F(u,v)) =>
                    adata.ctx.uniform2f(Some(loc),u,v),
                Some(UniformValue::Float(v)) =>
                    adata.ctx.uniform1f(Some(loc),v),
                Some(UniformValue::Int(v)) =>
                    adata.ctx.uniform1i(Some(loc),v),
                None => ()
            }
        }
    }
    
    fn stage_gl(&mut self, adata: &ArenaData, stage: &Stage) {
        let dims = &adata.dims;
        let canvs = &adata.canvases;
        if let Some(uval) = stage.get_key(canvs,dims,&self.name) {
            self.val = Some(uval);
        }
    }
}

pub struct ObjectAttrib {
    vec : HashMap<u32,Vec<f32>>,
    buf: HashMap<u32,glbuf>,
    loc: u32,
    size: u8,
}

impl ObjectAttrib {
    pub fn new(adata: &ArenaData, prog: &glprog, name: &str, size: u8) -> ObjectAttrib {
        let ctx = &adata.ctx;
        ObjectAttrib {
            vec: HashMap::<u32,Vec<f32>>::new(),
            buf: HashMap::<u32,glbuf>::new(),
            loc: ctx.get_attrib_location(prog,name) as u32,
            size
        }
    }
    
    fn buffer(&self, b: &DataBatch) -> Option<&glbuf> {
        self.buf.get(&b.id())
    }
    
    fn data(&self, b: &DataBatch) -> Option<&Vec<f32>> {
        self.vec.get(&b.id())
    }

    fn data_mut(&mut self, b: &DataBatch) -> &mut Vec<f32> {
        self.vec.entry(b.id()).or_insert_with(|| Vec::<f32>::new())
    }
}

impl Object for ObjectAttrib {
    fn to_gl(&mut self, batch: &mut DataBatch, adata: &ArenaData) {
        self.buf.entry(batch.id()).or_insert_with(|| wglraw::init_buffer(&adata.ctx));
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                adata.ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(&buf));
                let data = TypedArray::<f32>::from(&(data[..])).buffer();
                adata.ctx.buffer_data_1(glctx::ARRAY_BUFFER,Some(&data),glctx::STATIC_DRAW);
            }
        }
    }

    fn execute(&self, adata : &ArenaData, batch: &DataBatch, _stage: &Stage, _dims: &ArenaDims) {
        let ctx = &adata.ctx;
        if let Some(buf) = self.buffer(batch) {
            ctx.enable_vertex_attrib_array(self.loc);
            ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(buf));
            ctx.vertex_attrib_pointer(self.loc, self.size as i32,
                                      glctx::FLOAT, false, 0, 0);
        }
    }

    fn add_data(&mut self, batch: &mut DataBatch, values: &[&Input]) {
        for v in values {
            v.to_f32(self,batch);
        }
    }

    fn add_f32(&mut self,values : &[f32], batch: &mut DataBatch) {
        self.data_mut(batch).extend_from_slice(values);
    }
}
