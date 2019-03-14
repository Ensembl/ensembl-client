use shape::{
    PinPolySpec, RectSpec, Shape, TextureSpec, StretchTextureSpec, 
    StretchWiggle, BoxSpec
};

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
    pub fn to_shape(self) -> Box<Shape> {
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
