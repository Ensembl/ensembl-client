use super::{ GLShape };

use super::super::program::{ ProgramType, ProgramAttribs };
use drivers::webgl::{ GLProgData, Artwork };
use model::shape::{ ZMenuRectSpec };

impl GLShape for ZMenuRectSpec {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut GLProgData) {
    }
    
    fn get_geometry(&self) -> Option<ProgramType> { 
        None
    }
}
