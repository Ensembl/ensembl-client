#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
#[macro_use]
extern crate lazy_static;
extern crate rand;
extern crate separator;
extern crate itertools;

#[macro_use]
extern crate serde_json;

#[macro_use]
mod util;
mod debug;
mod controller;
mod shape;
mod composit;
mod wglraw;
mod drawing;
mod program;
mod dom;
mod webgl_rendering_context;
mod types;
mod print;
mod thisbuild;

use controller::global;

fn main() {
    stdweb::initialize();
    global::setup_global();
    debug!("global","{}",thisbuild::build_summary());
    console!("{}",thisbuild::build_summary());
    stdweb::event_loop();
}
