mod core;
mod drawing;

pub use self::core::{ 
    GLDrawing, GLProgs, GLPrinter, GLProgData
};
pub use self::drawing::{
    Drawing, CarriageCanvases, Artist, Artwork, DrawingSpec, 
    bitmap_texture, DrawingHash, FCFont, FontVariety, text_texture,
    collage, mark_rectangle, MarkSpec, OneCanvasManager
};
