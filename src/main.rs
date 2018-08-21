#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
extern crate rand;

#[macro_use]
mod util;

mod demo;
mod arena;
mod geometry;
mod shape;
mod domutil;
mod canvasutil;
mod wglraw;
mod alloc;
mod texture;
mod program;
mod webgl_rendering_context;
pub mod coord;

fn main() {
    demo::demo();
}

