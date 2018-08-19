use arena::ArenaData;
use geometry::GLProgram;

use geometry::wglprog::{
    GLSource,
    Statement,
    shader_solid,
    Uniform,
    Attribute,
    Phase,
};

pub fn stretch_geom(adata: &ArenaData) -> GLProgram {
    let source = shader_solid(&GLSource::new(vec! {
        Uniform::new("float","uStageHpos",Phase::Vertex),
        Uniform::new("float","uStageVpos",Phase::Vertex),
        Uniform::new("float","uStageZoom",Phase::Vertex),
        Uniform::new("vec2","uSize",Phase::Vertex),
        Attribute::new(2,"aVertexPosition",Phase::Vertex),
        Statement::new("
            gl_Position = vec4(
                (aVertexPosition.x - uStageHpos) * uStageZoom,
                (aVertexPosition.y - uStageVpos) / uSize.y,
                0.0, 1.0)",Phase::Vertex)
    }));
    GLProgram::new(adata,&source)
}
