#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;

#[macro_use]
mod util;

mod arena;
mod geometry;
mod domutil;
mod canvasutil;
mod wglraw;
mod hosc;
mod hofi;
mod fixx;
mod labl;
mod text;
mod webgl_rendering_context;

use arena::{
    Arena,
    Stage,
};

use stdweb::unstable::TryInto;
use stdweb::web::html_element::CanvasElement;

use hosc::HoscGeometry;
use hofi::HofiGeometry;
use fixx::FixxGeometry;
use labl::LablGeometry;
use text::TextGeometry;

use stdweb::web::CanvasRenderingContext2d;

use stdweb::web::{
    IHtmlElement,
    IEventTarget,
    window,
    document,
    TextBaseline,
    INode,
};

fn main() {
    stdweb::initialize();

    let fc = canvasutil::FlatCanvas::create(200,200);
    let fc_font = fc.new_font("12px serif");
    fc.text("Hello, World!",0,0,&fc_font);
    
    let mut ar = Arena::new("#glcanvas");
    ar.geom_text(&mut |g:&mut TextGeometry| {
        let d = 1.;
        g.rectangle(&[0.,0.],&[0.,-d, d,0.],&[0.17,0.75, 0.92,0.]);
    });
    ar.populate();
    
    let mut stage = Stage::new();
    stage.zoom = 0.1;
    
    ar.animate(&stage);
    
    stdweb::event_loop();
}

