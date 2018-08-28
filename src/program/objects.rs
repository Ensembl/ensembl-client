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

use program::data::{ DataBatch, DataGroup };

use arena::{
    ArenaData,
    ArenaDims,
};

use coord::{
    Input,
};

/* This is the meat of each Object implementation */
pub trait Object {
    fn add_f32(&mut self, _values: &[f32], _batch: &DataBatch) {}
    fn add_tdr(&mut self, _value: &TextureDrawRequestHandle) {}

    fn get_tdr(&self) -> Vec<TextureDrawRequestHandle> {
        Vec::<TextureDrawRequestHandle>::new()
    }

    fn add_data(&mut self, _batch: &DataBatch, _values: &[&Input]) {}
    fn set_uniform(&mut self, _group: Option<DataGroup>, _value: UniformValue) {}

    fn is_main(&self) -> bool { false }
    fn add_index(&mut self, _batch: &DataBatch, _indexes: &[u16], _points: u16) {}

    fn to_gl(&mut self, _batch: &DataBatch, _adata: &ArenaData) {}
    fn execute(&self, _adata : &ArenaData, _batch: &DataBatch,
               _dims: &ArenaDims) {}
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
    fn to_gl(&mut self, _batch: &DataBatch, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn execute(&self, adata : &ArenaData, _batch: &DataBatch,
               _dims: &ArenaDims) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
        }
    }
}

#[derive(Clone,Copy,Debug)]
pub enum UniformValue {
    Float(f32),
    Vec2F(f32,f32),
    Vec3F(f32,f32,f32),
    Int(i32)
}

pub struct ObjectUniform {
    val: HashMap<Option<u32>,UniformValue>,
    buf: Option<gluni>,
}

impl ObjectUniform {
    pub fn new(adata: &ArenaData, prog: &glprog, name: &str) -> ObjectUniform {
        ObjectUniform {
            buf: adata.ctx.get_uniform_location(prog,name),
            val: HashMap::<Option<u32>,UniformValue>::new()
        }
    }
}

impl Object for ObjectUniform {
    fn set_uniform(&mut self, group: Option<DataGroup>, value: UniformValue) {
        self.val.insert(group.map(|g| g.id()),value);
    }

    fn execute(&self, adata : &ArenaData, batch: &DataBatch, _dims: &ArenaDims) {
        let gid = batch.group().id();
        
        if let Some(ref loc) = self.buf {
            let val = 
                if let Some(val) = self.val.get(&Some(gid)) {
                    Some(*val)
                } else {
                    self.val.get(&None).map(|s| *s)
                };
            match val {
                Some(UniformValue::Vec3F(t,u,v)) =>
                    adata.ctx.uniform3f(Some(loc),t,u,v),
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
}

pub struct ObjectMain {
    method: u32,
    vec: HashMap<u32,Vec<u16>>,
    buf: HashMap<u32,glbuf>,
    num: HashMap<u32,u16>,
}

impl ObjectMain {
    pub fn new(method: u32) -> ObjectMain {
        ObjectMain {
            method,
            vec: HashMap::<u32,Vec<u16>>::new(),
            buf: HashMap::<u32,glbuf>::new(),
            num: HashMap::<u32,u16>::new()
        }
    }

    fn buffer(&self, b: &DataBatch) -> Option<&glbuf> {
        self.buf.get(&b.id())
    }

    fn data(&self, b: &DataBatch) -> Option<&Vec<u16>> {
        self.vec.get(&b.id())
    }

    fn data_mut(&mut self, b: &DataBatch) -> &mut Vec<u16> {
        self.vec.entry(b.id()).or_insert_with(|| Vec::<u16>::new())
    }
    
    fn nudge(&mut self, b: &DataBatch, points: u16) -> u16 {
        let bid = b.id();
        let v = *self.num.entry(bid).or_insert(0);
        self.num.insert(bid,v+points);
        v
    }
}

impl Object for ObjectMain {
    fn is_main(&self) -> bool { true }

    fn add_index(&mut self, batch: &DataBatch, indexes: &[u16], points: u16) {
        let offset = self.nudge(batch,points);
        let b = self.data_mut(batch);
        for v in indexes {
            b.push(v+offset);
        }
    }

    fn to_gl(&mut self, batch: &DataBatch, adata: &ArenaData) {
        self.buf.entry(batch.id()).or_insert_with(|| wglraw::init_buffer(&adata.ctx));
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                adata.ctx.bind_buffer(glctx::ELEMENT_ARRAY_BUFFER,Some(&buf));
                let data = TypedArray::<u16>::from(&(data[..])).buffer();
                adata.ctx.buffer_data_1(glctx::ELEMENT_ARRAY_BUFFER,Some(&data),glctx::STATIC_DRAW);
            }
        }
    }

    fn execute(&self, adata : &ArenaData, batch: &DataBatch, _dims: &ArenaDims) {
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                adata.ctx.bind_buffer(glctx::ELEMENT_ARRAY_BUFFER,Some(&buf));
                adata.ctx.draw_elements(self.method,data.len() as i32,
                                    glctx::UNSIGNED_SHORT,0);
            }
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
    fn to_gl(&mut self, batch: &DataBatch, adata: &ArenaData) {
        self.buf.entry(batch.id()).or_insert_with(|| wglraw::init_buffer(&adata.ctx));
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                adata.ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(&buf));
                let data = TypedArray::<f32>::from(&(data[..])).buffer();
                adata.ctx.buffer_data_1(glctx::ARRAY_BUFFER,Some(&data),glctx::STATIC_DRAW);
            }
        }
    }

    fn execute(&self, adata : &ArenaData, batch: &DataBatch, _dims: &ArenaDims) {
        let ctx = &adata.ctx;
        if let Some(buf) = self.buffer(batch) {
            ctx.enable_vertex_attrib_array(self.loc);
            ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(buf));
            ctx.vertex_attrib_pointer(self.loc, self.size as i32,
                                      glctx::FLOAT, false, 0, 0);
        }
    }

    fn add_data(&mut self, batch: &DataBatch, values: &[&Input]) {
        for v in values {
            v.to_f32(self,batch);
        }
    }

    fn add_f32(&mut self,values : &[f32], batch: &DataBatch) {
        self.data_mut(batch).extend_from_slice(values);
    }
}
