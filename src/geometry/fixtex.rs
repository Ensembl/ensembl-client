use geometry::{
    Geometry,
    GLProgram,
    GTypeAttrib,
    GType,
    GTypeCanvasTexture,
    PCoord,
};

use geometry;

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
    pos: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

impl FixTexGeometryImpl {
    pub fn triangle(&mut self,points:&[PCoord;3],tex_points:&[f32;6]) {
        self.pos.add_px(points);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[PCoord;2],t:&[f32;4]) {
        let mix = p[0].mix(p[1]);
        
        self.triangle(&[p[0], mix.1, mix.0],
                      &[t[0],t[1], t[2],t[1], t[0],t[3]]);
        self.triangle(&[p[1], mix.0, mix.1],
                      &[t[2],t[3],t[0],t[3],t[2],t[1]]);
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
        let t = [flat.prop_x(x), flat.prop_y(y + height),
                 flat.prop_x(x + width), flat.prop_y(y)];
        
        let p = [PCoord(self.pos.0,self.pos.1),
                 PCoord(self.pos.0 + width as f32 * self.scale.0,
                        self.pos.1 + height as f32 * self.scale.1)];        
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

impl FixTexGeometry {
    pub fn new(adata: &ArenaData) -> FixTexGeometry {
        FixTexGeometry {
            data:  FixTexGeometryImpl {
                std: GLProgram::new(adata, 
                    &geometry::shader_v_texture(
                        "aVertexPosition.x / uSize.x - 1.0",
                        "aVertexPosition.y / uSize.y - 1.0"),
                    &geometry::shader_f_texture(),
                    &geometry::shader_u_texture()),
                pos:    GTypeAttrib::new(adata,"aVertexPosition",2,1),
                coord:  GTypeAttrib::new(adata,"aTextureCoord",2,1),
                sampler: GTypeCanvasTexture::new(),
            },
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
