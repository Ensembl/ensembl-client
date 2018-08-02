#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;

#[macro_use]
mod util;

mod alloc;
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
    ArenaSpec,
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

    let fc_font = canvasutil::FCFont::new(12,"serif");
    let a_spec = ArenaSpec::new();
    let mut ar = Arena::new("#glcanvas",a_spec);
    ar.geom_text(&mut |g:&mut TextGeometry| {
        g.text(&[-1.,-1.],"Hello, World!",&fc_font);
        g.text(&[0.,-1.],"Goodbye, World!",&fc_font);
        g.text(&[-1.,0.],"Goodbye, Mars!",&fc_font);
        g.text(&[0.,0.],"Hello, Mars!",&fc_font);
        g.text(&[-0.5,-0.5],"X",&fc_font);
        g.text(&[-0.27,-0.27],"Boo!",&fc_font);
        g.text(&[-0.27,-0.5],"BRCA2",&fc_font);
        g.text(&[-1.,-0.5],"FOXP2",&fc_font);
        g.text(&[0.1,-0.3],"sausages",&fc_font);
    });
    ar.populate();
    
    let mut stage = Stage::new();
    stage.hpos = -0.01;
    ar.settle(&mut stage);
    
    ar.animate(&stage);
    
    stdweb::event_loop();
}

