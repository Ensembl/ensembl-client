use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Phase,
    Varying,
    Canvas,
    Stage,
};

fn shader_standard() -> ProgramSource {
    ProgramSource::new(vec! {
        Stage::new()
    })
}

pub fn shader_solid(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Attribute::new(3,"aVertexColour",Phase::Vertex),
            Varying::new("lowp","vec3","vColour"),
            Statement::new("vColour = aVertexColour",Phase::Vertex),
            Statement::new("gl_FragColor = vec4(vColour, 1.0)",Phase::Fragment),
        })
    )
}

pub fn shader_texture(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Canvas::new("uSampler"),
            Uniform::new("sampler2D","uSampler",Phase::Fragment),
            Attribute::new(2,"aTextureCoord",Phase::Vertex),
            Varying::new("highp","vec2","vTextureCoord"),
            Statement::new("vTextureCoord = aTextureCoord",Phase::Vertex),
            Statement::new("gl_FragColor = texture2D(uSampler, vTextureCoord)",Phase::Fragment),
        })
    )
}
