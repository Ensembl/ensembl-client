use geometry::{
    Geometry,
    GLProgram,
    GTypeAttrib,
    GType,
    GTypeCanvasTexture,
    GCoord,
};

use geometry;

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
    pos: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

impl StretchTexGeometryImpl {
    pub fn triangle(&mut self,points:&[GCoord;3],tex_points:&[f32;6]) {
        self.pos.add_gc(points);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p: &[GCoord;2], t: &[f32;4]) {
        let mix = p[0].mix(p[1]);
        
        self.triangle(&[p[0], mix.1, mix.0],
                      &[t[0],t[1], t[2],t[1], t[0],t[3]]);
        self.triangle(&[p[1], mix.0, mix.1],
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

    fn gtypes(&mut self) -> (&GLProgram,Vec<&mut GType>) {
        (&self.data.std,
        vec! { &mut self.data.pos, &mut self.data.sampler,
               &mut self.data.coord })
    }
    
    fn restage(&mut self, ctx: &glctx, prog: &glprog, stage: &Stage, dims: &ArenaDims) {
        self.data.std.set_uniform_1f(&ctx,"uStageHpos",stage.pos.0);
        self.data.std.set_uniform_1f(&ctx,"uStageVpos",stage.pos.1 + (dims.height_px as f32/2.));
        self.data.std.set_uniform_1f(&ctx,"uStageZoom",stage.zoom);
        self.data.std.set_uniform_1f(&ctx,"uAspect",dims.aspect);
        self.data.sampler.set_uniform(&ctx,&self.data.std,"uSampler");
        self.data.std.set_uniform_2f(&ctx,"uSize",[
            dims.width_px as f32/2.,
            dims.height_px as f32/2.]);
    }
}

impl StretchTexGeometry {
    pub fn new(adata: &ArenaData) -> StretchTexGeometry {
        StretchTexGeometry {
            data: StretchTexGeometryImpl {
                std: GLProgram::new(adata,
                    &geometry::shader_v_texture(
                        "(aVertexPosition.x - uStageHpos) * uStageZoom",
                        "(aVertexPosition.y - uStageVpos) / uSize.y"
                    ),
                    &geometry::shader_f_texture(),
                    &geometry::shader_u_texture()),
                pos:    GTypeAttrib::new(adata,"aVertexPosition",2,1),
                coord:  GTypeAttrib::new(adata,"aTextureCoord",2,1),
                sampler: GTypeCanvasTexture::new(),
            },
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
