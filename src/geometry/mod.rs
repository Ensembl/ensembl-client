mod stretch;
mod pin;
mod fix;
mod shader;
mod page;

pub use geometry::fix::{ fix_geom, fixtex_geom };
pub use geometry::page::{ page_geom, pagetex_geom };
pub use geometry::pin::{ pin_geom, pintex_geom };
pub use geometry::stretch::{ stretch_geom, stretchtex_geom };
