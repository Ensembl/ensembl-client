use shape::{ PinPolySpec, RectSpec, Shape, TextureSpec, StretchTextureSpec };

#[derive(Clone,Debug)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
    PinTexture(TextureSpec),
    StretchTexture(StretchTextureSpec)
}

impl ShapeSpec {
    pub fn create(&self) -> Box<Shape> {
        match self {
            ShapeSpec::PinPoly(pp) => pp.create(),
            ShapeSpec::PinRect(pr) => pr.create(),
            ShapeSpec::PinTexture(pt) => pt.create(),
            ShapeSpec::StretchTexture(st) => st.create(),
        }
    }
}
