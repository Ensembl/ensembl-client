mod alloc;
mod text;
mod bitmap;
mod collage;
mod onecanvasman;
mod flatcanvas;
mod drawing;
mod artist;
mod canvasalloc;
mod carriagecanvases;

pub use self::artist::{ Artist, Mark };

pub use self::drawing::{ Drawing, Artwork };
pub use self::carriagecanvases::CarriageCanvases;
pub use self::canvasalloc::{ CanvasRemover, AllCanvasAllocator };

pub use self::onecanvasman::OneCanvasManager;

pub use self::collage::{ mark_rectangle, collage };
pub use self::flatcanvas::{ FlatCanvas, FCFont, FontVariety };
