use geometry::{
    Geometry,
    GCoord,
    PCoord,
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

/* This is the part of the geometry that's actually concerned with the
 * WebGL side of things, ignoring all the texture management stuff,
 * the same functionality as in the non-texture geometries. Separated 
 * out to ease pressure on the borrower.
 * 
 * Its API is the rectangle method which implements a textured rectangle
 * on a WebGL canvas (via low-level APIs).
 */


pub struct PinTexGeometryImpl {
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

impl PinTexGeometryImpl {
    fn triangle(&mut self,origin:&GCoord,points:&[f32;6],tex_points:&[f32;6]) {
        self.pos.add(points);
        self.origin.add_gc(&[*origin]);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    fn rectangle(&mut self,origin: &GCoord,p:&[f32;4],t:&[f32;4]) {
        self.triangle(origin,&[p[0],p[1],p[2],p[1],p[0],p[3]],
                             &[t[0],t[1],t[2],t[1],t[0],t[3]]);
        self.triangle(origin,&[p[2],p[3],p[0],p[3],p[2],p[1]],
                             &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
}

/* A PinTexTextureItem is the type which contains geometry-specific
 * values for each texture designed to be placed in the target.
 * 
 * It implements TextureItem which, given various canvas co-ordinates
 * of the source and an Impl will populate the relevant attribs, taking
 * into account geometry co-ordinates, etc.
 */

pub struct PinTexTextureItem {
    origin: GCoord,
    scale: PCoord,
}

impl PinTexTextureItem {
    pub fn new(origin: &GCoord, scale: &PCoord) -> PinTexTextureItem {
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
        let s = PCoord(p[2],p[3]).scale(self.scale);
        let p = [p[0],p[1],s.0,s.1];
        geom.rectangle(&origin,&p,&t);
    }
}

/* This is the externally visible Geometry. It contains the impl (which
 * is the geometry proper) and a TextureTagetManager, which is used to
 * store TextureItems (in our case PinTexTextureItems, above) between
 * the request for an item and knowin the co-ordinates on the canvas.
 */

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

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, origin: &GCoord, scale: &PCoord) {
        let ri = PinTexTextureItem::new(origin,scale);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
