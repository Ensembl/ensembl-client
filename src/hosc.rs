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

const HOSC_V_SRC : &str = "
attribute vec2 aVertexPositionHosc;
attribute vec3 aVertexColourHosc;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying lowp vec3 vColour;

void main() {
     gl_Position = vec4(
          (aVertexPositionHosc.x - uStageHpos) * uStageZoom,
          (aVertexPositionHosc.y - uStageVpos),
          0.0, 1.0
    );
    vColour = aVertexColourHosc;
}
";

const HOSC_F_SRC : &str = "
varying lowp vec3 vColour;

void main() {
      gl_FragColor = vec4(vColour, 1.0);
}
";

pub struct HoscGeometry {
	adata: Rc<RefCell<ArenaData>>,
    points : Vec<f32>,
    colours: Vec<f32>,
    buffer: glbuf,
    colour_buffer: glbuf,
    indices: i32,
    prog: glprog,
}

impl HoscGeometry {
	pub fn new(adata: Rc<RefCell<ArenaData>>) -> HoscGeometry {
        let adata2 = adata.clone();
		let ctx = &adata2.borrow().ctx;
		HoscGeometry {
            indices: 0,
			adata,
            points: Vec::<f32>::new(),
            colours: Vec::<f32>::new(),
            prog: wglraw::prepare_shaders(&ctx,&HOSC_V_SRC,&HOSC_F_SRC),
            buffer: wglraw::init_buffer(&ctx),
            colour_buffer: wglraw::init_buffer(&ctx)
		}
	}

    pub fn triangle(&mut self,points:[f32;6],colour:[f32;3]) {
        self.points.extend_from_slice(&points);
        self.colours.extend_from_slice(&colour);
        self.colours.extend_from_slice(&colour);
        self.colours.extend_from_slice(&colour);
        self.indices = self.indices + 3
    }
}
impl Geometry for HoscGeometry {
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

    fn link(&self) {
		let ctx = &self.adata().ctx;
        ctx.use_program(Some(&self.prog));
        wglraw::link_buffer(&ctx,&self.prog,"aVertexPositionHosc",2,&self.buffer);
        wglraw::link_buffer(&ctx,&self.prog,"aVertexColourHosc",3,&self.colour_buffer);
    }

    fn draw(&self) {
		let ctx = &self.adata().ctx;
        js! { console.log("draw"); }
        ctx.use_program(Some(&self.prog));
        ctx.draw_arrays(glctx::TRIANGLES,0,self.indices);
    }
		
}

