mod stretch;
mod shapeimpl;
mod util;
mod canvasidx;
mod spec;
mod rect;
mod poly;
mod wiggle;
mod spot;
mod texture;

pub use self::shapeimpl::{
    Shape, DrawnShape,
    ColourSpec,
    MathsShape,
};

pub use self::canvasidx::CanvasIdx;

pub use self::texture::{
    fix_texture,
    fixunderpage_texture,
    fixundertape_texture,
    page_texture,
    pin_texture,
    tape_texture,
    TextureSpec
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

pub use self::stretch::{
    stretch_texture,
    StretchTextureSpec
};

use self::spec::ShapeSpec;
pub use self::spot::Spot;
