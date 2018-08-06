use geometry::{
    Geometry,
    GeomContext,
    GTypeAttrib,    
    GType,
};

use geometry;
use geometry::{
    Colour,
    GCoord,
    PCoord
};

use arena::{
    ArenaData,
    Stage
};

pub struct PinGeometry {
    std: GeomContext,
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

    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,vec! { &mut self.pos, &mut self.origin, &mut self.colour})
    }
}

impl PinGeometry {
    pub fn new(adata: &ArenaData) -> PinGeometry {
        PinGeometry {
            std: GeomContext::new(adata,
                &geometry::shader_v_solid(
                    "(aOrigin.x - uStageHpos) * uStageZoom + aVertexPosition.x",
                    "(aOrigin.y - uStageVpos) + aVertexPosition.y * uAspect"),
                &geometry::shader_f_solid()),

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
