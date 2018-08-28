use webgl_rendering_context::{
    WebGLRenderingContext as glctx
};

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Varying,
    Canvas,
    Main,
    Precision,
    Arity,
};

pub fn shader_triangle() -> ProgramSource {
    ProgramSource::new(vec! {
        Main::new(glctx::TRIANGLES),
    })
}

pub fn shader_strip() -> ProgramSource {
    ProgramSource::new(vec! {
        Main::new(glctx::TRIANGLE_STRIP),
    })
}

pub fn shader_mono(method: &ProgramSource, pos: &ProgramSource) -> ProgramSource {
    method.merge(pos).merge(
        &ProgramSource::new(vec! {
            Uniform::new_frag(&PR_LOW,Arity::Vec3,"uColour"),
            Statement::new_frag("gl_FragColor = vec4(uColour, 1.0)"),
        })
    )
}

pub fn shader_solid(method: &ProgramSource, pos: &ProgramSource) -> ProgramSource {
    method.merge(pos).merge(
        &ProgramSource::new(vec! {
            Attribute::new(&PR_LOW,Arity::Vec3,"aVertexColour"),
            Varying::new(&PR_LOW,Arity::Vec3,"vColour"),
            Statement::new_vert("vColour = vec3(aVertexColour)"),
            Statement::new_frag("gl_FragColor = vec4(vColour, 1.0)"),
        })
    )
}

pub fn shader_texture(method: &ProgramSource, pos: &ProgramSource) -> ProgramSource {
    method.merge(pos).merge(
        &ProgramSource::new(vec! {
            Canvas::new(),
            Uniform::new_frag(&PR_DEF,Arity::Sampler2D,"uSampler"),
            Attribute::new(&PR_DEF,Arity::Vec2,"aTextureCoord"),
            Varying::new(&PR_DEF,Arity::Vec2,"vTextureCoord"),
            Statement::new_vert("vTextureCoord = aTextureCoord"),
            Statement::new_frag("gl_FragColor = texture2D(uSampler, vTextureCoord)"),
        })
    )
}

pub static PR_DEF : Precision = Precision::Float(25,16);
pub static PR_LOW : Precision = Precision::Float(5,8);
