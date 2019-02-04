use shape::{
    PinPolySpec, RectSpec, Shape, TextureSpec, StretchTextureSpec, 
    StretchWiggle, BoxSpec
};

#[derive(Clone,Debug)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
    PinBox(BoxSpec),
    PinTexture(TextureSpec),
    StretchTexture(StretchTextureSpec),
    Wiggle(StretchWiggle),
}

impl ShapeSpec {
    pub fn create(&self) -> Box<Shape> {
        match self {
            ShapeSpec::PinPoly(pp) => pp.create(),
            ShapeSpec::PinRect(pr) => pr.create(),
            ShapeSpec::PinTexture(pt) => pt.create(),
            ShapeSpec::StretchTexture(st) => st.create(),
            ShapeSpec::Wiggle(w) => w.create(),
            ShapeSpec::PinBox(pb) => pb.create(),
        }
    }
}
