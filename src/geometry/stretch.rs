use geometry::{
    Geometry,
    GLProgram,
    GTypeAttrib,
    GType,
    GCoord,
    Colour,
};

use geometry;

use arena::{
    ArenaData,
    ArenaDims,
    Stage
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

pub struct StretchGeometry {
    std : GLProgram,
    pos: GTypeAttrib,
    colour: GTypeAttrib,
}

impl Geometry for StretchGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        geometry::populate(self,adata);
    }
    
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) {
        geometry::draw(self,adata,stage);
    }
    
    fn gtypes(&mut self) -> (&GLProgram,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.colour })
    }
    
    fn restage(&mut self, ctx: &glctx, prog: &glprog, stage: &Stage, dims: &ArenaDims) {
        self.std.set_uniform_1f(&ctx,"uStageHpos",stage.pos.0);
        self.std.set_uniform_1f(&ctx,"uStageVpos",stage.pos.1 + (dims.height_px as f32/2.));
        self.std.set_uniform_1f(&ctx,"uStageZoom",stage.zoom);
        self.std.set_uniform_2f(&ctx,"uCursor",stage.cursor);
        self.std.set_uniform_1f(&ctx,"uAspect",dims.aspect);
        self.std.set_uniform_2f(&ctx,"uSize",[
            dims.width_px as f32 /2.,
            dims.height_px as f32 / 2.]);
    }
}

impl StretchGeometry {
    pub fn new(adata: &ArenaData) -> StretchGeometry {
        StretchGeometry {
            std: GLProgram::new(adata,
                &geometry::shader_v_solid(
                    "(aVertexPosition.x - uStageHpos) * uStageZoom",
                    "(aVertexPosition.y - uStageVpos) / uSize.y"),
                &geometry::shader_f_solid(),
                &geometry::shader_u_solid()),
            pos: GTypeAttrib::new(adata,"aVertexPosition",2,1),
            colour: GTypeAttrib::new(adata,"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,points:&[GCoord;3],colour:&Colour) {
        self.pos.add_gc(points);
        self.colour.add_col(colour);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[GCoord;2],colour:&Colour) {
        let mix = &p[0].mix(p[1]);
        self.triangle(&[p[0], mix.1, mix.0],colour);
        self.triangle(&[p[1], mix.0, mix.1],colour);
    }
}
