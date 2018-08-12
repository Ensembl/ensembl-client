use geometry::{
    Geometry,
    GLProgram,
    GTypeAttrib,    
    GType,
};

use geometry::wglprog::{
    GLSource,
    Statement,
    shader_solid,
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

use geometry;
use geometry::wglprog;
use geometry::{
    Colour,
    GCoord,
    PCoord
};

use arena::{
    ArenaData,
    ArenaDims,
    Stage
};

pub struct PinGeometry {
    std: GLProgram,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    colour: GTypeAttrib,
}

impl Geometry for PinGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        geometry::populate(self, adata);
    }

    fn draw(&mut self, adata: &mut ArenaData,stage:&Stage) {
        geometry::draw(self,adata,stage);
    }

    fn gtypes(&mut self) -> (&GLProgram,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.origin, &mut self.colour})
    }

    fn restage(&mut self, ctx: &glctx, prog: &glprog, stage: &Stage, dims: &ArenaDims) {
        self.std.set_uniform_1f(&ctx,"uStageHpos",stage.pos.0);
        self.std.set_uniform_1f(&ctx,"uStageVpos",stage.pos.1 + (dims.height_px as f32/2.));
        self.std.set_uniform_1f(&ctx,"uStageZoom",stage.zoom);
        self.std.set_uniform_1f(&ctx,"uAspect",dims.aspect);
        self.std.set_uniform_2f(&ctx,"uSize",[
            dims.width_px as f32 /2.,
            dims.height_px as f32 /2.]);
    }
}

impl PinGeometry {
    pub fn new(adata: &ArenaData) -> PinGeometry {
        let source = shader_solid(&GLSource::new(vec! {
            Statement::new_vertex("
                gl_Position = vec4(
                    (aOrigin.x - uStageHpos) * uStageZoom + 
                                aVertexPosition.x / uSize.x,
                    (aOrigin.y - uStageVpos) / uSize.y + 
                                aVertexPosition.y / uSize.y,
                    0.0, 1.0)")
        }));
        PinGeometry {
            std: GLProgram::new(adata,&source),
            pos: GTypeAttrib::new(&adata,"aVertexPosition",2,1),
            origin: GTypeAttrib::new(&adata,"aOrigin",2,3),
            colour: GTypeAttrib::new(&adata,"aVertexColour",3,3),
        }
    }
    
    pub fn triangle(&mut self, origin: &GCoord, points: &[PCoord;3], colour: &Colour) {
        self.pos.add_px(points);
        self.origin.add_gc(&[*origin]);
        self.colour.add_col(colour);
        self.std.advance(3);
    }
}
