use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,
    GType,
};

use geometry;

use arena::{
    ArenaData,
    Stage
};

pub struct StretchGeometry {
    std : GeomContext,
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
    
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.colour })
    }
}

impl StretchGeometry {
    pub fn new(adata: &ArenaData) -> StretchGeometry {
        StretchGeometry {
            std: GeomContext::new(adata,
                &geometry::shader_v_solid(
                    "(aVertexPosition.x - uStageHpos) * uStageZoom",
                    "aVertexPosition.y - uStageVpos"),
                &geometry::shader_f_solid()),
            pos: GTypeAttrib::new(adata,"aVertexPosition",2,1),
            colour: GTypeAttrib::new(adata,"aVertexColour",3,3),
        }
    }

    pub fn triangle(&mut self,points:&[f32;6],colour:&[f32;3]) {
        self.pos.add(points);
        self.colour.add(colour);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[f32;4],colour:&[f32;3]) {
        self.triangle(&[p[0],p[1], p[2],p[1], p[0],p[3]],colour);
        self.triangle(&[p[2],p[3], p[0],p[3], p[2],p[1]],colour);
    }
}
