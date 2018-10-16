use shape::{ PinPolySpec, RectSpec, Shape, TextureSpec, StretchTextureSpec, StretchWiggle };

#[derive(Clone,Debug)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
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
            ShapeSpec::Wiggle(w) => w.create()
        }
    }
}
