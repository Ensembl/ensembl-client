mod stretch;
mod glshape;
mod util;
mod canvasidx;
mod rect;
mod poly;
mod spot;
mod texture;
mod glshapebox;
mod glwiggle;

pub use self::glshape::GLShape;

pub use self::util::{
    TypeToShape,
    ShapeInstanceData,
    ShapeInstanceDataType,
    ShapeShortInstanceData,
    ShapeLongInstanceData,
    Facade, FacadeType,
    rectangle_g, rectangle_t, vertices_rect,
    colourspec_to_group
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

pub use self::stretch::{
    stretch_texture,
    StretchTextureSpec
};

pub use self::spot::Spot;
