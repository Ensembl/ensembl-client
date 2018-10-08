use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;
use webgl_rendering_context::WebGLRenderingContext as glctx;
use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use types::{ Colour };
use composit::Compositor;
use drawing::{ Artist, Artwork };
use shape::Spot;

pub trait Shape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, art: Option<Artwork>);
    fn get_geometry(&self) -> ProgramType;
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
