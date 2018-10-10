mod stretch;
mod pintape;
mod fixpage;
mod shapeimpl;
mod spot;
mod util;
mod canvasidx;
mod spec;
mod rect;
mod poly;

pub use self::shapeimpl::{
    Shape, DrawnShape,
    ShapeContext,
    ColourSpec,
    MathsShape,
};

pub use self::spot::Spot;
pub use self::canvasidx::CanvasIdx;

pub use self::fixpage::{
    fix_texture,
    fixunderpage_texture,
    fixundertape_texture,
    page_texture,
};

pub use self::rect::{
    pin_rectangle,
    fix_rectangle,
    page_rectangle,
    fixunderpage_rectangle,
    fixundertape_rectangle,
    tape_rectangle,
    stretch_rectangle,
    RectSpec
};

pub use shape::poly::{
    pin_mathsshape,
    tape_mathsshape,
    PinPolySpec,
};

pub use self::pintape::{
    pin_texture,
    tape_texture,
};

pub use self::stretch::{
    stretch_texture,
    stretch_wiggle,
};

use self::spec::ShapeSpec;
