use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Varying,
    Canvas,
    Stage,
    Precision,
};

fn shader_standard() -> ProgramSource {
    ProgramSource::new(vec! {
        Stage::new()
    })
}

pub fn shader_solid(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Attribute::new(&PR_DEF,3,"aVertexColour"),
            Varying::new(&PR_LOW,"vec3","vColour"),
            Statement::new_vert("vColour = aVertexColour"),
            Statement::new_frag("gl_FragColor = vec4(vColour, 1.0)"),
        })
    )
}

pub fn shader_texture(pos: &ProgramSource) -> ProgramSource {
    shader_standard().merge(pos).merge(
        &ProgramSource::new(vec! {
            Canvas::new("uSampler"),
            Uniform::new_frag(&PR_DEF,"sampler2D","uSampler"),
            Attribute::new(&PR_DEF,2,"aTextureCoord"),
            Varying::new(&PR_DEF,"vec2","vTextureCoord"),
            Statement::new_vert("vTextureCoord = aTextureCoord"),
            Statement::new_frag("gl_FragColor = texture2D(uSampler, vTextureCoord)"),
        })
    )
}

pub static PR_DEF : Precision = Precision(23,16);
pub static PR_LOW : Precision = Precision(5,8);
