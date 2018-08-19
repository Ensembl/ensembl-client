use geometry::GLProgram;
use arena::ArenaData;

use geometry::wglprog::{
    GLSource,
    Statement,
    shader_solid,
    Uniform,
    Attribute,
    Phase,
};

pub fn fix_geom(adata: &ArenaData) -> GLProgram {
        let source = shader_solid(&GLSource::new(vec! {
            Uniform::new("vec2","uSize",Phase::Vertex),
            Attribute::new(2,"aVertexPosition",Phase::Vertex),
            Statement::new("
                gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                                   aVertexPosition.y / uSize.y - 1.0,
                                   0.0, 1.0)",Phase::Vertex)
        }));
        GLProgram::new(adata,&source)
}
