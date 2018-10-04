mod alloc;
mod text;
mod bitmap;
mod collage;
mod onecanvasman;
mod flatcanvas;
mod drawing;
mod artist;
mod allcanvasman;

pub use self::artist::Artist;

pub use self::drawing::{ Drawing, Artwork };

pub use self::allcanvasman::AllCanvasMan;

pub use self::onecanvasman::{
    FlatCanvasManager, DrawingHash
};

pub use self::text::text_texture;
pub use self::bitmap::bitmap_texture;
pub use self::collage::{ mark_rectangle, collage, Mark };
pub use self::flatcanvas::{ FlatCanvas, FCFont, FontVariety };
