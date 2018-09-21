use stdweb::web::{
    IHtmlElement,
    Element
};

use stdweb::web::html_element::{
    CanvasElement
};

use stdweb::unstable::TryInto;

use dom::domutil;

// Prepare a canvas ready for WebGL
pub fn prepare_canvas(canvasel: &Element) -> CanvasElement {
    // get canvas
    let canvas: CanvasElement = canvasel.clone().try_into().unwrap();

    // force CSS onto attributes of canvas tag
    let width = canvas.offset_width() as u32;
    let height = canvas.offset_height() as u32;
    let width = width - width % 2;
    let height = height - height % 2;
    canvas.set_width(width);
    canvas.set_height(height);
    // update CSS in px, as %'s are dodgy on canvas tags
    domutil::add_style(&canvasel,"width",&format!("{}px",width));
    domutil::add_style(&canvasel,"height",&format!("{}px",height));
    //window().add_event_listener(enclose!( (canvas) move |_:ResizeEvent| {
    //    canvas.set_width(canvas.offset_width() as u32);
    //    canvas.set_height(canvas.offset_height() as u32);
    //}));
    canvas
}
