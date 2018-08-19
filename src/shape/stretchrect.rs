use arena::{
    Arena,
    ArenaData,
};

use geometry::coord::{
    GCoord,
    Colour,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

pub struct StretchRect {
    points: [GCoord;2],
    colour: Colour
}

impl StretchRect {
    pub fn new(points: [GCoord;2], colour: Colour) -> StretchRect {
        StretchRect { points, colour }
    }
    
    fn triangle(&self, geom: &mut GLProgramData, p:&[GCoord;3],colour:&Colour) {
        geom.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        geom.add_attrib_data("aVertexColour",&[colour,colour,colour]);
        geom.advance(3);
    }
    
    fn rectangle(&self, geom: &mut GLProgramData,p:&[GCoord;2],colour:&Colour) {
        let tp = p[0].triangles(p[1]);
        self.triangle(geom,&tp.0,colour);
        self.triangle(geom,&tp.1,colour);
    }
}

impl Shape for StretchRect {
    fn process(&self, geom: &mut GLProgramData, _adata: &ArenaData) {
        self.rectangle(geom,&self.points,&self.colour);
    }
}

pub fn stretch_rectangle(arena: &mut Arena, p:&[GCoord;2], colour:&Colour) {
    arena.get_geom("stretch").shapes.add_item(Box::new(
        StretchRect::new(*p,*colour)
    ));
}
