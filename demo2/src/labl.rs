use geometry::{
    Geometry,
    StdGeometry,
    GeomBufSpec,
    TexGeomBufSpec,
};

use arena::{
    ArenaData,
    Stage
};

use wglraw;

use std::cell::RefCell;
use std::rc::Rc;

const V_SRC : &str = "
attribute vec2 aVertexPosition;
attribute vec2 aOrigin;
attribute vec3 aVertexColour;
attribute vec2 aTextureCoord;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = vec4(
        (aOrigin.x - uStageHpos) * uStageZoom + aVertexPosition.x,
        (aOrigin.y - uStageVpos) + aVertexPosition.y * uAspect,
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
    std: StdGeometry,
}

impl LablGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> LablGeometry {
                   
            let data : [u8;16] = [0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255];

        let mut std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC,3);
        std.add_spec(&GeomBufSpec { name: "aVertexPosition", size: 2, rep: 1 });
        std.add_spec(&GeomBufSpec { name: "aOrigin",         size: 2, rep: 3 });
        std.add_spec(&TexGeomBufSpec {
            name: "aTextureCoord", uname: "uSampler",
            size: 2, slot: 0, texture: &data[..]
        });
        LablGeometry {
            std,
        }
    }
    
    pub fn triangle(&mut self,origin:[f32;2],points:[f32;6]) {
        self.std.add(0,&points);
        self.std.add(1,&origin);
        self.std.advance();
    }

}

impl Geometry for LablGeometry {
    fn populate(&mut self) { self.std.populate(); }
    fn draw(&self,stage:&Stage) { self.std.draw(stage); }
}
