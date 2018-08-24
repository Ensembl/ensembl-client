use stdweb::web::TypedArray;
use stdweb::web::html_element::CanvasElement;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
    GLenum,
    GLint,
};

pub fn prepare_context(canvas: &CanvasElement) -> glctx {
    let context: glctx = canvas.get_context().unwrap();
    context.clear_color(1.0,1.0,1.0,1.0);
    context.clear(glctx::COLOR_BUFFER_BIT);
    context
}

pub fn init_buffer(ctx:&glctx) -> glbuf {
    return ctx.create_buffer().unwrap();
}

pub fn populate_buffer_short(ctx:&glctx, buftype: u32, buf:&glbuf, values:&Vec<u16>) {
    ctx.bind_buffer(buftype,Some(&buf));
    let data = TypedArray::<u16>::from(&(values[..])).buffer();
    ctx.buffer_data_1(buftype,Some(&data),glctx::STATIC_DRAW);
}

fn fix_tex_image2_d_cnv(ctx: &glctx, 
                    target: GLenum, level: GLint, internalformat: GLint,
                    format: GLenum, type_: GLenum, canvas: &CanvasElement) {
    js! {
        @{ctx}.texImage2D(@{target}, @{level}, @{internalformat}, 
                           @{format}, @{type_}, @{canvas});
    };
}

pub fn canvas_texture(ctx: &glctx,cnv : &CanvasElement) -> gltex {
    let texture = ctx.create_texture().unwrap();
    ctx.bind_texture(glctx::TEXTURE_2D, Some(&texture));
    fix_tex_image2_d_cnv(&ctx,
        glctx::TEXTURE_2D,0,glctx::RGBA as i32,
        glctx::RGBA,glctx::UNSIGNED_BYTE,cnv);
    
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_MIN_FILTER,
                       glctx::LINEAR as i32);
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_MAG_FILTER,
                       glctx::LINEAR as i32);
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_WRAP_S,
                       glctx::CLAMP_TO_EDGE as i32);
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_WRAP_T,
                       glctx::CLAMP_TO_EDGE as i32);
    texture    
}
