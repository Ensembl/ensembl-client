use geometry::{
    Geometry,
    StdGeometry,
    GTypeAttrib,
};

use arena::{
    ArenaData,
    Stage
};

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
}

impl HofiGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HofiGeometry {
        let mut std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC,3);
        std.add_spec(&GTypeAttrib { name: "aVertexPosition", size: 2, rep: 1 });
        std.add_spec(&GTypeAttrib { name: "aOrigin",         size: 2, rep: 3 });
        std.add_spec(&GTypeAttrib { name: "aVertexColour",   size: 3, rep: 3 });
        HofiGeometry { std }
    }

    pub fn triangle(&mut self,origin:[f32;2],points:[f32;6],colour:[f32;3]) {
        self.std.add(0,&points);
        self.std.add(1,&origin);
        self.std.add(2,&colour);
        self.std.advance();
    }
}

impl Geometry for HofiGeometry {
    fn populate(&mut self) { self.std.populate(); }
    fn draw(&self,stage:&Stage) { self.std.draw(stage); }
}
