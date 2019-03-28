use std::rc::Rc;

use program::{ ProgramAttribs, DataGroupIndex, ProgramType };
use types::{ Colour };
use drivers::webgl::{ GLProgs, GLProgData };
use drivers::webgl::{ Artist, Artwork, Drawing, CarriageCanvases };
use model::shape::ColourSpec;

pub trait GLShape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom: &mut ProgramAttribs, art: Option<Artwork>,e: &mut GLProgData);
    fn get_geometry(&self) -> ProgramType;
}
