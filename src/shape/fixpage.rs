use std::rc::Rc;

use program::{ ProgramType, PTGeom, PTSkin, PTMethod, ProgramAttribs };
use types::{
    EPixel, Rect, Edge, area_size, APixel
};

use shape::{ Shape, ColourSpec };
use shape::util::{
    rectangle_t, multi_gl, vertices_rect, despot, rectangle_c
};

use drawing::{ Artist, Artwork };

/*
 * FixRect
 */

pub struct FixRect {
    points: Rect<Edge<i32>,Edge<i32>>,
    colspec: ColourSpec,
    geom: ProgramType
}

impl FixRect {
    pub fn new(points: Rect<Edge<i32>,Edge<i32>>, colspec: ColourSpec, geom: ProgramType) -> FixRect {
        FixRect { points, colspec, geom }
    }    
}

impl Shape for FixRect {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, 
                    _art: Option<Artwork>) {
        let b = vertices_rect(geom,self.colspec.to_group(geom_name));        
        rectangle_c(b,geom,"aVertexPositive","aVertexSign",&self.points);
        if let ColourSpec::Colour(c) = self.colspec {
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

fn rectangle(p: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec, gt: PTGeom) -> Box<Shape> {
    let pt = despot(gt,PTMethod::Triangle,colspec);
    Box::new(FixRect::new(*p,colspec.clone(),pt))
}

pub fn fix_rectangle(p: &Rect<Edge<i32>,Edge<i32>>, colour: &ColourSpec) -> Box<Shape> {
    rectangle(p,colour,PTGeom::Fix)
}

pub fn fixunderpage_rectangle(p: &Rect<Edge<i32>,Edge<i32>>, colour: &ColourSpec) -> Box<Shape> {
    rectangle(p,colour,PTGeom::FixUnderPage)
}

pub fn fixundertape_rectangle(p: &Rect<Edge<i32>,Edge<i32>>, colour: &ColourSpec) -> Box<Shape> {
    rectangle(p,colour,PTGeom::FixUnderTape)
}

#[allow(dead_code)]
pub fn page_rectangle(p: &Rect<Edge<i32>,Edge<i32>>, colour: &ColourSpec) -> Box<Shape> {
    rectangle(p,colour,PTGeom::Page)
}

/*
 * FixTexture
 */

pub struct FixTexture {
    pos: EPixel,
    scale: APixel,
    geom: ProgramType,
    artist: Rc<Artist>
}

impl FixTexture {
    pub fn new(pos: &EPixel, scale: &APixel, geom: ProgramType, artist: &Rc<Artist>) -> FixTexture {
        FixTexture {
            pos: *pos, scale: *scale, geom, artist: artist.clone(),
        }
    }    
}

impl Shape for FixTexture {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs,
                    artwork: Option<Artwork>) {
        if let Some(art) = artwork {
            let pos = self.pos.quantity();
            let p = area_size(pos,art.size * self.scale.quantity());
            let p = self.scale.from_nw(p.as_fraction());
            let b = vertices_rect(geom,None);
            let mut ap = art.pos.flip_d(self.pos);
            let mut mp = art.mask_pos.flip_d(self.pos);
            rectangle_t(b,geom,"aVertexPositive",&p);
            multi_gl(b,geom,"aVertexSign",&self.pos.corner(),4);
            rectangle_t(b,geom,"aTextureCoord",&ap);
            rectangle_t(b,geom,"aMaskCoord",&mp);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

fn texture(a: Rc<Artist>, origin: &EPixel, scale: &APixel, gt: PTGeom) -> Box<Shape> {
    let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
    Box::new(FixTexture::new(origin,scale,pt,&a))
}

pub fn fix_texture(req: Rc<Artist>, origin: &EPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, PTGeom::Fix)
}

pub fn fixunderpage_texture(req: Rc<Artist>, origin: &EPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, PTGeom::FixUnderPage)
}

pub fn fixundertape_texture(req: Rc<Artist>, origin: &EPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, PTGeom::FixUnderTape)
}

pub fn page_texture(req: Rc<Artist>, origin: &EPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, PTGeom::Page)
}
