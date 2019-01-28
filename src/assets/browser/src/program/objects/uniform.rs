use std::collections::HashMap;
use std::rc::Rc;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLUniformLocation as gluni,
    WebGLProgram as glprog,
};

use program::data::{ DataBatch, DataGroup };
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
    buffer: Option<Option<gluni>>,
    prog: Rc<glprog>,
    name: String
}

impl ObjectUniform {
    pub fn new(prog: &Rc<glprog>, name: &str) -> ObjectUniform {
        ObjectUniform {
            buffer: None,
            val: HashMap::<Option<u32>,UniformValue>::new(),
            prog: prog.clone(),
            name: name.to_string()
        }
    }
    
    fn calc_buffer(&mut self, ctx: &glctx)  {
        if let None = self.buffer {
            self.buffer = Some(ctx.get_uniform_location(&self.prog,&self.name));
        }
    }
}

impl Object for ObjectUniform {
    fn set_uniform(&mut self, group: Option<DataGroup>, value: UniformValue) {
        self.val.insert(group.map(|g| g.id()),value);
    }

    fn execute(&mut self, ctx: &glctx, batch: &DataBatch) {
        let gid = batch.group().id();
        self.calc_buffer(ctx);
        if let Some(ref loc) = self.buffer.as_ref().unwrap() {
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
