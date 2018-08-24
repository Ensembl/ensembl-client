use std::collections::HashMap;
use std::rc::Rc;

use wglraw;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

use arena::{ Stage, ArenaData, ArenaDims };
use coord::Input;

use shape::SolidShapeManager;
use texture::TexShapeManager;

use program::source::{ Source, ProgramSource };
use program::objects::Object;

const BATCH_LIMIT : u32 = 65535;

pub struct DataBatch {
    idx_buf: glbuf,
    idx_vec: Vec<u16>,
    num_points: u16,
    id_val: u32
}

impl DataBatch {
    fn new(adata: &ArenaData, id: u32) -> DataBatch {
        DataBatch {
            num_points: 0,
            idx_buf: wglraw::init_buffer(&adata.ctx),
            idx_vec: Vec::<u16>::new(),
            id_val: id
        }
    }

    pub fn add_vertices(&mut self, indexes: &[u16], points: u16) {
        for v in indexes {
            self.idx_vec.push(self.num_points+*v);
        }
        self.num_points += points;
    }
    
    pub fn id(&self) -> u32 { self.id_val }
}

pub struct ProgramAttribs {
    batches: Vec<DataBatch>,
    batch_num: u32,
    objects: Vec<Box<Object>>,
    object_names: HashMap<String,usize>,
}

pub struct ProgramCode {
    uniforms: HashMap<String,gluni>,
    prog: Box<glprog>,
}

pub struct Program {
    data: ProgramAttribs,
    pub solid_shapes: SolidShapeManager,
    pub tex_shapes: TexShapeManager,
    code: ProgramCode,
}

fn find_uniforms(ctx: &glctx, prog: &Box<glprog>, vars: &Vec<Rc<Source>>) -> HashMap<String,gluni> {
    let mut udata = HashMap::<String,gluni>::new();
    for v in vars {
        v.preget(ctx,prog,&mut udata);
    }
    udata
}

fn find_attribs(adata: &ArenaData, vars: &Vec<Rc<Source>>) 
                        -> (Vec<Box<Object>>,HashMap<String,usize>) {
    let mut attribs = Vec::<Box<Object>>::new();
    let mut attrib_names = HashMap::<String,usize>::new();
    for v in vars {
        if let Some((name,value)) = v.make_attribs(adata) {
            let loc = attribs.len();
            attribs.push(value);
            if let Some(name) = name {
                attrib_names.insert(name.to_string(),loc);
            }
        }
    }
    (attribs,attrib_names)
}

impl ProgramCode {
    pub fn set_attribute(&self, ctx: &glctx, name: &str, buf: &glbuf, step: u8) {
        let prog = &self.prog;
        let loc = ctx.get_attrib_location(prog,name) as u32;
        ctx.enable_vertex_attrib_array(loc);
        ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(buf));
        ctx.vertex_attrib_pointer(loc, step as i32, glctx::FLOAT, false, 0, 0);
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

impl ProgramAttribs {
    pub fn add_attrib_data(&mut self, name: &str, values: &[&Input]) {
        let loc = self.object_names[name];
        let (objs, batches) = (&mut self.objects, &mut self.batches);
        objs[loc].add_data(batches.last_mut().unwrap(),values);
    }
    
    pub fn add_vertices(&mut self, adata: &ArenaData, indexes: &[u16], points: u16) {
        self.batch_num += points as u32;
        if self.batch_num > BATCH_LIMIT {
            let idx = self.batches.len() as u32;
            self.batches.push(DataBatch::new(adata,idx));
            self.batch_num = points as u32;
        }
        self.batches.last_mut().unwrap().add_vertices(indexes,points);
    }
}

impl Program {
    pub fn new(adata: &ArenaData, src: &ProgramSource) -> Program {
        let prog = Box::new(src.prog(adata));
        adata.ctx.use_program(Some(&prog));
        let uniforms = find_uniforms(&adata.ctx,&prog,&src.uniforms);
        let (objects,object_names) = find_attribs(adata,&src.uniforms);
        Program {
            tex_shapes: TexShapeManager::new(),
            solid_shapes: SolidShapeManager::new(),
            data: ProgramAttribs {
                objects, object_names,
                batch_num: 0,
                batches: vec! { DataBatch::new(adata,0) }
            },
            code: ProgramCode {
                prog, uniforms,
            }
        }
    }

    fn draw_triangles(&self, adata: &ArenaData,b: &DataBatch) {
        if b.idx_vec.len() > 0 {
            wglraw::populate_buffer_short(&adata.ctx,glctx::ELEMENT_ARRAY_BUFFER,
                                    &b.idx_buf,&b.idx_vec);
            adata.ctx.bind_buffer(glctx::ELEMENT_ARRAY_BUFFER,Some(&b.idx_buf));
            adata.ctx.draw_elements(glctx::TRIANGLES,b.idx_vec.len() as i32,
                                    glctx::UNSIGNED_SHORT,0);
        }
    }
  
    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage) {
        for b in self.data.batches.iter() {
            self.execute(adata,b,stage,&adata.dims);
            self.draw_triangles(adata,b);
        }
    }
    
    fn execute(&self, adata : &ArenaData, batch: &DataBatch,  stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        let prog = &self.code.prog;
        ctx.use_program(Some(&prog));
        for a in &self.data.objects {
            a.execute(adata,&self.code,batch,stage,dims);
        }
    }
    
    pub fn shapes_to_gl(&mut self, adata: &mut ArenaData) {
        self.tex_shapes.into_objects(&mut self.data,adata);
        self.tex_shapes.clear();
        self.solid_shapes.into_objects(&mut self.data,adata);
        self.solid_shapes.clear();
        for b in self.data.batches.iter_mut() {
            for a in &mut self.data.objects {
                a.to_gl(b,adata);
            }
        }
    }
}
