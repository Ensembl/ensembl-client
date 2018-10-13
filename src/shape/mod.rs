mod stretch;
mod pintape;
mod fixpage;
mod shapeimpl;
mod util;
mod canvasidx;
mod canvasidx2;
mod spec;
mod rect;
mod poly;
mod wiggle;
mod spot;

pub use self::shapeimpl::{
    Shape, DrawnShape,
    ShapeContext,
    ColourSpec,
    MathsShape,
};

pub use self::canvasidx::CanvasIdx;
pub use self::canvasidx2::CanvasIdx2;

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
    fix_mathsshape,
    page_mathsshape,
    PinPolySpec,
};

pub use shape::wiggle::{
    stretch_wiggle,
};

pub use self::pintape::{
    pin_texture,
    tape_texture,
};

pub use self::stretch::{
    stretch_texture,
};

use self::spec::ShapeSpec;
pub use self::spot::Spot;
