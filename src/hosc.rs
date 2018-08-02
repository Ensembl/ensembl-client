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
    std : GeomContext,
    pos: GTypeAttrib,
    colour: GTypeAttrib,
}

impl GTypeHolder for HoscGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.colour })
    }
}

impl HoscGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HoscGeometry {
        HoscGeometry {
            std: GeomContext::new(adata.clone(),&V_SRC,&F_SRC),
            pos: GTypeAttrib::new(&adata.borrow(),"aVertexPosition",2,1),
            colour: GTypeAttrib::new(&adata.borrow(),"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,points:&[f32;6],colour:&[f32;3]) {
        self.pos.add(points);
        self.colour.add(colour);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[f32;4],colour:&[f32;3]) {
        self.triangle(&[p[0],p[1], p[2],p[1], p[0],p[3]],colour);
        self.triangle(&[p[2],p[3], p[0],p[3], p[2],p[1]],colour);
    }
}

impl Geometry for HoscGeometry {
    fn populate(&mut self) { geometry::populate(self); }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
