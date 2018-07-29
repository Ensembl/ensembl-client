use geometry::{
    Geometry,
    StdGeometry,
    GTypeAttrib,
    GTypeCanvasTexture,
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

pub struct TextGeometry {
    std: StdGeometry,
}

impl TextGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> TextGeometry {                   
        let data : [u8;16] = [0,0,255,255,
                              255,0,0,255,
                              0,255,0,255,
                              255,255,0,255];

        let mut std = StdGeometry::new(adata.clone(),&V_SRC,&F_SRC,3);
        std.add_spec(&GTypeAttrib  { name: "aVertexPosition", size: 2, rep: 1 });
        std.add_spec(&GTypeAttrib  { name: "aOrigin",         size: 2, rep: 3 });
        std.add_spec(&GTypeAttrib  { name: "aTextureCoord",   size: 2, rep: 1 });
        //std.add_spec(&GTypeTexture { uname: "uSampler", slot: 0, texture: &data[..], width: 2, height: 2 });
        std.add_spec(&GTypeCanvasTexture { uname: "uSampler", slot: 0, width: 2, height: 2 });
        TextGeometry { std }

    }
        
    pub fn triangle(&mut self,origin:&[f32;2],points:&[f32;6],tex_points:&[f32;6]) {
        js! { console.log(@{origin[0]},@{origin[1]}); };
        js! { console.log(@{points[0]},@{points[1]},@{points[2]},@{points[3]},@{points[4]},@{points[5]}); };
        self.std.add(0,points);
        self.std.add(1,origin);
        self.std.add(2,tex_points);
        self.std.advance();
    }
    
    pub fn rectangle(&mut self,origin:&[f32;2],p:&[f32;4],t:&[f32;4]) {
        self.triangle(origin,&[p[0],p[1],p[2],p[1],p[0],p[3]],
                             &[t[0],t[1],t[2],t[1],t[0],t[3]]);
        self.triangle(origin,&[p[2],p[3],p[0],p[3],p[2],p[1]],
                             &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
}

impl Geometry for TextGeometry {
    fn populate(&mut self) { self.std.populate(); }
    fn draw(&self,stage:&Stage) { self.std.draw(stage); }
}
