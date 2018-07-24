use arena::{
    Geometry,
    ArenaData,
    StdGeometry,
    Stage,
};

use std::cell::RefCell;
use std::rc::Rc;

const V_SRC : &str = "
attribute vec2 aVertexPosition;
attribute vec3 aVertexColour;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying lowp vec3 vColour;

void main() {
     gl_Position = vec4(
          (aVertexPosition.x - uStageHpos) * uStageZoom,
          (aVertexPosition.y - uStageVpos),
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

pub struct HoscGeometry {
    std : StdGeometry,
}

impl HoscGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HoscGeometry {
        let std = StdGeometry::new(
            adata.clone(),&V_SRC,&F_SRC,
            &[("aVertexPosition",2,1),("aVertexColour",3,3)],3
        );
        HoscGeometry {
            std,
        }
    }

    pub fn triangle(&mut self,points:[f32;6],colour:[f32;3]) {
        self.std.add(0,&points);
        self.std.add(1,&colour);
        self.std.advance();
    }
}

impl Geometry for HoscGeometry {
    fn populate(&mut self) {
        self.std.populate();
    }

    fn draw(&self) {
        self.std.draw();
    }
    
    fn perspective(&self,stage:&Stage) {
        self.std.perspective(stage);
    }
}
