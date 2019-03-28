use std::rc::Rc;

use drivers::webgl::{
    PinPolySpec, RectSpec, GLShape, TextureSpec, StretchTextureSpec, 
    StretchWiggle, BoxSpec
};
use types::Colour;

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
    pub fn to_shape(&self) -> Box<&GLShape> {
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


#[derive(Clone,Copy,Debug)]
pub enum ColourSpec {
    Colour(Colour),
    Spot(Colour),
}


#[derive(Clone,Copy,Debug)]
pub enum MathsShape {
    Polygon(u16,f32), // (points,offset/rev)
    Circle
}
