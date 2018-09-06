#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
#[macro_use]
extern crate lazy_static;
extern crate rand;

#[macro_use]
mod util;

mod demo;
mod arena;
mod shape;
mod domutil;
mod canvasutil;
mod campaign;
mod wglraw;
mod alloc;
mod drawing;
mod program;
mod dom;
mod webgl_rendering_context;
pub mod coord;

fn main() {
    demo::demo();
}

