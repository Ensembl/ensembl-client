use arena::ArenaData;
use geometry::GLProgram;

use geometry::wglprog::{
    Statement,
    GLSource,
    shader_texture,
    Uniform,
    Attribute,
    Phase,
};

pub fn pintex_geom(adata: &ArenaData) -> GLProgram {
    let source = shader_texture(&GLSource::new(vec! {
        Uniform::new("float","uStageHpos",Phase::Vertex),
        Uniform::new("float","uStageVpos",Phase::Vertex),
        Uniform::new("float","uStageZoom",Phase::Vertex),
        Uniform::new("vec2","uSize",Phase::Vertex),
        Attribute::new(2,"aVertexPosition",Phase::Vertex),
        Attribute::new(2,"aOrigin",Phase::Vertex),
        Statement::new("
             gl_Position = vec4(
                (aOrigin.x - uStageHpos) * uStageZoom + 
                            aVertexPosition.x / uSize.x,
                (aOrigin.y - uStageVpos) / uSize.y + 
                            aVertexPosition.y / uSize.y,
                0.0, 1.0)",Phase::Vertex)
    }));
    GLProgram::new(adata,&source)
}
