use std::collections::HashMap;
use texture::TextureDrawRequestHandle;
use stdweb::web::TypedArray;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
};

use wglraw;

use program::{ ProgramCode };
use program::execute::DataBatch;

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
    fn execute(&self, _adata : &ArenaData, 
               _pcode: &ProgramCode, _batch: &DataBatch,
               _stage: &Stage, _dims: &ArenaDims) {}
}

pub struct ObjectStage {
}

impl ObjectStage {
    pub fn new() -> ObjectStage {
        ObjectStage {}
    }
}

impl Object for ObjectStage {    
    fn execute(&self, adata : &ArenaData, pcode: &ProgramCode,
                _batch: &DataBatch, stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        pcode.set_uniform_1f(ctx,"uStageHpos",stage.pos.0);
        pcode.set_uniform_1f(ctx,"uStageVpos",(stage.pos.1 + dims.height_px as f32)/2.);
        pcode.set_uniform_1f(ctx,"uStageZoom",stage.zoom);
        pcode.set_uniform_1f(ctx,"uAspect",dims.aspect);
        pcode.set_uniform_2f(ctx,"uSize",[
            dims.width_px as f32/2.,
            dims.height_px as f32/2.]);
    }
}

/* ObjectCanvasTexture = Object for canvas-origin textures */
pub struct ObjectCanvasTexture {
    name: String,
    texture: Option<gltex>,
}

impl ObjectCanvasTexture {
    pub fn new(name: &str) -> ObjectCanvasTexture {
        ObjectCanvasTexture {
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

impl Object for ObjectCanvasTexture {
    fn to_gl(&mut self, _batch: &mut DataBatch, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn execute(&self, adata : &ArenaData, pcode: &ProgramCode,
                _batch: &DataBatch, _stage: &Stage, _dims: &ArenaDims) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
            pcode.set_uniform_1i(&adata.ctx,&self.name,canvases.idx);
        }
    }
}

pub struct ObjectAttrib {
    vec : HashMap<u32,Vec<f32>>,
    buf: HashMap<u32,glbuf>,
    name: String,
    size: u8,
}

impl ObjectAttrib {
    pub fn new(_adata: &ArenaData, name: &str, size: u8) -> ObjectAttrib {
        ObjectAttrib {
            vec: HashMap::<u32,Vec<f32>>::new(),
            buf: HashMap::<u32,glbuf>::new(),
            name: name.to_string(),
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

    fn execute(&self, adata : &ArenaData, pcode: &ProgramCode, batch: &DataBatch, _stage: &Stage, _dims: &ArenaDims) {
        if let Some(buf) = self.buffer(batch) {
            pcode.set_attribute(&adata.ctx,&self.name,buf,self.size);
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
