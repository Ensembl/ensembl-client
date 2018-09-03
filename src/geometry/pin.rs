use arena::ArenaData;
use program::Program;

use geometry::common::{
    PTGeom, PTMethod, PTSkin, ProgramType
};

pub fn pin_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Colour).to_program(adata)
}

pub fn pintex_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Texture).to_program(adata)
}

pub fn pinspot_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Spot).to_program(adata)
}

pub fn pinstrip_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Pin,PTMethod::Strip,PTSkin::Colour).to_program(adata)
}

pub fn pinstripspot_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Pin,PTMethod::Strip,PTSkin::Spot).to_program(adata)
}
