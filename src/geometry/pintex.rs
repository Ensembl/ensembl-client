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
            std: GeomContext::new(adata,
                &geometry::shader_v_texture(
                    "(aOrigin.x - uStageHpos) * uStageZoom + aVertexPosition.x",
                    "(aOrigin.y - uStageVpos) + aVertexPosition.y",
                ),
                &geometry::shader_f_texture()),
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
        for (origin,scale,p,t) in data {
            let p = [p[0],p[1],p[2]*scale[0],p[3]*scale[1]];
            self.rectangle(&origin,&p,&t);
        }
        self.gtexman.clear();
    }
}
