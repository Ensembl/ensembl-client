use arena::ArenaData;
use compiler::GLProgram;

use geometry::shader::{ shader_solid, shader_texture };

use wglprog::{
    GLSource,
    Statement,
    Uniform,
    Attribute,
    Phase,
};

fn stretch_prog() -> GLSource {
    GLSource::new(vec! {
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
    })
}

pub fn stretch_geom(adata: &ArenaData) -> GLProgram {
    GLProgram::new(adata,&shader_solid(&stretch_prog()))
}

pub fn stretchtex_geom(adata: &ArenaData) -> GLProgram {
    GLProgram::new(adata,&shader_texture(&stretch_prog()))
}
