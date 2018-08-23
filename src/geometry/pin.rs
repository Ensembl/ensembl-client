use program::Program;

use geometry::shader::{ shader_solid, shader_texture };

use program::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
};

use arena::ArenaData;

fn pin_prog() -> ProgramSource {
    ProgramSource::new(vec! {
        Uniform::new_vert("float","uStageHpos"),
        Uniform::new_vert("float","uStageVpos"),
        Uniform::new_vert("float","uStageZoom"),
        Uniform::new_vert("vec2","uSize"),
        Attribute::new(2,"aVertexPosition"),
        Attribute::new(2,"aOrigin"),
        Statement::new_vert("
            gl_Position = vec4(
                (aOrigin.x - uStageHpos) * uStageZoom + 
                            aVertexPosition.x / uSize.x,
                - (aOrigin.y - uStageVpos + aVertexPosition.y) / uSize.y, 
                0.0, 1.0)")
    })
}

pub fn pin_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_solid(&pin_prog()))
}

pub fn pintex_geom(adata: &ArenaData) -> Program {
    Program::new(adata,&shader_texture(&pin_prog()))
}
