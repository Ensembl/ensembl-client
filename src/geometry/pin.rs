use program::Program;

use geometry::shader::{ shader_solid, shader_texture };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Phase,
};

use arena::ArenaData;

fn pin_prog() -> ProgramSource {
    ProgramSource::new(vec! {
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
    })
}

pub fn pin_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&pin_prog()))
}

pub fn pintex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&pin_prog()))
}
