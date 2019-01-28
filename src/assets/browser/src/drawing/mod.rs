mod alloc;
mod text;
mod bitmap;
mod collage;
mod onecanvasman;
mod flatcanvas;
mod drawing;
mod artist;
mod canvasalloc;
mod drawingsession;
mod spec;

pub use self::artist::Artist;

pub use self::drawing::{ Drawing, Artwork };
pub use self::drawingsession::DrawingSession;
pub use self::canvasalloc::{ CanvasRemover, AllCanvasAllocator };

pub use self::onecanvasman::{
    OneCanvasManager, DrawingHash
};

pub use self::text::{ text_texture, TextArtist };
pub use self::bitmap::{ bitmap_texture, BitmapArtist };
pub use self::collage::{ mark_rectangle, collage, Mark, MarkSpec, CollageArtist };
pub use self::flatcanvas::{ FlatCanvas, FCFont, FontVariety };
pub use self::spec::{ DrawingSpec };
