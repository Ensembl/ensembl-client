use types::{ CLeaf, Colour, cleaf };

use super::{ GLShape, ColourSpec };
use super::util::{ Facade, FacadeType, points_g, ShapeLongInstanceData, ShapeInstanceData, TypeToShape, vertices_strip, ShapeInstanceDataType };

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };
use drivers::webgl::{ GLProgData, Artwork };
use model::shape::ShapeSpec;

#[derive(Clone,Debug)]
pub struct StretchWiggle {
    points: Vec<CLeaf>,
    y: i32,
    group: Colour
}

impl StretchWiggle {
    pub fn new(points: Vec<CLeaf>, group: Colour, y: i32) -> StretchWiggle {
        StretchWiggle { points, group, y }
    }

    pub fn create(self) -> Box<GLShape> {
        Box::new(self)
    }
}

impl GLShape for StretchWiggle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut GLProgData) {
        let dg = ColourSpec::Spot(self.group).to_group(geom,e);
        let b = vertices_strip(geom,self.points.len() as u16*2,dg);
        points_g(b,geom,"aVertexPosition",&self.points,self.y);
    }
    
    fn get_geometry(&self) -> ProgramType { 
        ProgramType(PTGeom::Stretch,PTMethod::Strip,PTSkin::Spot)
    }
}

pub fn stretch_wiggle(p: Vec<CLeaf>, y: i32, colour: &Colour) -> ShapeSpec {
    ShapeSpec::Wiggle(StretchWiggle::new(p,colour.clone(),y))
}

pub struct StretchWiggleTypeSpec {}

impl StretchWiggleTypeSpec {
    fn new_colspec(&self, rd: &ShapeLongInstanceData) -> Colour {
        if let Facade::Colour(c) = rd.facade {
            Some(c)
        } else { None }.unwrap()
    }
}

impl TypeToShape for StretchWiggleTypeSpec {
    fn new_long_shape(&self, rd: &ShapeLongInstanceData) -> Option<ShapeSpec> {
        let mut points = Vec::<CLeaf>::new();
        let mut y_iter = rd.pos_y.iter().cycle();
        for x in &rd.pos_x {
            points.push(cleaf(*x as f32,*y_iter.next().unwrap() as i32));
        }
        let thickness = 1;
        Some(stretch_wiggle(points,thickness,&self.new_colspec(&rd)))
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    fn needs_scale(&self) -> (bool,bool) { (true,true) }
    fn sid_type(&self) -> ShapeInstanceDataType { ShapeInstanceDataType::Long }
}
