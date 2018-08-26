use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use wglraw;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

pub struct DataBatch {
    idx_buf: glbuf,
    idx_vec: Vec<u16>,
    num_points: u16,
    id_val: u32,
    uniforms: Rc<HashMap<String,gluni>>,
    prog: Rc<glprog>,
}

impl DataBatch {
    pub fn new(adata: &ArenaData, id: u32, prog: Rc<glprog>,
           uniforms: Rc<HashMap<String,gluni>>) -> DataBatch {
        DataBatch {
            uniforms, prog,
            num_points: 0,
            idx_buf: wglraw::init_buffer(&adata.ctx),
            idx_vec: Vec::<u16>::new(),
            id_val: id
        }
    }

    pub fn use_program(&self, adata : &ArenaData) {
        adata.ctx.use_program(Some(&self.prog));
    }

    pub fn draw_triangles(&self, adata: &ArenaData) {
        if self.idx_vec.len() > 0 {
            wglraw::populate_buffer_short(&adata.ctx,glctx::ELEMENT_ARRAY_BUFFER,
                                    &self.idx_buf,&self.idx_vec);
            adata.ctx.bind_buffer(glctx::ELEMENT_ARRAY_BUFFER,Some(&self.idx_buf));
            adata.ctx.draw_elements(glctx::TRIANGLES,self.idx_vec.len() as i32,
                                    glctx::UNSIGNED_SHORT,0);
        }
    }

    pub fn add_vertices(&mut self, indexes: &[u16], points: u16) {
        for v in indexes {
            self.idx_vec.push(self.num_points+*v);
        }
        self.num_points += points;
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

    pub fn id(&self) -> u32 { self.id_val }
}

