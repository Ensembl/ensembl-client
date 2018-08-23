use program::Program;
use arena::ArenaData;

use geometry::common::{ shader_solid, shader_texture, PR_DEF };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
};

fn fix_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert("vec2","uSize"),
        Attribute::new(&PR_DEF,2,"aVertexPosition"),
        Statement::new_vert("
            gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                               1.0 - aVertexPosition.y / uSize.y,
                               0.0, 1.0)")
    })
}

pub fn fix_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&fix_prog()))

}

pub fn fixtex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&fix_prog()))
}
