use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,
    GType,
    GTypeCanvasTexture,
};

use geometry;

use texture::TexGeometry;

use arena::{
    ArenaData,
    Stage
};

use texture::{
    GTextureItemManager,
    GTextureRequestManager,
    TextureRequest,
    TextureItem,
};

use std::rc::Rc;

struct PinTexGeometryImpl {
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

pub struct PinTexGeometry {
    data: PinTexGeometryImpl,
    pub gtexitman: GTextureItemManager,
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
        (&self.data.std,
        vec! { &mut self.data.sampler, &mut self.data.pos,
               &mut self.data.origin, &mut self.data.coord })
    }
}

impl TexGeometry for PinTexGeometryImpl {
    fn render(&mut self,origin:&[f32;2],scale:&[f32;2],p:&[f32;4],t:&[f32;4]) {
        let p = [p[0],p[1],p[2]*scale[0],p[3]*scale[1]];
        self.rectangle(&origin,&p,&t);
    }
}

impl PinTexGeometryImpl {
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
}

impl PinTexGeometry {
    pub fn new(adata: &ArenaData) -> PinTexGeometry {
        PinTexGeometry {
            data: PinTexGeometryImpl {
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
            },
            gtexitman: GTextureItemManager::new(),
        }
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
