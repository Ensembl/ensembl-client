use std::collections::HashMap;
use std::rc::Rc;

use stdweb::web::TypedArray;
use dom::webgl::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
};

use super::super::data::{ DataBatch, Input };
use drivers::webgl::GLProgData;

use super::objects::Object;

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
}

impl Object for ObjectAttrib {
    fn obj_final(&mut self, batch: &DataBatch, ctx: &glctx, _acm: &mut GLProgData) {
        if self.data(batch).unwrap_or(&vec!{}).len() > 0 {
            if self.buf.get(&batch.id()).is_none() {
                if let Some(buf) = ctx.create_buffer() {
                    self.buf.insert(batch.id(),buf);
                }
            }
        }
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

    fn add_data_f32(&mut self, batch: &DataBatch, values: &[f32]) {
        self.get_f32_slice(batch).unwrap().extend(values);        
    }

    fn add_data(&mut self, batch: &DataBatch, values: &[&dyn Input]) {
        let dest: &mut Vec<f32> = self.get_f32_slice(batch).unwrap();
        for v in values {
            v.to_f32(dest);
        }
    }

    fn get_f32_slice(&mut self, b: &DataBatch) -> Option<&mut Vec<f32>> {
        Some(self.vec.entry(b.id()).or_insert_with(|| Vec::<f32>::new()))
    }
    
    fn clear(&mut self, ctx: &glctx) {
        let loc = self.location(ctx);
        ctx.disable_vertex_attrib_array(loc);
        for b in self.buf.values() {
            ctx.delete_buffer(Some(&b));
        }
        self.buf.clear();
        self.vec.clear();
    }
    
    fn size(&self) -> usize {
        let mut size = 0;
        for v in self.vec.values() {
            size += v.len();
        }
        size
    }
}
