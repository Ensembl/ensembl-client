use arena::ArenaData;
use program::Program;

use geometry::common::{
    PTGeom, PTMethod, PTSkin, ProgramType
};

pub fn fix_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Fix,PTMethod::Triangle,PTSkin::Colour).to_program(adata)
}

pub fn fixtex_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Fix,PTMethod::Triangle,PTSkin::Texture).to_program(adata)
}
