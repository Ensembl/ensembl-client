use geometry::{
    Geometry,
    GLProgram,
    GTypeAttrib,
    GType,
};
use geometry;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

use arena::{
    ArenaData,
    ArenaDims,
    Stage
};

pub struct FixGeometry {
    std : GLProgram,
    pos: GTypeAttrib,
    colour: GTypeAttrib,
}

impl Geometry for FixGeometry {
    fn populate(&mut self, adata: &mut ArenaData) { geometry::populate(self,adata); }
    fn draw(&mut self, adata: &mut ArenaData,stage:&Stage) { geometry::draw(self,adata,stage); }

    fn gtypes(&mut self) -> (&GLProgram,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.colour })
    }
    
    fn restage(&mut self, ctx: &glctx, prog: &glprog, stage: &Stage, dims: &ArenaDims) {
        self.std.set_uniform_1f(&ctx,"uStageHpos",stage.pos.0);
        self.std.set_uniform_1f(&ctx,"uStageVpos",stage.pos.1);
        self.std.set_uniform_1f(&ctx,"uStageZoom",stage.zoom);
        self.std.set_uniform_2f(&ctx,"uCursor",stage.cursor);
        self.std.set_uniform_1f(&ctx,"uAspect",dims.aspect);
    }
}

impl FixGeometry {
    pub fn new(adata: &ArenaData) -> FixGeometry {
        FixGeometry {
            std: GLProgram::new(adata,
                &geometry::shader_v_solid_3vec(
                    "aVertexPosition.x - uCursor.x",
                    "( aVertexPosition.y + aVertexPosition.z * uAspect ) - uCursor.y"),
                &geometry::shader_f_solid(),
                &geometry::shader_u_solid()),
            pos: GTypeAttrib::new(adata,"aVertexPosition",3,1),
            colour: GTypeAttrib::new(adata,"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,points:&[f32;9],colour:&[f32;3]) {
        self.pos.add(points);
        self.colour.add(colour);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[f32;6],colour:&[f32;3]) {
        self.triangle(&[p[0],p[1],p[2],
                        p[3],p[1],p[2],
                        p[0],p[4],p[5]],&colour);
        self.triangle(&[p[3],p[4],p[5],
                        p[0],p[4],p[5],
                        p[3],p[1],p[2]],&colour);
    }
}
