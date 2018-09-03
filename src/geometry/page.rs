use arena::ArenaData;
use program::Program;

use geometry::common::{
    PTGeom, PTMethod, PTSkin, ProgramType
};

pub fn page_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Page,PTMethod::Triangle,PTSkin::Colour).to_program(adata)
}

pub fn pagetex_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Page,PTMethod::Triangle,PTSkin::Texture).to_program(adata)
}
