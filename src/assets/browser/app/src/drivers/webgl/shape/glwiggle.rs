use types::{ CLeaf, Colour, cleaf };

use super::{ GLShape };
use super::util::{
    Facade, FacadeType, points_g, ShapeLongInstanceData, 
    ShapeInstanceData, TypeToShape, vertices_strip, 
    ShapeInstanceDataType, colourspec_to_group
};

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };
use drivers::webgl::{ GLProgData, Artwork };
use model::shape::{ ColourSpec, ShapeSpec, StretchWiggle };

impl GLShape for StretchWiggle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut GLProgData) {
        let dg = colourspec_to_group(&ColourSpec::Spot(self.group),geom,e);
        let b = vertices_strip(geom,self.points.len() as u16*2,dg);
        points_g(b,geom,"aVertexPosition",&self.points,self.y);
    }
    
    fn get_geometry(&self) -> ProgramType { 
        ProgramType(PTGeom::Stretch,PTMethod::Strip,PTSkin::Spot)
    }
}
