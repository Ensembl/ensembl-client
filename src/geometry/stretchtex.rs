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

/* This is the part of the geometry that's actually concerned with the
 * WebGL side of things, ignoring all the texture management stuff,
 * the same functionality as in the non-texture geometries. Separated 
 * out to ease pressure on the borrower.
 * 
 * Its API is the rectangle method which implements a textured rectangle
 * on a WebGL canvas (via low-level APIs).
 */


pub struct StretchTexGeometryImpl {
    std: GeomContext,
    pos: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

impl StretchTexGeometryImpl {
    pub fn triangle(&mut self,points:&[f32;6],tex_points:&[f32;6]) {
        self.pos.add(points);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p: &[f32;4], t: &[f32;4]) {
        self.triangle(&[p[0],p[1], p[2],p[1], p[0],p[3]],
                      &[t[0],t[1], t[2],t[1], t[0],t[3]]);
        self.triangle(&[p[2],p[3],p[0],p[3],p[2],p[1]],
                      &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
}

/* A StretchTexTextureItem is the type which contains geometry-specific
 * values for each texture designed to be placed in the target.
 * 
 * It implements TextureItem which, given various canvas co-ordinates
 * of the source and an Impl will populate the relevant attribs, taking
 * into account geometry co-ordinates, etc.
 */

pub struct StretchTexTextureItem {
    pos: [f32;4],
}

impl StretchTexTextureItem {
    pub fn new(pos: &[f32;4]) -> StretchTexTextureItem {
        StretchTexTextureItem {
            pos: *pos
        }
    }
}

impl TextureItem<StretchTexGeometryImpl> for StretchTexTextureItem {
    fn process(&self, geom: &mut StretchTexGeometryImpl, x: u32, y: u32, width: u32, height: u32, canvs: &ArenaCanvases, dims: &ArenaDims) {
        let flat = &canvs.flat;
        let t = [flat.prop_x(x), flat.prop_y(y + height),
                 flat.prop_x(x + width), flat.prop_y(y)];
        geom.rectangle(&self.pos,&t);
    }
}

/* This is the externally visible Geometry. It contains the impl (which
 * is the geometry proper) and a TextureTagetManager, which is used to
 * store TextureItems (in our case StretchTexTextureItems, above) between
 * the request for an item and knowin the co-ordinates on the canvas.
 */

pub struct StretchTexGeometry {
    data: StretchTexGeometryImpl,
    pub gtexitman: TextureTargetManager<StretchTexGeometryImpl,StretchTexTextureItem>,
}

impl Geometry for StretchTexGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        self.prepopulate(adata);
        geometry::populate(self,adata);
    }

    fn draw(&mut self, adata: &mut ArenaData, stage: &Stage) {
        geometry::draw(self,adata,stage);
    }

    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.data.std,
        vec! { &mut self.data.pos, &mut self.data.sampler,
               &mut self.data.coord })
    }
}

impl StretchTexGeometry {
    pub fn new(adata: &ArenaData) -> StretchTexGeometry {
        StretchTexGeometry {
            data: StretchTexGeometryImpl {
                std: GeomContext::new(adata,
                    &geometry::shader_v_texture(
                        "(aVertexPosition.x - uStageHpos) * uStageZoom",
                        "aVertexPosition.y - uStageVpos"
                    ),
                    &geometry::shader_f_texture()),
                pos:    GTypeAttrib::new(adata,"aVertexPosition",2,1),
                coord:  GTypeAttrib::new(adata,"aTextureCoord",2,1),
                sampler: GTypeCanvasTexture::new("uSampler",0),
            },
            gtexitman: TextureTargetManager::<StretchTexGeometryImpl,StretchTexTextureItem>::new(),
        }
    }

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, pos: &[f32;4]) {
        let ri = StretchTexTextureItem::new(pos);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
