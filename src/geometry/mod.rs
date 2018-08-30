mod stretch;
mod pin;
mod fix;
mod common;
mod page;

pub use geometry::fix::{ fix_geom, fixtex_geom };
pub use geometry::page::{ page_geom, pagetex_geom };

pub use geometry::pin::{
    pin_geom,
    pintex_geom, 
    pinspot_geom,
    pinstrip_geom,
    pinstripspot_geom,
};

pub use geometry::stretch::{
    stretch_geom,
    stretchtex_geom,
    stretchspot_geom,
    stretchstrip_geom,
};
