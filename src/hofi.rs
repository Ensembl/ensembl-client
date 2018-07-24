use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLBuffer as glbuf,
};

use wglraw;
use arena::{
    Geometry,
    ArenaData,
};

use std::cell::Ref;
use std::cell::RefCell;
use std::rc::Rc;

const HOFI_V_SRC : &str = "
attribute vec2 aVertexPositionHofi;
attribute vec2 aOrigin;
attribute vec3 aVertexColourHofi;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying lowp vec3 vColour;

void main() {
    gl_Position = vec4(
        (aOrigin.x - uStageHpos) * uStageZoom + aVertexPositionHofi.x,
        (aOrigin.y - uStageVpos) + aVertexPositionHofi.y * uAspect,
        0.0, 1.0
    );
    vColour = aVertexColourHofi;
}
";

const HOFI_F_SRC : &str = "
varying lowp vec3 vColour;

void main() {
      gl_FragColor = vec4(vColour, 1.0);
}
";

pub struct StdGeometry {
    adata: Rc<RefCell<ArenaData>>,
    indices: i32,
    prog: glprog,
}

impl StdGeometry {
    fn new(adata: Rc<RefCell<ArenaData>>,
           v_src : &str,f_src : &str) -> StdGeometry {
        let prog;
        {
            let ctx = &adata.borrow().ctx;
            prog = wglraw::prepare_shaders(&ctx,v_src,f_src);
        }
        StdGeometry { adata, indices: 0, prog }
    }
    
    fn select(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.use_program(Some(&self.prog));
    }

    fn draw_triangles(&self) {
        let ctx = &self.adata.borrow().ctx;
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }
}

pub struct GeomBuf {
    vec : Vec<f32>,
    buf: glbuf,
    name: String,
    size: i32
}

impl GeomBuf {
    fn new(ctx: &glctx,name: &str, size: i32) -> GeomBuf {
        GeomBuf {
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&ctx),
            name: String::from(name),
            size
        }
    }
    
    fn add(&mut self,values : &[f32],mult : i32) {
        for _i in 0..mult {
            self.vec.extend_from_slice(values);
        }
    }

    fn populate(&mut self, std : &StdGeometry) {
        {
            let ctx = &std.adata.borrow().ctx;
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,
                                    &self.buf,&self.vec);
        }
        self.vec.clear();
    }

    fn link(&self, std: &StdGeometry) {
        wglraw::link_buffer(&std.adata.borrow().ctx,&std.prog,&self.name,self.size,&self.buf);
    }
}

pub struct HofiGeometry {
    std: StdGeometry,
    points: GeomBuf,
    origins: GeomBuf,
    colours: GeomBuf,
}

impl HofiGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HofiGeometry {
        let ctx = &adata.borrow().ctx;
        let std = StdGeometry::new(adata.clone(),&HOFI_V_SRC,HOFI_F_SRC);
        HofiGeometry {
            std,
            points: GeomBuf::new(&ctx,"aVertexPositionHofi",2),
            origins: GeomBuf::new(&ctx,"aOrigin",2),
            colours: GeomBuf::new(&ctx,"aVertexColourHofi",3),
        }
    }

    pub fn triangle(&mut self,origin:[f32;2],points:[f32;6],colour:[f32;3]) {
        self.points.add(&points,1);
        self.colours.add(&colour,3);
        self.origins.add(&origin,3);
        self.std.indices = self.std.indices + 3
    }
}

impl Geometry for HofiGeometry {
    fn adata(&self) -> Ref<ArenaData> { self.std.adata.borrow() }
    fn program<'a>(&'a self) -> &'a glprog { &self.std.prog }

    fn populate(&mut self) {
        self.std.select();
        self.points.populate(&self.std);
        self.origins.populate(&self.std);
        self.colours.populate(&self.std);
    }

    fn draw(&self) {
        self.std.select();
        self.points.link(&self.std);
        self.origins.link(&self.std);
        self.colours.link(&self.std);
        self.std.draw_triangles();
    }        
}
