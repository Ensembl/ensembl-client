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

#[derive(Clone)]
pub struct FCFont {
    spec: String,
    height: u32,
    xpad: u32,
    ypad: u32,
}

impl FCFont {
    pub fn new(size : u32,family: &str) -> FCFont {
        FCFont { spec: format!("{}px {}",size,family),
                 height: size, ypad: 2, xpad: 0 }
    }
    
    fn setup(&self, canvas : &CanvasRenderingContext2d) {
        canvas.set_font(&self.spec);
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
        //context.set_fill_style_color("green");
        //context.fill_rect(0.,0.,width.into(),height.into());
        context.set_fill_style_color("black");
        FlatCanvas { canvas, context, height, width }
    }
    
    pub fn text(&self,text : &str,x : u32, y: u32, font: &FCFont) -> (u32,u32) {
        font.setup(&self.context);
        self.context.set_text_baseline(TextBaseline::Top);
        self.context.fill_text(text,(x+font.xpad).into(),(y+font.ypad).into(),None);
        let m = self.context.measure_text(text);
        let width_px = m.unwrap().get_width().ceil() as u32;
        let height_px = font.height;
        (width_px+2*font.xpad,height_px+2*font.ypad)
    }
    
    pub fn element(&self) -> &CanvasElement {
        &self.canvas
    }
    
    pub fn prop_x(&self,x: u32) -> f32 {
        (x as f64 / self.width as f64) as f32
    }

    pub fn prop_y(&self,y: u32) -> f32 {
        (y as f64 / self.height as f64) as f32
    }

}
