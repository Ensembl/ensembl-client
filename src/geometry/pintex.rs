use geometry::{
    Geometry,
    GLProgram,
    GType,
};

use geometry::gtype::{
    GTypeCanvasTexture,
};

use geometry::coord::{
    GCoord,
    PCoord,
    TCoord
};

use geometry;
use geometry::wglprog;

use geometry::wglprog::{
    Statement,
    GLSource,
    shader_texture,
    Uniform,
    Attribute,
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

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
    std: GLProgram,
}

impl PinTexGeometryImpl {
    pub fn new(adata: &ArenaData) -> PinTexGeometryImpl {
        let source = shader_texture(&GLSource::new(vec! {
            Uniform::new_vertex("float","uStageHpos"),
            Uniform::new_vertex("float","uStageVpos"),
            Uniform::new_vertex("float","uStageZoom"),
            Uniform::new_vertex("vec2","uSize"),
            Attribute::new(2,"aVertexPosition"),
            Attribute::new(2,"aOrigin"),
            Statement::new_vertex("
                 gl_Position = vec4(
                    (aOrigin.x - uStageHpos) * uStageZoom + 
                                aVertexPosition.x / uSize.x,
                    (aOrigin.y - uStageVpos) / uSize.y + 
                                aVertexPosition.y / uSize.y,
                    0.0, 1.0)")
        }));
        PinTexGeometryImpl {
            std: GLProgram::new(adata,&source),
        }
    }

    fn triangle(&mut self,origin:&GCoord,p: &[PCoord;3], tp: &[TCoord;3]) {
        self.std.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        self.std.add_attrib_data("aOrigin",&[origin,origin,origin]);
        self.std.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        self.std.advance(3);
    }
    
    fn rectangle(&mut self,origin: &GCoord,p:&[PCoord;2],t:&[TCoord;2]) {
        let  mix = p[0].mix(p[1]);
        let tmix = t[0].mix(t[1]);
        self.triangle(origin,&[p[0],  mix.1,  mix.0],
                             &[t[0], tmix.1, tmix.0]);
        self.triangle(origin,&[p[1],  mix.0,  mix.1],
                             &[t[1], tmix.0, tmix.1]);
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
        let origin = dims.nudge_g(self.origin);
        let p = [PCoord(0.,0.), PCoord(width as f32 * self.scale.0,height as f32 * self.scale.1)];
        let t = [TCoord(flat.prop_x(x), flat.prop_y(y + height)),
                 TCoord(flat.prop_x(x + width), flat.prop_y(y))];
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
        self.data.std.populate(adata);
    }

    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.data.std.draw(adata,stage); }
}

impl PinTexGeometry {
    pub fn new(adata: &ArenaData) -> PinTexGeometry {
        PinTexGeometry {
            data: PinTexGeometryImpl::new(adata),
            gtexitman: TextureTargetManager::<PinTexGeometryImpl,PinTexTextureItem>::new(),
        }
    }

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, origin: &GCoord, scale: &PCoord) {
        let ri = PinTexTextureItem::new(origin,scale);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.gtexreqman,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
