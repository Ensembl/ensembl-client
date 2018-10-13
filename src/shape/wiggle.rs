use types::{ CLeaf, Colour };

use shape::{ Shape, ColourSpec };
use shape::util::{ points_g, vertices_strip };

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };
use print::PrintEdition;

use drawing::Artwork;

pub struct StretchWiggle {
    points: Vec<CLeaf>,
    y: i32,
    group: Colour
}

impl StretchWiggle {
    pub fn new(points: Vec<CLeaf>, group: Colour, y: i32) -> StretchWiggle {
        StretchWiggle { points, group, y }
    }
}

impl Shape for StretchWiggle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut PrintEdition) {
        let dg = ColourSpec::Spot(self.group).to_group(geom,e);
        let b = vertices_strip(geom,self.points.len() as u16*2,dg);
        points_g(b,geom,"aVertexPosition",&self.points,self.y);
    }
    
    fn get_geometry(&self) -> ProgramType { 
        ProgramType(PTGeom::Stretch,PTMethod::Strip,PTSkin::Spot)
    }
}

pub fn stretch_wiggle(p: Vec<CLeaf>, y: i32, colour: &Colour) -> Box<Shape> {
    Box::new(StretchWiggle::new(p,colour.clone(),y))
}
