use webgl_rendering_context::{
    WebGLProgram as glprog,
};

use arena::{
    Geometry,
    ArenaData,
    StdGeometry,
    GeomBuf,
    Stage,
};

use std::cell::Ref;
use std::cell::RefCell;
use std::rc::Rc;

const V_SRC : &str = "
attribute vec3 aVertexPosition;
attribute vec3 aVertexColour;

uniform vec2 uCursor;
uniform float uAspect;

varying lowp vec3 vColour;

void main() {
    gl_Position = vec4(
        aVertexPosition.x - uCursor.x,
        ( aVertexPosition.y + aVertexPosition.z * uAspect ) - uCursor.y,
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

pub struct FixxGeometry {
    std : StdGeometry,
    points : GeomBuf,
    colours : GeomBuf,
}

impl FixxGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> FixxGeometry {
        let ctx = &adata.borrow().ctx;
        let std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC);
        FixxGeometry {
            std,
            points: GeomBuf::new(&ctx,"aVertexPosition",3),
            colours: GeomBuf::new(&ctx,"aVertexColour",3),
        }
    }

    pub fn triangle(&mut self,points:[f32;9],colour:[f32;3]) {
        self.points.add(&points,1);
        self.colours.add(&colour,3);
        self.std.indices = self.std.indices + 3
    }
}
impl Geometry for FixxGeometry {
    fn adata(&self) -> Ref<ArenaData> { self.std.adata.borrow() }
    fn program<'a>(&'a self) -> &'a glprog { &self.std.prog }
    
    fn populate(&mut self) {
        self.std.select();
        self.points.populate(&self.std);
        self.colours.populate(&self.std);
    }

    fn draw(&self) {
        self.std.select();
        self.points.link(&self.std);
        self.colours.link(&self.std);
        self.std.draw_triangles();
    }    
    
    fn perspective(&self,stage:&Stage) {
        self.std.perspective(stage);
    }
    
}
