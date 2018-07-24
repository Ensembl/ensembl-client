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

pub struct HofiGeometry {
    adata: Rc<RefCell<ArenaData>>,
    points : Vec<f32>,
    origins : Vec<f32>,
    colours: Vec<f32>,
    buffer: glbuf,
    origins_buffer: glbuf,
    colour_buffer: glbuf,
    indices: i32,
    prog: glprog,
}

impl HofiGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HofiGeometry {
        let adata2 = adata.clone();
        let ctx = &adata2.borrow().ctx;
        HofiGeometry {
            indices: 0,
            adata,
            points: Vec::<f32>::new(),
            origins: Vec::<f32>::new(),
            colours: Vec::<f32>::new(),
            prog: wglraw::prepare_shaders(&ctx,&HOFI_V_SRC,&HOFI_F_SRC),
            buffer: wglraw::init_buffer(&ctx),
            origins_buffer: wglraw::init_buffer(&ctx),
            colour_buffer: wglraw::init_buffer(&ctx)
        }
    }

    pub fn triangle(&mut self,origin:[f32;2],points:[f32;6],colour:[f32;3]) {
        self.points.extend_from_slice(&points);
        for i in 0..3 {
            self.colours.extend_from_slice(&colour);
            self.origins.extend_from_slice(&origin);
        }
        self.indices = self.indices + 3
    }
}
impl Geometry for HofiGeometry {
    fn adata(&self) -> Ref<ArenaData> { self.adata.borrow() }
    fn program<'a>(&'a self) -> &'a glprog { &self.prog }

    fn populate(&mut self) {
        {
            let ctx = &self.adata().ctx;
            ctx.use_program(Some(&self.prog));
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,&self.buffer,&self.points);
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,&self.origins_buffer,&self.origins);
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,&self.colour_buffer,&self.colours);
        }
        self.points.clear();
        self.origins.clear();
        self.colours.clear();
    }

    fn draw(&self) {
        let ctx = &self.adata().ctx;
        ctx.use_program(Some(&self.prog));
        wglraw::link_buffer(&ctx,&self.prog,"aVertexPositionHofi",2,&self.buffer);
        wglraw::link_buffer(&ctx,&self.prog,"aOrigin",2,&self.origins_buffer);
        wglraw::link_buffer(&ctx,&self.prog,"aVertexColourHofi",3,&self.colour_buffer);
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }        
}
