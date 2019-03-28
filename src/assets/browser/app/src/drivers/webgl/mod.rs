mod core;
mod drawing;
mod shape;

pub use self::core::{ 
    GLDrawing, GLProgs, GLPrinter, GLProgData
};
pub use self::drawing::{
    Drawing, CarriageCanvases, Artist, Artwork,
    FCFont, FontVariety, Mark,
    collage, mark_rectangle, OneCanvasManager
};
pub use self::shape::{
    FacadeType, ShapeInstanceDataType,
    ShapeLongInstanceData,
    stretch_texture,
    ShapeInstanceData, TypeToShape, Facade, ShapeShortInstanceData,
    rectangle_g, rectangle_t, vertices_rect,
    GLShape, StretchTextureSpec,
};
