mod stretch;
mod pin;
mod fixpage;
mod shapeimpl;
mod util;

pub use shape::shapeimpl::{
    Shape,
    ShapeContext,
    Spot,
    ColourSpec,
    MathsShape,
};

pub use shape::fixpage::{
    fix_rectangle,
    fix_texture,
    page_rectangle,
    page_texture,
};

pub use shape::pin::{
    pin_texture,
    pin_mathsshape,
};

pub use shape::stretch::{
    stretch_rectangle,
    stretch_texture,
    stretch_wiggle,
};
