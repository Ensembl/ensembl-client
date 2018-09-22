mod alloc;
mod text;
mod bitmap;
mod collage;
mod drawingimpl;
mod flatcanvas;

pub use drawing::drawingimpl::{
    Drawing, Artist, Artwork, LeafDrawingManager,
};

pub use drawing::text::text_texture;
pub use drawing::bitmap::bitmap_texture;
pub use drawing::collage::{
    mark_rectangle,
    collage,
    Mark
};
pub use drawing::flatcanvas::{ FlatCanvas, FCFont, FontVariety };
