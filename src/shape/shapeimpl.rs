use std::rc::Rc;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType };
use types::{ Colour };
use print::Programs;
use drawing::{ Artist, Artwork, Drawing, DrawingSession };
use shape::Spot;

pub trait Shape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, art: Option<Artwork>);
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
                        ds: &mut DrawingSession) {
        let geom_name = self.shape.get_geometry();
        if let Some(geom) = progs.map.get_mut(&geom_name) {
            let artwork = self.drawing.as_ref().map(|r| r.artwork(ds));
            self.shape.into_objects(geom_name,&mut geom.data,artwork);
        }
    }    
}

pub trait ShapeContext {
    fn reset(&mut self);
    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, ctx: &glctx);
}

#[derive(Clone)]
pub enum ColourSpec {
    Colour(Colour),
    Spot(Spot)
}

impl ColourSpec {
    pub fn to_group(&self, gn: ProgramType) -> Option<DataGroup> {
        match self {
            ColourSpec::Spot(s) => Some(s.get_group(gn)),
            ColourSpec::Colour(_) => None
        }
    }
}

#[derive(Clone,Copy)]
pub enum MathsShape {
    Polygon(u16,f32), // (points,offset/rev)
    Circle
}
