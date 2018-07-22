use stdweb::web::{
    IHtmlElement,
    IEventTarget,
    window,
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
    canvas.set_width(canvas.offset_width() as u32);
    canvas.set_height(canvas.offset_height() as u32);
    // if it resizes, do it again
    // the enclose! clones canvas, that's then moved into the callback.
    window().add_event_listener(enclose!( (canvas) move |_:ResizeEvent| {
        canvas.set_width(canvas.offset_width() as u32);
        canvas.set_height(canvas.offset_height() as u32);
    }));
    canvas
}

pub fn aspect_ratio(canvas: &CanvasElement) -> f32 {
    canvas.offset_width() as f32 / canvas.offset_height() as f32
}
