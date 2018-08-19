use arena::{
    Arena,
    ArenaData,
};

use geometry::coord::{
    GCoord,
    PCoord,
    Colour,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

pub struct PinTriangle {
    origin: GCoord,
    points: [PCoord;3],
    colour: Colour
}

impl PinTriangle {
    pub fn new(origin: GCoord, points: [PCoord;3], colour: Colour) -> PinTriangle {
        PinTriangle { origin, points, colour }
    }
    
    fn triangle(&self, geom: &mut GLProgramData, origin: &GCoord, p: &[PCoord;3], colour: &Colour) {
        geom.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        geom.add_attrib_data("aOrigin",&[origin,origin,origin]);
        geom.add_attrib_data("aVertexColour",&[colour,colour,colour]);
        geom.advance(3);
    }
}

impl Shape for PinTriangle {
    fn process(&self, geom: &mut GLProgramData, _adata: &ArenaData) {
        self.triangle(geom,&self.origin,&self.points,&self.colour);
    }
}

pub fn pin_triangle(arena: &mut Arena, origin: &GCoord, p: &[PCoord;3], colour: &Colour) {
    arena.get_geom("pin").shapes.add_item(Box::new(
        PinTriangle::new(*origin,*p,*colour)
    ));
}
