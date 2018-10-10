use std::rc::Rc;

use types::{ CLeaf, RLeaf, cfraction, cleaf, area_size };

use shape::{ Shape, ColourSpec, Spot };
use shape::util::{
    rectangle_g, rectangle_t, points_g,
    multi_gl,
    vertices_rect, vertices_strip,
    despot
};

use program::{ PTGeom, PTMethod, PTSkin, ProgramType, ProgramAttribs };

use drawing::{ Artist, Artwork };

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
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, artwork: Option<Artwork>) {
        if let Some(art) = artwork {
            /* some cards baulk at very large textured areas, so split */
            let mut chunks = ((self.pos.area()).0.abs() / CHUNK_SIZE) as i32;
            if chunks < 1 { chunks = 1; }
            
            let widthp = (self.pos.area()).0 / chunks as f32;
            let widtht = art.pos.area() / cfraction(chunks as f32,1.);
            let widthtm = art.mask_pos.area() / cfraction(chunks as f32,1.);
            
            let mut p = area_size(self.pos.offset(),cleaf(widthp,(self.pos.area()).1));
            let mut t = area_size(art.pos.offset(),widtht);
            let mut tm = area_size(art.mask_pos.offset(),widthtm);
            for _i in 0..chunks {
                let b = vertices_rect(geom,Some(art.index.get_group(geom_name)));
                rectangle_g(b,geom,"aVertexPosition",&p);
                rectangle_t(b,geom,"aTextureCoord",&t);
                rectangle_t(b,geom,"aMaskCoord",&tm);
                p = p + cleaf(widthp,0);
                t = t + cfraction(widtht.0,0.);
                tm = tm + cfraction(widtht.0,0.);
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
