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
    ShapeLongInstanceData,
    stretch_texture,
    PinRectTypeSpec, StretchRectTypeSpec, TextureTypeSpec,
    ShapeInstanceData, TypeToShape, Facade, ShapeShortInstanceData,
    rectangle_g, rectangle_t, vertices_rect,
    RectSpec, GLShape, TextureSpec, StretchTextureSpec,
};
