use stdweb::unstable::TryInto;
use stdweb::web::html_element::CanvasElement;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
};

fn get_context(canvas: &CanvasElement) -> glctx {
    (js! {
        return @{canvas.as_ref()}.getContext("webgl",{ antialias: true });
    }).try_into().ok().unwrap()
}

pub fn prepare_context(canvas: &CanvasElement) -> glctx {
    let context: glctx = get_context(canvas);
    context.clear_color(1.0,1.0,1.0,1.0);
    //context.color_mask(false,false,false,true);
    context.clear(glctx::COLOR_BUFFER_BIT  | glctx::DEPTH_BUFFER_BIT);
    context
}

pub fn init_buffer(ctx:&glctx) -> glbuf {
    return ctx.create_buffer().unwrap();
}
