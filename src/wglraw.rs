use stdweb::web::TypedArray;
use stdweb::web::html_element::CanvasElement;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
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

pub fn prepare_shaders(context:&glctx, vert_src:&str, frag_src:&str) -> glprog {
    let vert_shader = context.create_shader(glctx::VERTEX_SHADER).unwrap();
    context.shader_source(&vert_shader, vert_src);
    context.compile_shader(&vert_shader);

    let frag_shader = context.create_shader(glctx::FRAGMENT_SHADER).unwrap();
    context.shader_source(&frag_shader, frag_src);
    context.compile_shader(&frag_shader);

    let shader_program = context.create_program().unwrap();
    context.attach_shader(&shader_program, &vert_shader);
    context.attach_shader(&shader_program, &frag_shader);
    context.link_program(&shader_program);
    
    shader_program
}

pub fn init_buffer(ctx:&glctx) -> glbuf {
    return ctx.create_buffer().unwrap();
}

pub fn populate_buffer(ctx:&glctx, buftype: u32, buf:&glbuf, values:&Vec<f32>) {
    ctx.bind_buffer(buftype,Some(&buf));
    let data = TypedArray::<f32>::from(&(values[..])).buffer();
    ctx.buffer_data_1(buftype,Some(&data),glctx::STATIC_DRAW);
}

pub fn link_buffer(ctx:&glctx, prog:&glprog, name:&str, step:i8, buf:&glbuf) {
    let loc = ctx.get_attrib_location(&prog,&name) as u32;
    ctx.enable_vertex_attrib_array(loc);
    ctx.bind_buffer(glctx::ARRAY_BUFFER,Some(&buf));
    ctx.vertex_attrib_pointer(loc, step as i32, glctx::FLOAT, false, 0, 0) ;
}

pub fn set_uniform_1f(ctx:&glctx, prog:&glprog, name:&str, value: f32) {
    let loc = ctx.get_uniform_location(&prog,&name);
    if loc.is_some() {
        ctx.uniform1f(Some(&loc.unwrap()),value);
    }
}

pub fn set_uniform_1i(ctx:&glctx, prog:&glprog, name:&str, value: i32) {
    let loc = ctx.get_uniform_location(&prog,&name);
    if loc.is_some() {
        ctx.uniform1i(Some(&loc.unwrap()),value);
    }
}

pub fn set_uniform_2f(ctx:&glctx, prog:&glprog, name:&str, value: [f32;2]) {
    let loc = ctx.get_uniform_location(&prog,&name);
    if loc.is_some() {
        ctx.uniform2f(Some(&loc.unwrap()),value[0],value[1]);
    }
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
                       glctx::NEAREST as i32);
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_WRAP_S,
                       glctx::CLAMP_TO_EDGE as i32);
    ctx.tex_parameteri(glctx::TEXTURE_2D,
                       glctx::TEXTURE_WRAP_T,
                       glctx::CLAMP_TO_EDGE as i32);
    texture    
}
