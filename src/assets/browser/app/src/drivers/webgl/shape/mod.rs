mod stretch;
mod shapeimpl;
mod util;
mod canvasidx;
mod rect;
mod poly;
mod wiggle;
mod spot;
mod texture;
mod boxshape;

pub use self::shapeimpl::{
    GLShape,
    ColourSpec,
    MathsShape,
};

pub use self::util::{
    TypeToShape,
    ShapeInstanceData,
    ShapeInstanceDataType,
    ShapeShortInstanceData,
    ShapeLongInstanceData,
    Facade, FacadeType,
    rectangle_g, rectangle_t, vertices_rect
};

pub use self::canvasidx::CanvasIdx;

pub use self::texture::{
    TextureSpec,
    TextureTypeSpec
};

pub use self::rect::{
    RectSpec,
    PinRectTypeSpec,
    StretchRectTypeSpec,
};

pub use self::poly::{
    pin_mathsshape,
    tape_mathsshape,
    fix_mathsshape,
    page_mathsshape,
    PinPolySpec,
};

pub use self::wiggle::{
    stretch_wiggle,
    StretchWiggle,
    StretchWiggleTypeSpec
};

pub use self::stretch::{
    stretch_texture,
    StretchTextureSpec
};

pub use self::boxshape::BoxSpec;

pub use self::spot::Spot;
