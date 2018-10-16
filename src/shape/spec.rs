use shape::{ PinPolySpec, RectSpec, Shape, TextureSpec };

#[derive(Clone,Debug)]
pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
    PinTexture(TextureSpec)
}

impl ShapeSpec {
    pub fn create(&self) -> Box<Shape> {
        match self {
            ShapeSpec::PinPoly(pp) => pp.create(),
            ShapeSpec::PinRect(pr) => pr.create(),
            ShapeSpec::PinTexture(pt) => pt.create()
        }
    }
}
