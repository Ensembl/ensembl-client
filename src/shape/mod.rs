mod stretch;
mod pintape;
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
    fixunderpage_rectangle,
    fixunderpage_texture,
    fixundertape_rectangle,
    fixundertape_texture,
    page_rectangle,
    page_texture,
};

pub use shape::pintape::{
    pin_rectangle,
    pin_texture,
    pin_mathsshape,
    tape_rectangle,
    tape_texture,
    tape_mathsshape,
};

pub use shape::stretch::{
    stretch_rectangle,
    stretch_texture,
    stretch_wiggle,
};
