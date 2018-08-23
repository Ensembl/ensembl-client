use program::Program;
use arena::ArenaData;

use geometry::shader::{ shader_solid, shader_texture };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Phase,
};

fn page_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new("vec2","uSize",Phase::Vertex),
        Uniform::new("float","uStageVpos",Phase::Vertex),
        Attribute::new(2,"aVertexPosition",Phase::Vertex),
        Statement::new("
            gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                               - (aVertexPosition.y - uStageVpos) / uSize.y, 
                               0.0, 1.0)",Phase::Vertex)
    })
}

pub fn page_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&page_prog()))

}

pub fn pagetex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&page_prog()))
}
