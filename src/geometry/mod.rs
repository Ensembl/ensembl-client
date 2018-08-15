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
    WebGLTexture as gltex,
    WebGLUniformLocation as gluni,
};

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
    GLSource
};

use geometry::coord::{
    GLData,
    GCoord,
    PCoord,
    Colour,
};

/* Geometries must implement Geometry for the arena to use them */
pub trait Geometry {
    fn populate(&mut self, &mut ArenaData);

    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage);
}

pub struct GLProgram {
    indices: i32,
    prog: Box<glprog>,
    uniforms: HashMap<String,gluni>,
    attribs: Vec<Box<GType>>,
    attrib_names: HashMap<String,usize>,
}

fn find_uniforms(ctx: &glctx, prog: &Box<glprog>, vars: &Vec<Rc<Variable>>) -> HashMap<String,gluni> {
    let mut udata = HashMap::<String,gluni>::new();
    for v in vars {
        v.preget(ctx,prog,&mut udata);
    }
    udata
}

fn find_attribs(adata: &ArenaData, vars: &Vec<Rc<Variable>>) 
                        -> (Vec<Box<GType>>,HashMap<String,usize>) {
    let mut attribs = Vec::<Box<GType>>::new();
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

impl GLProgram {
    pub fn new(adata: &ArenaData, src: &GLSource) -> GLProgram {
        let ctx = &adata.ctx;
        let prog = Box::new(src.prog(ctx));
        ctx.use_program(Some(&prog));
        let udata = find_uniforms(ctx,&prog,&src.uniforms);
        let (attribs,attrib_names) = find_attribs(adata,&src.uniforms);
        GLProgram {
            prog,
            uniforms: udata,
            attribs, attrib_names,
            indices: 0,
        }
    }
        
    pub fn advance(&mut self,amt: i32) { self.indices += amt; }
    
    pub fn uniform(&self, name: &str) -> Option<&gluni> {
        self.uniforms.get(name)
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

    pub fn set_attribute(&self, ctx: &glctx, name: &str, buf: &glbuf, step: u8) {
        let prog = &self.prog;
        let loc = ctx.get_attrib_location(prog,name) as u32;
        ctx.enable_vertex_attrib_array(loc);
        ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(buf));
        ctx.vertex_attrib_pointer(loc, step as i32, glctx::FLOAT, false, 0, 0);
    }

    pub fn add_attrib_data(&mut self, name: &str, values: &[&GLData]) {
        let loc = self.attrib_names[name];
        self.attribs[loc].add_data(values);
    }

    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage) {
        // link
        {
            self.link(adata,stage,&adata.dims);
        }
        // draw
        {
            let indices = self.indices;
            let ctx = &adata.ctx;
            ctx.draw_arrays(glctx::TRIANGLES,0,indices);
        }
    }
    
    pub fn link(&mut self, adata : &ArenaData,  stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        let prog = &self.prog;
        ctx.use_program(Some(&prog));
        for a in &self.attribs {
            a.link(adata,self,stage,dims);
        }
    }
    
    pub fn populate(&mut self, adata: &ArenaData) {
        for a in &mut self.attribs {
            a.populate(adata);
        }
    }
}
