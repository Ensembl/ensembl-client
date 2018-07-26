use geometry::{
    Geometry,
    StdGeometry,
    GeomBufSpec,
};

use arena::{
    ArenaData,
    Stage
};

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
}

impl FixxGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> FixxGeometry {
        let mut std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC,3);
        std.add_spec(&GeomBufSpec { name: "aVertexPosition", size: 3, rep: 1 });
        std.add_spec(&GeomBufSpec { name: "aVertexColour",   size: 3, rep: 3 });
        FixxGeometry { std }
    }

    pub fn triangle(&mut self,points:&[f32;9],colour:&[f32;3]) {
        self.std.add(0,points);
        self.std.add(1,colour);
        self.std.advance();
    }
    
    pub fn rectangle(&mut self,p:&[f32;6],colour:&[f32;3]) {
        self.triangle(&[p[0],p[1],p[2],
                        p[3],p[1],p[2],
                        p[0],p[4],p[5]],&colour);
        self.triangle(&[p[3],p[4],p[5],
                        p[0],p[4],p[5],
                        p[3],p[1],p[2]],&colour);
    }
}
impl Geometry for FixxGeometry {  
    fn populate(&mut self) { self.std.populate(); }
    fn draw(&self,stage:&Stage) { self.std.draw(stage); }  
}
