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
    ArenaCanvases,
    ArenaDims,
    Stage
};

use texture::{
    TextureTargetManager,
    TextureDrawRequest,
    TextureItem,
};

use std::rc::Rc;

pub struct PinTexGeometryImpl {
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

pub struct PinTexGeometry {
    data: PinTexGeometryImpl,
    pub gtexitman: TextureTargetManager<PinTexGeometryImpl,PinTexTextureItem>,
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

pub struct PinTexTextureItem {
    origin: [f32;2],
    scale: [f32;2],
}

impl PinTexTextureItem {
    pub fn new(origin: &[f32;2], scale: &[f32;2]) -> PinTexTextureItem {
        PinTexTextureItem {
            origin: *origin, scale: *scale,
        }
    }
}

impl TextureItem<PinTexGeometryImpl> for PinTexTextureItem {
    fn process(&self, geom: &mut PinTexGeometryImpl, x: u32, y: u32, width: u32, height: u32, canvs: &ArenaCanvases, dims: &ArenaDims) {
        let flat = &canvs.flat;
        let origin = dims.nudge(self.origin);
        let p = [0., 0., dims.prop_x(width), dims.prop_y(height)];
        
        let t = [flat.prop_x(x), flat.prop_y(y + height),
                 flat.prop_x(x + width), flat.prop_y(y)];
        let p = [p[0],p[1],p[2]*self.scale[0],p[3]*self.scale[1]];
        geom.rectangle(&origin,&p,&t);
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
            gtexitman: TextureTargetManager::<PinTexGeometryImpl,PinTexTextureItem>::new(),
        }
    }

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, origin: &[f32;2], scale: &[f32;2]) {
        let ri = PinTexTextureItem::new(origin,scale);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
