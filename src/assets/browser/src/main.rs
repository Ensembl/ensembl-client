#![feature(non_ascii_idents)]
// (help put the E into EMBL)

#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde_json;
extern crate rand;
extern crate separator;
extern crate itertools;
extern crate hsl;

#[macro_use]
mod util;

mod controller;
mod composit;
mod debug;
mod dom;
mod drawing;
mod print;
mod program;
mod shape;
mod tánaiste;
mod types;

use controller::global;
use util::build_summary;

fn main() {
    stdweb::initialize();
    global::setup_global();
    debug!("global","{}",build_summary());
    console!("{}",build_summary());
    stdweb::event_loop();
}
