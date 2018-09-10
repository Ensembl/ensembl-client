use std::rc::Rc;

use arena::ArenaData;

use types::{ CLeaf, RLeaf, RPixel, RFraction, CFraction, CPixel };

use shape::{ Shape, ColourSpec, Spot };
use shape::util::{
    rectangle_g, rectangle_t, points_g,
    multi_gl,
    vertices_rect, vertices_strip,
    despot
};

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };

use drawing::Artist;


/*
 * StretchRect
 */

pub struct StretchRect {
    points: RLeaf,
    colspec: ColourSpec,
    geom: ProgramType
}

impl StretchRect {
    pub fn new(points: RLeaf, colspec: &ColourSpec, geom: ProgramType) -> StretchRect {
        StretchRect { points, colspec: colspec.clone(), geom }
    }
}

impl Shape for StretchRect {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData, _texpos: Option<RPixel>) {
        let b = vertices_rect(geom,self.colspec.to_group(geom_name));
        rectangle_g(b,geom,"aVertexPosition",&self.points);
        if let ColourSpec::Colour(c) = self.colspec {
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

pub fn stretch_rectangle(p:&RLeaf, colour: &ColourSpec) -> Box<Shape> {
    let g = despot(PTGeom::Stretch,PTMethod::Triangle,colour);
    Box::new(StretchRect::new(*p,colour,g))
}

/*
 * StretchWiggle
 */

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
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData, _texpos: Option<RPixel>) {
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

/*
 * StretchTexture
 */

pub struct StretchTexture {
    pos: RLeaf,
    artist: Rc<Artist>
}

impl StretchTexture {
    pub fn new(artist: Rc<Artist>,pos: &RLeaf) -> StretchTexture {
        StretchTexture {
            pos: *pos, artist: artist.clone()
        }
    }
}

const CHUNK_SIZE : f32 = 10.;

impl Shape for StretchTexture {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData, texpos: Option<RPixel>) {
        if let Some(tp) = texpos {
            let t = tp / adata.canvases.flat.size();
            
            /* some cards baulk at very large textured areas, so split */
            let mut chunks = ((self.pos.1).0.abs() / CHUNK_SIZE) as i32;
            if chunks < 1 { chunks = 1; }
            
            let widthp = self.pos.1 / CPixel(chunks,1);
            let widtht = t.1 / CFraction(chunks as f32,1.);
            
            let mut p = RLeaf(self.pos.0,widthp);
            let mut t = RFraction(t.0,widtht);
            for _i in 0..chunks {
                let b = vertices_rect(geom,None);
                rectangle_g(b,geom,"aVertexPosition",&p);
                rectangle_t(b,geom,"aTextureCoord",&t);
                p = p + CLeaf(widthp.0,0);
                t = t + CFraction(widtht.0,0.);
            }
        }
    }
    
    fn get_geometry(&self) -> ProgramType {
        ProgramType(PTGeom::Stretch,PTMethod::Triangle,PTSkin::Texture)
    }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

pub fn stretch_texture(a: Rc<Artist>, pos: &RLeaf) -> Box<Shape> {
    Box::new(StretchTexture::new(a,pos))
}
