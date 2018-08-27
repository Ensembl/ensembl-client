mod stretch;
mod pin;
mod fixpage;
mod shapeimpl;
mod util;

pub use shape::shapeimpl::{
    Shape,
    SolidShapeManager
};

pub use shape::fixpage::{
    fix_rectangle,
    fix_texture,
    page_rectangle,
    page_texture,
};

pub use shape::pin::{
    pin_triangle,
    pin_texture
};

pub use shape::stretch::{
    StretchSpot,
    stretch_rectangle,
    stretch_texture,
    stretchspot_rectangle,
};
