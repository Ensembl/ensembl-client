use arena::{
    Geometry,
    StdGeometry,
    ArenaData,
    GeomBuf,
    Stage
};

use webgl_rendering_context::{
    WebGLProgram as glprog,
};

use std::cell::Ref;
use std::cell::RefCell;
use std::rc::Rc;

const V_SRC : &str = "
attribute vec2 aVertexPosition;
attribute vec2 aOrigin;
attribute vec3 aVertexColour;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying lowp vec3 vColour;

void main() {
    gl_Position = vec4(
        (aOrigin.x - uStageHpos) * uStageZoom + aVertexPosition.x,
        (aOrigin.y - uStageVpos) + aVertexPosition.y * uAspect,
        0.0, 1.0
    );
    vColour = aVertexColour;
}
";

const F_SRC : &str = "
varying lowp vec3 vColour;

void main() {
      gl_FragColor = vec4(vColour, 1.0);
}
";

pub struct HofiGeometry {
    std: StdGeometry,
    points: GeomBuf,
    origins: GeomBuf,
    colours: GeomBuf,
}

impl HofiGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HofiGeometry {
        let ctx = &adata.borrow().ctx;
        let std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC);
        HofiGeometry {
            std,
            points: GeomBuf::new(&ctx,"aVertexPosition",2),
            origins: GeomBuf::new(&ctx,"aOrigin",2),
            colours: GeomBuf::new(&ctx,"aVertexColour",3),
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
    
    fn perspective(&self,stage:&Stage) {
        self.std.perspective(stage);
    }
}
