use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,
    GType,
    GTypeCanvasTexture,
};

use geometry;

use arena::{
    ArenaData,
    Stage
};

use texture::{
    GTextureManager,
    GTextureReceiver,
    TextureRequest,
    TextureItem,
};

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
        (aOrigin.y - uStageVpos) + aVertexPosition.y,
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

pub struct PinTexGeometry {
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
    gtexman: GTextureManager,
}

impl Geometry for PinTexGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        self.prepopulate(adata);
        geometry::populate(self,adata);
    }

    fn draw(&mut self, adata: &mut ArenaData, stage: &Stage) {
        geometry::draw(self,adata,stage);
    }

    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,
        vec! { &mut self.sampler, &mut self.pos,
               &mut self.origin, &mut self.coord })
    }
}

impl GTextureReceiver for PinTexGeometry {
    fn add_request(&mut self, req: Rc<TextureRequest>) {
        self.gtexman.add_request(req);
    }
    
    fn add_item(&mut self, item: TextureItem) {
        self.gtexman.add_item(item);
    }
}

impl PinTexGeometry {
    pub fn new(adata: &ArenaData) -> PinTexGeometry {
        PinTexGeometry {
            std: GeomContext::new(adata,&V_SRC,&F_SRC),
            pos:    GTypeAttrib::new(adata,"aVertexPosition",2,1),
            origin: GTypeAttrib::new(adata,"aOrigin",2,3),
            coord:  GTypeAttrib::new(adata,"aTextureCoord",2,1),
            sampler: GTypeCanvasTexture::new("uSampler",0),
            gtexman: GTextureManager::new(),
        }
    }
                 
    fn triangle(&mut self,origin:&[f32;2],points:&[f32;6],tex_points:&[f32;6]) {
        self.pos.add(points);
        self.origin.add(origin);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    fn rectangle(&mut self,origin:&[f32;2],p:&[f32;4],t:&[f32;4]) {
        self.triangle(origin,&[p[0],p[1],p[2],p[1],p[0],p[3]],
                             &[t[0],t[1],t[2],t[1],t[0],t[3]]);
        self.triangle(origin,&[p[2],p[3],p[0],p[3],p[2],p[1]],
                             &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
    
    fn prepopulate(&mut self, adata: &mut ArenaData) {
        let data = self.gtexman.draw(adata);
        for (origin,p,t) in data {
            self.rectangle(&origin,&p,&t);
        }
        self.gtexman.clear();
    }

}
