pub mod stretch;
pub mod pin;
pub mod fix;
pub mod stretchtex;
pub mod pintex;
pub mod fixtex;
pub mod wglprog;
pub mod coord;
pub mod gtype;

use std::rc::Rc;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

use shape::Shape;

use arena::{
    Stage,
    ArenaData,
    ArenaDims,
};

use geometry::wglprog::{
    Variable,
};

use geometry::gtype::{
    GType,
};

use std::collections::HashMap;

use geometry::wglprog::{
    GLSource,
    Phase
};

use geometry::coord::{
    GLData,
};

use texture::{
    TextureTargetManager,
};

/* Geometries must implement Geometry for the arena to use them */
pub trait Geometry {
    fn get_std(&mut self) -> &mut GLProgram;
    
    fn populate(&mut self, adata: &mut ArenaData) { self.get_std().populate(adata); }
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.get_std().draw(adata,stage); }
}

pub struct ItemManager {
    requests: Vec<Box<Shape>>
}

impl ItemManager {
    pub fn new() -> ItemManager {
        ItemManager {
            requests: Vec::<Box<Shape>>::new()
        }
    }
    
    pub fn add_item(&mut self, item: Box<Shape>) {
        self.requests.push(item);
    }
    
    pub fn draw(&mut self, tg: &mut GLProgramData, adata: &mut ArenaData) {
        for obj in &mut self.requests {
            obj.process(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}


pub struct GLProgramData {
    indices: i32,
    attribs: Vec<(Phase,Box<GType>)>,
    attrib_names: HashMap<String,usize>,
}

pub struct GLProgramCode {
    uniforms: HashMap<String,gluni>,
    prog: Box<glprog>,
}

pub struct GLProgram {
    data: GLProgramData,
    pub shapes: ItemManager,
    pub gtexitman: TextureTargetManager,
    code: GLProgramCode,
}

fn find_uniforms(ctx: &glctx, prog: &Box<glprog>, vars: &Vec<Rc<Variable>>) -> HashMap<String,gluni> {
    let mut udata = HashMap::<String,gluni>::new();
    for v in vars {
        v.preget(ctx,prog,&mut udata);
    }
    udata
}

fn find_attribs(adata: &ArenaData, vars: &Vec<Rc<Variable>>) 
                        -> (Vec<(Phase,Box<GType>)>,HashMap<String,usize>) {
    let mut attribs = Vec::<(Phase,Box<GType>)>::new();
    let mut attrib_names = HashMap::<String,usize>::new();
    for v in vars {
        if let Some((name,phase,value)) = v.make_attribs(adata) {
            let loc = attribs.len();
            attribs.push((phase,value));
            if let Some(name) = name {
                attrib_names.insert(name.to_string(),loc);
            }
        }
    }
    (attribs,attrib_names)
}

impl GLProgramCode {
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

impl GLProgramData {
    pub fn advance(&mut self,amt: i32) { self.indices += amt; }    

    pub fn add_attrib_data(&mut self, name: &str, values: &[&GLData]) {
        let loc = self.attrib_names[name];
        self.attribs[loc].1.add_data(values);
    }
}

impl GLProgram {
    pub fn new(adata: &ArenaData, src: &GLSource) -> GLProgram {
        let ctx = &adata.ctx;
        let prog = Box::new(src.prog(ctx));
        ctx.use_program(Some(&prog));
        let uniforms = find_uniforms(ctx,&prog,&src.uniforms);
        let (attribs,attrib_names) = find_attribs(adata,&src.uniforms);
        GLProgram {
            gtexitman: TextureTargetManager::new(),
            shapes: ItemManager::new(),
            data: GLProgramData {
                attribs, attrib_names,
                indices: 0
            },
            code: GLProgramCode {
                prog, uniforms,
            }
        }
    }
  
    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage) {
        // link
        {
            self.link(adata,stage,&adata.dims);
        }
        // draw
        {
            let indices = self.data.indices;
            let ctx = &adata.ctx;
            ctx.draw_arrays(glctx::TRIANGLES,0,indices);
        }
    }
    
    pub fn link(&mut self, adata : &ArenaData,  stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        let prog = &self.code.prog;
        ctx.use_program(Some(&prog));
        for (_p,a) in &self.data.attribs {
            a.link(adata,&self.code,stage,dims);
        }
    }
    
    pub fn populate(&mut self, adata: &mut ArenaData) {
        for (p,a) in &mut self.data.attribs {
            if *p == Phase::PrePopulate {
                a.populate(adata);
            }
        }
        self.gtexitman.draw(&mut self.data,adata);
        self.gtexitman.clear();
        self.shapes.draw(&mut self.data,adata);
        self.shapes.clear();
        for (p,a) in &mut self.data.attribs {
            if *p == Phase::Vertex || *p == Phase::Fragment {
                a.populate(adata);
            }
        }
    }
}
