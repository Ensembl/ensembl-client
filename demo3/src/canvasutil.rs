use stdweb::web::{
    IHtmlElement,
    IEventTarget,
    window,
    INode,
    TextBaseline,
    CanvasRenderingContext2d,
    document,
};

use stdweb::web::html_element::CanvasElement;
use stdweb::web::event::ResizeEvent;

use stdweb::unstable::TryInto;

use domutil;

// Prepare a canvas ready for WebGL
pub fn prepare_canvas(sel: &str) -> CanvasElement {
    // get canvas
    let canvas: CanvasElement = domutil::query_select(sel).try_into().unwrap();
    // force CSS onto attributes of canvas tag
    //canvas.set_width(canvas.offset_width() as u32);
    //canvas.set_height(canvas.offset_height() as u32);
    // if it resizes, do it again
    // the enclose! clones canvas, that's then moved into the callback.
    //window().add_event_listener(enclose!( (canvas) move |_:ResizeEvent| {
    //    canvas.set_width(canvas.offset_width() as u32);
    //    canvas.set_height(canvas.offset_height() as u32);
    //}));
    canvas
}

pub fn aspect_ratio(canvas: &CanvasElement) -> f32 {
    canvas.offset_width() as f32 / canvas.offset_height() as f32
}

pub struct FCFont<'a> {
    spec: &'a str,
}

impl<'a> FCFont<'a> {
    fn new(spec: &'a str) -> FCFont {
        FCFont { spec }
    }
    
    fn setup(&self, canvas : &CanvasRenderingContext2d) {
        canvas.set_font(self.spec);
    }
}

pub struct FlatCanvas {
    canvas: CanvasElement,
    context : CanvasRenderingContext2d,
    width: u32,
    height: u32,
}

impl FlatCanvas {
    pub fn create(width: u32,height: u32) -> FlatCanvas {
        let canvas_holder = domutil::query_select("#managedcanvasholder");
        let canvas : CanvasElement = document().create_element("canvas").ok().unwrap().try_into().unwrap();
        canvas_holder.append_child(&canvas);
        canvas.set_width(width);
        canvas.set_height(height);
        let context : CanvasRenderingContext2d = canvas.get_context().unwrap();
        context.set_fill_style_color("green");
        context.fill_rect(0.,0.,200.,200.);
        context.set_fill_style_color("black");
        FlatCanvas { canvas, context, height, width }
    }
    
    pub fn new_font<'a>(&self,spec : &'a str) -> FCFont<'a> {
        FCFont::new(spec)
    }
    
    pub fn text(&self,text : &str,x : u32, y: u32, font: &FCFont) {
        font.setup(&self.context);
        self.context.set_text_baseline(TextBaseline::Top);
        self.context.fill_text(text,x.into(),y.into(),None);
    }
}
