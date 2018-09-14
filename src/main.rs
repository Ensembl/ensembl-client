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
extern crate serde_json;

#[macro_use]
mod util;

mod debug;
mod arena;
mod controller;
mod shape;
mod canvasutil;
mod campaign;
mod wglraw;
mod alloc;
mod drawing;
mod program;
mod dom;
mod jank;
mod webgl_rendering_context;
mod types;

fn main() {
    stdweb::initialize();
    debug::setup_stage_debug();
    debug!("global","starting");
    stdweb::event_loop();
}

