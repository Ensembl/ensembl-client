use std::collections::HashMap;
use std::rc::Rc;

use stdweb::web::TypedArray;
use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
};

use wglraw;
use drawing::DrawingSession;
use program::data::{ DataBatch, Input };

use program::objects::Object;

pub struct ObjectAttrib {
    vec : HashMap<u32,Vec<f32>>,
    buf: HashMap<u32,glbuf>,
    loc: Option<u32>,
    size: u8,
    prog: Rc<glprog>,
    name: String
}

impl ObjectAttrib {
    pub fn new(prog: &Rc<glprog>, name: &str, size: u8) -> ObjectAttrib {
        ObjectAttrib {
            vec: HashMap::<u32,Vec<f32>>::new(),
            buf: HashMap::<u32,glbuf>::new(),
            loc: None,
            prog: prog.clone(),
            name: name.to_string(),
            size,
        }
    }
    
    fn location(&mut self, ctx: &glctx) -> u32 {
        if self.loc == None {
            self.loc = Some(ctx.get_attrib_location(&self.prog,&self.name) as u32)
        }
        self.loc.unwrap()
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
    fn obj_final(&mut self, batch: &DataBatch, ctx: &glctx, _acm: &DrawingSession) {
        self.buf.entry(batch.id()).or_insert_with(|| wglraw::init_buffer(ctx));
        if let Some(data) = self.data(batch) {
            if let Some(buf) = self.buffer(batch) {
                ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(&buf));
                let data = TypedArray::<f32>::from(&(data[..])).buffer();
                //console!("len {:?} {:?}",self.name,data.len());
                ctx.buffer_data_1(glctx::ARRAY_BUFFER,Some(&data),glctx::STATIC_DRAW);
            }
        }
    }

    fn execute(&mut self, ctx: &glctx, batch: &DataBatch) {
        let loc = self.location(ctx);
        if let Some(buf) = self.buffer(batch) {
            ctx.enable_vertex_attrib_array(loc);
            ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(buf));
            ctx.vertex_attrib_pointer(loc, self.size as i32,
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
