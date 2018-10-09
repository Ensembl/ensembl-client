use std::collections::HashMap;

use stdweb::web::TypedArray;

use stdweb::web::html_element::CanvasElement;
use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
    WebGLUniformLocation as gluni,
    WebGLProgram as glprog,
    GLint, GLenum,
};

use wglraw;
use drawing::AllCanvasMan;
use program::data::{ DataBatch, Input };

use program::objects::Object;

pub struct ObjectAttrib {
    vec : HashMap<u32,Vec<f32>>,
    buf: HashMap<u32,glbuf>,
    loc: u32,
    size: u8,
}

impl ObjectAttrib {
    pub fn new(ctx: &glctx, prog: &glprog, name: &str, size: u8) -> ObjectAttrib {
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
    fn obj_final(&mut self, batch: &DataBatch, ctx: &glctx, _acm: &AllCanvasMan) {
        self.buf.entry(batch.id()).or_insert_with(|| wglraw::init_buffer(ctx));
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(&buf));
                let data = TypedArray::<f32>::from(&(data[..])).buffer();
                ctx.buffer_data_1(glctx::ARRAY_BUFFER,Some(&data),glctx::STATIC_DRAW);
            }
        }
    }

    fn execute(&self, ctx: &glctx, batch: &DataBatch) {
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
    
    fn clear(&mut self) {
        self.vec.clear();
    }
}
