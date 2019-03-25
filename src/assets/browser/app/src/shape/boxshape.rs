use drivers::webgl::{ Artwork, PrintEdition };
use program::{ PTGeom, PTMethod, ProgramType, ProgramAttribs, Input };
use shape::{ ColourSpec, Shape, ShapeSpec };
use shape::util::{ despot, vertices_hollowpoly, poly_p, multi_gl };
use types::{ RLeaf, CFraction, CLeaf, cfraction, cleaf };

#[derive(Clone,Copy,Debug)]
pub struct BoxSpec {
    pub offset: RLeaf,
    pub width: i32,
    pub colspec: ColourSpec
}

const DELTA_X: &[f32] = &[0.,1.,0.,1.,0.,-1.,0.,-1.];
const DELTA_Y: &[i32] = &[0, 1, 0,-1, 0, -1, 0,  1];

const END_X: &[f32] = &[0.,0.,0.,0.,1.,1.,1.,1.];
const END_Y: &[i32] = &[0, 0, 1, 1, 1, 1, 0, 0];

impl BoxSpec {
    pub fn create(self) -> Box<Shape> {
        let g = despot(PTGeom::Pin,PTMethod::Strip,&self.colspec);        
        Box::new(self)
    }

    fn origins(&self) -> Vec<CLeaf> {
        let mut v = Vec::<CLeaf>::new();
        let near = self.offset.offset();
        let far = self.offset.far_offset();
        for i in 0..8 {
            v.push(cleaf(near.0*(1.-END_X[i])+far.0*END_X[i],
                         near.1*(1 -END_Y[i])+far.1*END_Y[i]));
        }
        v
    }

    fn offsets(&self) -> Vec<CFraction> {
        let mut v = Vec::<CFraction>::new();
        for i in 0..8 {            
            v.push(cfraction(self.width as f32*DELTA_X[i],(self.width*DELTA_Y[i]) as f32));
        }
        v
    }
}

impl Shape for BoxSpec {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut PrintEdition) {
        let group = self.colspec.to_group(geom,e);
        let b = vertices_hollowpoly(geom,4,group);
        let origins = self.origins();
        let origins : Vec<&Input> = origins.iter().map(|s| s as &Input).collect();
        poly_p(b,geom,"aOrigin",&origins);
        let offsets = self.offsets();
        let offsets : Vec<&Input> = offsets.iter().map(|s| s as &Input).collect();
        poly_p(b,geom,"aVertexPosition",&offsets);
        if let ColourSpec::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,8);
        }
    }
    
    fn get_geometry(&self) -> ProgramType {
        despot(PTGeom::Pin,PTMethod::Strip,&self.colspec)
    }
}
