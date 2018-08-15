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
    TCoord,
};

use geometry;
use geometry::wglprog;

use geometry::wglprog::{
    Statement,
    GLSource,
    Uniform,
    Attribute,
    shader_texture,
};

use arena::{
    ArenaData,
    ArenaCanvases,
    ArenaDims,
    Stage
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
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
    std: GLProgram,
}

impl StretchTexGeometryImpl {
    pub fn new(adata: &ArenaData) -> StretchTexGeometryImpl {
        let source = shader_texture(&GLSource::new(vec! {
            Uniform::new_vertex("float","uStageHpos"),
            Uniform::new_vertex("float","uStageVpos"),
            Uniform::new_vertex("float","uStageZoom"),
            Uniform::new_vertex("vec2","uSize"),
            Attribute::new(2,"aVertexPosition"),
            Statement::new_vertex("
                gl_Position = vec4(
                    (aVertexPosition.x - uStageHpos) * uStageZoom,
                    (aVertexPosition.y - uStageVpos) / uSize.y,
                    0.0, 1.0)")
        }));
        StretchTexGeometryImpl {
            std: GLProgram::new(adata,&source),
        }
    }

    pub fn triangle(&mut self,p:&[GCoord;3],tp:&[TCoord;3]) {
        self.std.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        self.std.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p: &[GCoord;2], t: &[TCoord;2]) {
        let  mix = p[0].mix(p[1]);
        let tmix = t[0].mix(t[1]);
        
        self.triangle(&[p[0],  mix.1,  mix.0],
                      &[t[0], tmix.1, tmix.0]);
        self.triangle(&[p[1],  mix.0, mix.1],
                      &[t[1], tmix.0, tmix.1]);
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
    pos: [GCoord;2],
}

impl StretchTexTextureItem {
    pub fn new(pos: &[GCoord;2]) -> StretchTexTextureItem {
        StretchTexTextureItem {
            pos: *pos
        }
    }
}

impl TextureItem<StretchTexGeometryImpl> for StretchTexTextureItem {
    fn process(&self, geom: &mut StretchTexGeometryImpl, x: u32, y: u32, width: u32, height: u32, canvs: &ArenaCanvases, dims: &ArenaDims) {
        let flat = &canvs.flat;
        let t = [TCoord(flat.prop_x(x), flat.prop_y(y + height)),
                 TCoord(flat.prop_x(x + width), flat.prop_y(y))];
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
        self.data.std.populate(adata);
    }
    
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.data.std.draw(adata,stage); }
}

impl StretchTexGeometry {
    pub fn new(adata: &ArenaData) -> StretchTexGeometry {
        StretchTexGeometry {
            data: StretchTexGeometryImpl::new(adata),
            gtexitman: TextureTargetManager::<StretchTexGeometryImpl,StretchTexTextureItem>::new(),
        }
    }

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, pos: &[GCoord;2]) {
        let ri = StretchTexTextureItem::new(pos);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.gtexreqman,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
