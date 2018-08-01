use geometry::{
    Geometry,
    GType,
    GTypeHolder,
    GeomContext,
    GTypeAttrib,
    GTypeTexture,
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
attribute vec2 aTextureCoord;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying highp vec2 vTextureCoord;


void main() {
     gl_Position = vec4(
          (aVertexPosition.x - uStageHpos) * uStageZoom,
          (aVertexPosition.y - uStageVpos),
          0.0, 1.0
    );
    vTextureCoord = aTextureCoord;
}
";

const F_SRC : &str = "
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
}
";

pub struct LablGeometry {
    std: GeomContext,
    pos: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeTexture,
}

impl GTypeHolder for LablGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,
        vec! { &mut self.sampler, &mut self.pos, &mut self.coord })
    }
}

impl LablGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> LablGeometry {
                   
            let data : [u8;16] = [0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255];
        LablGeometry {
            std: GeomContext::new(adata.clone(),&V_SRC,&F_SRC),
            pos: GTypeAttrib::new(&adata.borrow(),"aVertexPosition",2,1),
            coord: GTypeAttrib::new(&adata.borrow(),"aTextureCoord",2,1),
            sampler: GTypeTexture::new(&adata.borrow(),"uSampler",0,&data[..],2,2)
        }
    }
    
    pub fn triangle(&mut self,points:[f32;6],tex_points:[f32;6]) {
        self.pos.add(&points);
        self.coord.add(&tex_points);
        self.std.advance(3);
    }

}

impl Geometry for LablGeometry {
    fn populate(&mut self) { geometry::populate(self); }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
