mod core;
mod drawing;
mod shape;

pub use self::core::{ 
    GLDrawing, GLProgs, GLPrinter, GLProgData
};
pub use self::drawing::{
    Drawing, CarriageCanvases, Artist, Artwork, DrawingSpec, 
    bitmap_texture, DrawingHash, FCFont, FontVariety, text_texture,
    collage, mark_rectangle, MarkSpec, OneCanvasManager
};
pub use self::shape::{
    FacadeType, ShapeInstanceDataType,
    ShapeLongInstanceData, StretchWiggleTypeSpec,
    tape_mathsshape,
    pin_mathsshape,
    stretch_texture, stretch_wiggle,
    fix_mathsshape, page_mathsshape,
    PinRectTypeSpec, StretchRectTypeSpec, TextureTypeSpec,
    ShapeInstanceData, TypeToShape, Facade, ShapeShortInstanceData,
    rectangle_g, rectangle_t, vertices_rect,
    PinPolySpec, RectSpec, GLShape, TextureSpec, StretchTextureSpec,
    StretchWiggle, BoxSpec,
};
