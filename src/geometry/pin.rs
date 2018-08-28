use geometry::common::{ shader_solid, shader_texture, shader_mono, PR_DEF, shader_triangle };

use program::{
    Program,
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Arity,
};

use arena::ArenaData;

fn pin_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageHpos"),
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageVpos"),
        Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageZoom"),
        Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
        Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
        Attribute::new(&PR_DEF,Arity::Vec2,"aOrigin"),
        Statement::new_vert("
            gl_Position = vec4(
                (aOrigin.x - uStageHpos) * uStageZoom + 
                            aVertexPosition.x / uSize.x,
                - (aOrigin.y - uStageVpos + aVertexPosition.y) / uSize.y, 
                0.0, 1.0)")
    })
}

pub fn pin_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&shader_triangle(),&pin_prog()))
}

pub fn pintex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&shader_triangle(),&pin_prog()))
}

pub fn pinspot_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_mono(&shader_triangle(),&pin_prog()))
}
