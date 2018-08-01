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
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    colour: GTypeAttrib,
}

impl GTypeHolder for HofiGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.origin, &mut self.colour})
    }
}

impl HofiGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> HofiGeometry {
        HofiGeometry {
            std: GeomContext::new(adata.clone(),&V_SRC,&F_SRC),
            pos: GTypeAttrib::new(&adata.borrow(),"aVertexPosition",2,1),
            origin: GTypeAttrib::new(&adata.borrow(),"aOrigin",2,3),
            colour: GTypeAttrib::new(&adata.borrow(),"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,origin:[f32;2],points:[f32;6],colour:[f32;3]) {
        self.pos.add(&points);
        self.origin.add(&origin);
        self.colour.add(&colour);
        self.std.advance(3);
    }
}

impl Geometry for HofiGeometry {
    fn populate(&mut self) { geometry::populate(self); }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
