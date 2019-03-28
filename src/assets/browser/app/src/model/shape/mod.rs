mod poly;
mod rect;
mod shapespec;
mod wiggle;

pub use self::shapespec::{ ColourSpec, ShapeSpec, MathsShape };

pub use self::wiggle::{
    stretch_wiggle,
    StretchWiggle,
    StretchWiggleTypeSpec
};

pub use self::poly::{
    pin_mathsshape,
    tape_mathsshape,
    fix_mathsshape,
    page_mathsshape,
    PinPolySpec,
    PolyPosition
};

pub use self::rect::{
    BoxSpec,
    RectPosition,
    RectSpec,
    PinRectTypeSpec,
    StretchRectTypeSpec,
};
