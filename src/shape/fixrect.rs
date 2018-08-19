use arena::{
    ArenaData,
    Arena,
};
use geometry::coord::{
    PCoord,
    Colour,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

pub struct FixRect {
    points: [PCoord;2],
    colour: Colour,
}

impl FixRect {
    pub fn new(points: [PCoord;2], colour: Colour) -> FixRect {
        FixRect { points, colour }
    }
    
    fn triangle(&self, geom: &mut GLProgramData, p: &[PCoord;3], colour: &Colour) {
        geom.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        geom.add_attrib_data("aVertexColour",&[colour,colour,colour]);
        geom.advance(3);
    }
    
    fn rectangle(&self, geom: &mut GLProgramData, p:&[PCoord;2],colour:&Colour) {
        let t = &p[0].triangles(p[1]);
        self.triangle(geom,&t.0,colour);
        self.triangle(geom,&t.1,colour);
    }
}

impl Shape for FixRect {
    fn process(&self, geom: &mut GLProgramData, _adata: &ArenaData) {
        self.rectangle(geom,&self.points,&self.colour);
    }
}

pub fn fix_rectangle(arena: &mut Arena, p: &[PCoord;2], colour: &Colour) {
    let geom = arena.get_geom("fix");
    geom.shapes.add_item(Box::new(
        FixRect::new(*p,*colour)
    ));
}
