use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,
    GType,
    GCoord,
    Colour,
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
