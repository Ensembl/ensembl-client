use std::rc::Rc;

use program::{ ProgramAttribs, DataGroupIndex, ProgramType };
use types::{ Colour };
use print::{ Programs, PrintEdition };
use drawing::{ Artist, Artwork, Drawing, DrawingSession };

pub trait Shape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom: &mut ProgramAttribs, art: Option<Artwork>,e: &mut PrintEdition);
    fn get_geometry(&self) -> ProgramType;
}

pub struct DrawnShape {
    shape: Box<Shape>,
    drawing: Option<Drawing>
}

impl DrawnShape {
    pub fn new(shape: Box<Shape>) -> DrawnShape {
        DrawnShape {
            shape,
            drawing: None
        }
    }
    
    pub fn redraw(&mut self, ds: &mut DrawingSession) {
        if let Some(a) = self.shape.get_artist() {
            let ocm = a.select_canvas(ds);
            self.drawing = Some(ocm.add_request(a));
        }
    }
    
    pub fn into_objects(&self, progs: &mut Programs,
                        ds: &mut DrawingSession, e: &mut PrintEdition) {
        let geom_name = self.shape.get_geometry();
        if let Some(geom) = progs.map.get_mut(&geom_name) {
            let artwork = self.drawing.as_ref().map(|r| r.artwork(ds));
            self.shape.into_objects(&mut geom.data,artwork,e);
        }
    }
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
