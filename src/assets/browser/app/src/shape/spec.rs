use std::rc::Rc;

use shape::{
    PinPolySpec, RectSpec, Shape, TextureSpec, StretchTextureSpec, 
    StretchWiggle, BoxSpec
};

use program::{ ProgramAttribs, DataGroupIndex, ProgramType };
use types::{ Colour };
use drivers::webgl::{ Programs, PrintEdition, Artist, Artwork, Drawing, CarriageCanvases };

#[derive(Clone)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
    PinBox(BoxSpec),
    PinTexture(TextureSpec),
    StretchTexture(StretchTextureSpec),
    Wiggle(StretchWiggle),
}

impl ShapeSpec {
    pub fn as_shape(&self) -> Box<&Shape> {
        match self {
            ShapeSpec::PinPoly(pp) => Box::new(pp),
            ShapeSpec::PinRect(pr) => Box::new(pr),
            ShapeSpec::PinTexture(pt) => Box::new(pt),
            ShapeSpec::StretchTexture(st) => Box::new(st),
            ShapeSpec::Wiggle(w) => Box::new(w),
            ShapeSpec::PinBox(pb) => Box::new(pb),
        }
    }    
}

impl Shape for ShapeSpec {
    fn get_artist(&self) -> Option<Rc<Artist>> {
        self.as_shape().get_artist()
    }
        
    fn into_objects(&self, geom: &mut ProgramAttribs, art: Option<Artwork>,e: &mut PrintEdition) {
        self.as_shape().into_objects(geom,art,e)
    }
    
    fn get_geometry(&self) -> ProgramType {
        self.as_shape().get_geometry()
    }
}
