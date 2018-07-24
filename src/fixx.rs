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

const V_SRC : &str = "
attribute vec3 aVertexPositionFixx;
attribute vec3 aVertexColourFixx;

uniform vec2 uCursor;
uniform float uAspect;

varying lowp vec3 vColour;

void main() {
    gl_Position = vec4(
        aVertexPositionFixx.x - uCursor.x,
        ( aVertexPositionFixx.y ) - uCursor.y,
        0.0, 1.0
    );
    vColour = aVertexColourFixx;
}
";

const F_SRC : &str = "
varying lowp vec3 vColour;

void main() {
      gl_FragColor = vec4(vColour, 1.0);
}
";

pub struct FixxGeometry {
    adata: Rc<RefCell<ArenaData>>,
    points : Vec<f32>,
    colours: Vec<f32>,
    buffer: glbuf,
    colour_buffer: glbuf,
    indices: i32,
    prog: glprog,
}

impl FixxGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> FixxGeometry {
        let adata2 = adata.clone();
        let ctx = &adata2.borrow().ctx;
        FixxGeometry {
            indices: 0,
            adata,
            points: Vec::<f32>::new(),
            colours: Vec::<f32>::new(),
            prog: wglraw::prepare_shaders(&ctx,&V_SRC,&F_SRC),
            buffer: wglraw::init_buffer(&ctx),
            colour_buffer: wglraw::init_buffer(&ctx)
        }
    }

    pub fn triangle(&mut self,points:[f32;9],colour:[f32;3]) {
        self.points.extend_from_slice(&points);
        for i in 0..3 {
            self.colours.extend_from_slice(&colour);
        }
        self.indices = self.indices + 3
    }
}
impl Geometry for FixxGeometry {
    fn adata(&self) -> Ref<ArenaData> { self.adata.borrow() }
    fn program<'a>(&'a self) -> &'a glprog { &self.prog }

    fn populate(&mut self) {
        {
            let ctx = &self.adata().ctx;
            ctx.use_program(Some(&self.prog));
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,&self.buffer,&self.points);
            wglraw::populate_buffer(&ctx,glctx::ARRAY_BUFFER,&self.colour_buffer,&self.colours);
        }
        self.points.clear();
        self.colours.clear();
    }

    fn draw(&self) {
        let ctx = &self.adata().ctx;
        ctx.use_program(Some(&self.prog));
        wglraw::link_buffer(&ctx,&self.prog,"aVertexPositionFixx",3,&self.buffer);
        wglraw::link_buffer(&ctx,&self.prog,"aVertexColourFixx",3,&self.colour_buffer);
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }        
}
