use arena::ArenaData;
use program::Program;

use geometry::common::{
    shader_solid, shader_texture, shader_mono, shader_triangle, 
    shader_strip, PR_DEF
};

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Arity,
};

fn stretch_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageHpos"),
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageVpos"),
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageZoom"),
        Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
        Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
        Statement::new_vert("
            gl_Position = vec4(
                (aVertexPosition.x - uStageHpos) * uStageZoom,
                - (aVertexPosition.y - uStageVpos) / uSize.y,
                0.0, 1.0)")
    })
}

pub fn stretch_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&shader_triangle(),&stretch_prog()))
}

pub fn stretchtex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&shader_triangle(),&stretch_prog()))
}

pub fn stretchspot_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_mono(&shader_triangle(),&stretch_prog()))
}

pub fn stretchstrip_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_mono(&shader_strip(),&stretch_prog()))
}
