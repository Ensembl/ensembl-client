/* Geometries are arena stores for all shape data with a particular
 * approach to co-ordinate mapping (ie geometry). For example, fixed to
 * viewport, scaling, etc.
 * 
 * The arena stores a number of instances of each of these geometries,
 * provides a means of accessing them, and uses them to draw the
 * display.
 * 
 * trait Geometry -- all Arena cares about in a Geometry for
 * the purposes of rendering. No use to API users.
 * 
 * struct StdGeometry -- the base implementation of geometries. Most
 * only contain this data member. No use to API users.
 * 
 * struct GeomBuf -- internal.
 * 
 * All API access is by getting a handle on the specific geometry
 * instance from a method in the arena. Each geometry has various
 * drawing primitives: none are those functions described here.
*/

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog,
};

use arena::{
    Stage,
    ArenaData
};

use wglraw;
use std::cell::RefCell;
use std::rc::Rc;

pub trait Geometry {
    fn populate(&mut self);
    fn draw(&self,stage:&Stage);
}

pub struct StdGeometry {
    adata: Rc<RefCell<ArenaData>>,
    indices: i32,
    prog: glprog,
    buffers : Vec<GeomBuf>,
    num_idx : i8,
}

impl StdGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>,
           v_src : &str,f_src : &str,
           specs : &[(&str,i8,i8)],num_idx : i8) -> StdGeometry {
        let adata2 = adata.clone();
        let prog;
        {
            let ctx = &adata.borrow().ctx;
            prog = wglraw::prepare_shaders(&ctx,v_src,f_src);
        }
        let mut geom = StdGeometry {
            adata, prog,
            buffers :  Vec::<GeomBuf>::new(),
            indices : 0,
            num_idx
        };
        for spec in specs {
            let ctx = &adata2.borrow().ctx;
            geom.buffers.push(GeomBuf::new(ctx,spec.0,spec.1,spec.2));
        }
        geom
    }
    
    pub fn populate(&mut self) {
        let ctx = &self.adata.borrow().ctx;
        for g in &mut self.buffers {
            g.populate(&ctx);
        }
    }
    
    pub fn add(&mut self, i : usize, data : &[f32]) {
        self.buffers[i].add(data);
    }
    
    pub fn advance(&mut self) {
        self.indices = self.indices + (self.num_idx as i32);
    }
    
    pub fn select(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.use_program(Some(&self.prog));
    }

    pub fn draw_triangles(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }
    
    pub fn draw(&self,stage:&Stage) {
        // set uniforms
        let data = &self.adata.borrow();
        let ctx = &data.ctx;
        let aspect = data.aspect;
        ctx.use_program(Some(&self.prog));
        wglraw::set_uniform_1(&ctx,&self.prog,"uStageHpos",stage.hpos);
        wglraw::set_uniform_1(&ctx,&self.prog,"uStageVpos",stage.vpos);
        wglraw::set_uniform_1(&ctx,&self.prog,"uStageZoom",stage.zoom);
        wglraw::set_uniform_2(&ctx,&self.prog,"uCursor",stage.cursor);
        wglraw::set_uniform_1(&ctx,&self.prog,"uAspect",aspect);
        // draw
        {
            let ctx = &self.adata.borrow().ctx;
            self.select();
            for g in &self.buffers {
                g.link(&ctx,&self.prog);
            }
        }
        self.draw_triangles();

    }
}

struct GeomBuf {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: i8,
    rep: i8
}

impl GeomBuf {
    fn new(ctx: &glctx,name: &str, size: i8, rep: i8) -> GeomBuf {
        GeomBuf {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&ctx),
            name: String::from(name),
            size, rep
        }
    }
    
    fn add(&mut self,values : &[f32]) {
        for _i in 0..self.rep {
            self.vec.extend_from_slice(values);
        }
    }

    fn populate(&mut self, ctx: &glctx) {
        wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        self.vec.clear();
    }

    fn link(&self, ctx : &glctx, prog : &glprog) {
        wglraw::link_buffer(ctx,prog,&self.name,self.size,&self.buf);
    }
}
