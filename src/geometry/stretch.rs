use arena::ArenaData;
use program::Program;

use geometry::common::{
    PTGeom, PTMethod, PTSkin, ProgramType
};

pub fn stretch_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Stretch,PTMethod::Triangle,PTSkin::Colour).to_program(adata)
}

pub fn stretchtex_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Stretch,PTMethod::Triangle,PTSkin::Texture).to_program(adata)
}

pub fn stretchspot_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Stretch,PTMethod::Triangle,PTSkin::Spot).to_program(adata)
}

pub fn stretchstrip_geom(adata: &ArenaData) -> Program {
    ProgramType(PTGeom::Stretch,PTMethod::Strip,PTSkin::Spot).to_program(adata)
}
