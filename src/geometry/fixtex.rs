use geometry::{
    Geometry,
    GLProgram,
    GType,
};

use geometry::gtype::{
    GTypeCanvasTexture,
};

use geometry::coord::{
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


pub struct FixTexGeometryImpl {
    std: GLProgram,
}

impl FixTexGeometryImpl {
    pub fn new(adata: &ArenaData) -> FixTexGeometryImpl {
        let source = shader_texture(&GLSource::new(vec! {
            Uniform::new_vertex("vec2","uSize"),
            Attribute::new(2,"aVertexPosition"),
            Statement::new_vertex("
                gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                                   aVertexPosition.y / uSize.y - 1.0,
                                   0.0, 1.0)")
        }));
        FixTexGeometryImpl {
            std: GLProgram::new(adata,&source),
        }
    }

    pub fn triangle(&mut self,p: &[PCoord;3],tp: &[TCoord;3]) {
        self.std.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        self.std.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[PCoord;2],t:&[TCoord;2]) {
        let  mix = p[0].mix(p[1]);
        let tmix = t[0].mix(t[1]);
        
        self.triangle(&[p[0],  mix.1,  mix.0],
                      &[t[0], tmix.1, tmix.0]);
        self.triangle(&[p[1],  mix.0,  mix.1],
                      &[t[1], tmix.0, tmix.1]);
    }
}

/* A FixTexTextureItem is the type which contains geometry-specific
 * values for each texture designed to be placed in the target.
 * 
 * It implements TextureItem which, given various canvas co-ordinates
 * of the source and an Impl will populate the relevant attribs, taking
 * into account geometry co-ordinates, etc.
 */

pub struct FixTexTextureItem {
    pos: PCoord,
    scale: PCoord,
}

impl FixTexTextureItem {
    pub fn new(pos: &PCoord, scale: &PCoord) -> FixTexTextureItem {
        FixTexTextureItem {
            pos: *pos, scale: *scale,
        }
    }
}

impl TextureItem<FixTexGeometryImpl> for FixTexTextureItem {
    fn process(&self, geom: &mut FixTexGeometryImpl, x: u32, y: u32, width: u32, height: u32, canvs: &ArenaCanvases, dims: &ArenaDims) {
        let flat = &canvs.flat;
        let t = [TCoord(flat.prop_x(x), flat.prop_y(y + height)),
                 TCoord(flat.prop_x(x + width), flat.prop_y(y))];
        let pos = dims.nudge_p(self.pos);
        let p = [PCoord(pos.0,pos.1),
                 PCoord(pos.0 + width as f32 * self.scale.0,
                        pos.1 + height as f32 * self.scale.1 )];
        geom.rectangle(&p,&t);
    }
}

/* This is the externally visible Geometry. It contains the impl (which
 * is the geometry proper) and a TextureTagetManager, which is used to
 * store TextureItems (in our case FixTexTextureItems, above) between
 * the request for an item and knowin the co-ordinates on the canvas.
 */

pub struct FixTexGeometry {
    data: FixTexGeometryImpl,
    pub gtexitman: TextureTargetManager<FixTexGeometryImpl,FixTexTextureItem>,
}

impl Geometry for FixTexGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        self.prepopulate(adata);
        self.data.std.populate(adata);
    }
    
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.data.std.draw(adata,stage); }
}

impl FixTexGeometry {
    pub fn new(adata: &ArenaData) -> FixTexGeometry {
        FixTexGeometry {
            data:  FixTexGeometryImpl::new(adata),
            gtexitman: TextureTargetManager::<FixTexGeometryImpl,FixTexTextureItem>::new(),
        }
    }

    pub fn add_texture(&mut self, req: Rc<TextureDrawRequest>, origin: &PCoord, scale: &PCoord) {
        let ri = FixTexTextureItem::new(origin,scale);
        self.gtexitman.add_item(req,ri);
    }

    fn prepopulate(&mut self, adata: &mut ArenaData) {
        self.gtexitman.draw(&mut self.data,&mut adata.gtexreqman,&mut adata.canvases,&adata.dims);
        self.gtexitman.clear();
    }
}
