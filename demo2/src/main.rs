#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;

mod arena;
mod geometry;
#[macro_use]
mod util;
mod domutil;
mod canvasutil;
mod wglraw;
mod hosc;
mod hofi;
mod fixx;
mod labl;
mod webgl_rendering_context;

use stdweb::web::{
    window
};

use std::cell::RefCell;
use std::rc::Rc;

use arena::{
    Arena,
    Stage,
};


use labl::LablGeometry;

fn main() {
    stdweb::initialize();

    let mut stage = Stage::new();
    stage.zoom = 0.1;

    let mut arena = Arena::new("#canvas");
    arena.geom_labl(&mut |g:&mut LablGeometry| {
        g.triangle([0.,0.],[0.0,0.0, 0.0,0.01, 0.1,0.0]);
        g.triangle([0.,0.],[0.1,0.01, 0.1,0.0, 0.0,0.01]);
    });
    arena.populate();

    arena.animate(&stage);
    stdweb::event_loop();
}

