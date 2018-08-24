use program::Program;
use arena::ArenaData;

use geometry::common::{ shader_solid, shader_texture, PR_DEF };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
};

fn page_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert(&PR_DEF,"vec2","uSize"),
        Uniform::new_vert(&PR_DEF,"float","uStageVpos"),
        Attribute::new(&PR_DEF,2,"aVertexPosition"),
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
