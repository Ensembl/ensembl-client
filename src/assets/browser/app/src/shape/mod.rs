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
mod boxshape;

pub use self::shapeimpl::{
    Shape, DrawnShape,
    ColourSpec,
    MathsShape,
};

pub use self::canvasidx::CanvasIdx;

pub use self::texture::{
    TextureSpec,
    TextureData,
    TextureTypeSpec
};

pub use self::rect::{
    RectSpec,
    PinRectTypeSpec,
    StretchRectTypeSpec,
    RectData
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
    StretchWiggle
};

pub use self::stretch::{
    stretch_texture,
    StretchTextureSpec
};

pub use self::boxshape::BoxSpec;

pub use self::spec::ShapeSpec;
pub use self::spot::Spot;
