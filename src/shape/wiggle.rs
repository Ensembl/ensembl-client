use std::rc::Rc;

use types::{ CLeaf, RLeaf, cfraction, cleaf, area_size };

use shape::{ Shape, ColourSpec, Spot };
use shape::util::{
    points_g,
    multi_gl,
    vertices_rect, vertices_strip,
    despot
};

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };

use drawing::Artwork;

pub struct StretchWiggle {
    points: Vec<CLeaf>,
    y: i32,
    group: Spot
}

impl StretchWiggle {
    pub fn new(points: Vec<CLeaf>, group: Spot, y: i32) -> StretchWiggle {
        StretchWiggle { points, group, y }
    }
}

impl Shape for StretchWiggle {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, _art: Option<Artwork>) {
        let dg = self.group.get_group(self.get_geometry());
        let b = vertices_strip(geom,self.points.len() as u16*2,Some(dg));
        points_g(b,geom,"aVertexPosition",&self.points,self.y);
    }
    
    fn get_geometry(&self) -> ProgramType { 
        ProgramType(PTGeom::Stretch,PTMethod::Strip,PTSkin::Spot)
    }
}

pub fn stretch_wiggle(p: Vec<CLeaf>, y: i32, spot: &Spot) -> Box<Shape> {
    Box::new(StretchWiggle::new(p,spot.clone(),y))
}
