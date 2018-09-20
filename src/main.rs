#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
#[macro_use]
extern crate lazy_static;
extern crate rand;
extern crate num;

#[macro_use]
extern crate serde_json;

#[macro_use]
mod util;

mod debug;
mod arena;
mod controller;
mod shape;
mod canvasutil;
mod composit;
mod wglraw;
mod alloc;
mod drawing;
mod program;
mod dom;
mod webgl_rendering_context;
mod types;
mod stage;

fn main() {
    stdweb::initialize();
    debug::setup_stage_debug();
    debug!("global","starting");
    stdweb::event_loop();
}

