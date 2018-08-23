use program::Program;
use arena::ArenaData;

use geometry::shader::{ shader_solid, shader_texture };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
};

fn page_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert("vec2","uSize"),
        Uniform::new_vert("float","uStageVpos"),
        Attribute::new(2,"aVertexPosition"),
        Statement::new_vert("
            gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                               - (aVertexPosition.y - uStageVpos) / uSize.y, 
                               0.0, 1.0)")
    })
}

pub fn page_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&page_prog()))

}

pub fn pagetex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&page_prog()))
}
