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

fn shader_standard() -> ProgramSource {
    ProgramSource::new(vec! {
        Main::new(),
    })
}

pub fn shader_mono(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Uniform::new_frag(&PR_LOW,Arity::Vec3,"uColour"),
            Statement::new_frag("gl_FragColor = vec4(uColour, 1.0)"),
        })
    )
}

pub fn shader_solid(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Attribute::new(&PR_LOW,Arity::Vec3,"aVertexColour"),
            Varying::new(&PR_LOW,Arity::Vec3,"vColour"),
            Statement::new_vert("vColour = vec3(aVertexColour)"),
            Statement::new_frag("gl_FragColor = vec4(vColour, 1.0)"),
        })
    )
}

pub fn shader_texture(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
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

pub static PR_DEF : Precision = Precision::Float(23,16);
pub static PR_LOW : Precision = Precision::Float(5,8);
