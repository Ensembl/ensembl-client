use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,
    GTypeHolder,
    GType,
};
use geometry;

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
    std : GeomContext,
    pos: GTypeAttrib,
    colour: GTypeAttrib,
}

impl GTypeHolder for FixxGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.colour })
    }
}

impl FixxGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> FixxGeometry {
        FixxGeometry {
            std: GeomContext::new(adata.clone(),&V_SRC,&F_SRC),
            pos: GTypeAttrib::new(&adata.borrow(),"aVertexPosition",3,1),
            colour: GTypeAttrib::new(&adata.borrow(),"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,points:&[f32;9],colour:&[f32;3]) {
        self.pos.add(points);
        self.colour.add(colour);
        self.std.advance(3);
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
    fn populate(&mut self) { geometry::populate(self); }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
