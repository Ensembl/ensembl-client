use std::rc::Rc;

use drivers::webgl::{
    RectSpec, GLShape, TextureSpec, StretchTextureSpec, 
};
use types::{ Colour, RLeaf };
use program::{ ProgramAttribs, DataGroupIndex, ProgramType };
use super::{ PinPolySpec, StretchWiggle };

#[derive(Clone,Copy,Debug)]
pub struct BoxSpec {
    pub offset: RLeaf,
    pub width: i32,
    pub colspec: ColourSpec
}

#[derive(Clone)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
    PinBox(BoxSpec),
    PinTexture(TextureSpec),
    StretchTexture(StretchTextureSpec),
    Wiggle(StretchWiggle),
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
