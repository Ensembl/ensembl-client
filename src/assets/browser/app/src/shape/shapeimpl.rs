use std::rc::Rc;

use program::{ ProgramAttribs, DataGroupIndex, ProgramType };
use types::{ Colour };
use drivers::webgl::{ Programs, PrintEdition };
use drawing::{ Artist, Artwork, Drawing, CarriageCanvases };

pub trait Shape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom: &mut ProgramAttribs, art: Option<Artwork>,e: &mut PrintEdition);
    fn get_geometry(&self) -> ProgramType;
}

#[derive(Clone,Copy,Debug)]
pub enum ColourSpec {
    Colour(Colour),
    Spot(Colour),
}

impl ColourSpec {
    pub fn to_group(&self, g: &mut ProgramAttribs, e: &mut PrintEdition) -> Option<DataGroupIndex> {
        match self {
            ColourSpec::Spot(c) => Some(e.spot().get_group(g,c)),
            ColourSpec::Colour(_) => None
        }
    }
}

#[derive(Clone,Copy,Debug)]
pub enum MathsShape {
    Polygon(u16,f32), // (points,offset/rev)
    Circle
}
