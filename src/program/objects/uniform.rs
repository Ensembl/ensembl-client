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
use drawing::Drawing;
use program::data::{ DataBatch, DataGroup, Input };
use program::objects::Object;

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
    pub fn new(ctx: &glctx, prog: &glprog, name: &str) -> ObjectUniform {
        ObjectUniform {
            buf: ctx.get_uniform_location(prog,name),
            val: HashMap::<Option<u32>,UniformValue>::new()
        }
    }
}

impl Object for ObjectUniform {
    fn set_uniform(&mut self, group: Option<DataGroup>, value: UniformValue) {
        self.val.insert(group.map(|g| g.id()),value);
    }

    fn execute(&self, ctx: &glctx, batch: &DataBatch) {
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
                    ctx.uniform3f(Some(loc),t,u,v),
                Some(UniformValue::Vec2F(u,v)) =>
                    ctx.uniform2f(Some(loc),u,v),
                Some(UniformValue::Float(v)) =>
                    ctx.uniform1f(Some(loc),v),
                Some(UniformValue::Int(v)) =>
                    ctx.uniform1i(Some(loc),v),
                None => ()
            }
        }
    }
    
    fn clear(&mut self) {
        self.val.clear();
    }
}
