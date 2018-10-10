use shape::{ PinPolySpec, RectSpec, Shape };

pub enum ShapeSpec {
    PinPoly(PinPolySpec),
    PinRect(RectSpec),
}

impl ShapeSpec {
    pub fn create(&self) -> Box<Shape> {
        match self {
            ShapeSpec::PinPoly(pp) => pp.create(),
            ShapeSpec::PinRect(pr) => pr.create(),
        }
    }
}
