mod shapespec;
mod wiggle;

pub use self::shapespec::{ BoxSpec, ColourSpec, ShapeSpec, MathsShape };

pub use self::wiggle::{
    stretch_wiggle,
    StretchWiggle,
    StretchWiggleTypeSpec
};
