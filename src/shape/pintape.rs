use std::fmt::Debug;
use std::f32;
use std::rc::Rc;

use program::{
    ProgramAttribs, DataBatch, PTGeom, PTMethod, PTSkin, ProgramType,
    Input
};

use types::{
    CLeaf, CPixel, CFraction, cfraction, Dot, AxisSense, 
    Bounds, area_size, Rect, Edge, APixel, Anchors, RLeaf
};

use shape::{ Shape, ColourSpec, MathsShape, ShapeSpec };
use shape::util::{
    rectangle_p, rectangle_t, rectangle_c, rectangle_g,
    multi_gl, poly_p, vertices_poly,
    vertices_rect, vertices_hollowpoly,
    despot
};

use drawing::{ Artist, Artwork };

/*
 * PinTexture
 */

#[derive(Clone,Copy,Debug)]
enum CPinOrTape<T: Clone+Copy+Debug> {
    Pin(Dot<T,i32>),
    Tape(Dot<T,Edge<i32>>)
}

pub struct PinTexture {
    pt: PTGeom,
    origin: CPinOrTape<f32>,
    offset: CPixel,
    scale: APixel,
    artist: Rc<Artist>
}

impl PinTexture {
    fn new(pt: PTGeom, artist: Rc<Artist>,origin: &CPinOrTape<f32>, 
           offset: &CPixel, scale: &APixel) -> PinTexture {
        PinTexture {
            pt, origin: *origin, offset: *offset, scale: *scale,
            artist: artist.clone()
        }
    }        
}

impl Shape for PinTexture {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, 
                    artwork: Option<Artwork>) {
        if let Some(art) = artwork {
            let b = vertices_rect(geom,Some(art.index.get_group(geom_name)));
            let mut mp = art.mask_pos;
            let mut ap = art.pos;
            let mut scale = self.scale;            
            match self.origin {
                CPinOrTape::Pin(origin) => {
                    multi_gl(b,geom,"aOrigin",&origin,4);
                },
                CPinOrTape::Tape(origin) => {
                    let origin = origin.x_edge(AxisSense::Pos);
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    scale = scale.flip(origin);
                    multi_gl(b,geom,"aOrigin",&origin.quantity(),4);
                    multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                }
            }
            /* create rect the scaled rect and displace by offset */
            let p = area_size(self.offset,art.size * scale.quantity());
            /* modify offset relative to chosen point */
            let p = scale.from_nw(p.as_fraction());
            rectangle_t(b,geom,"aTextureCoord",&ap);
            rectangle_t(b,geom,"aMaskCoord",&mp);
            rectangle_t(b,geom,"aVertexPosition",&p);
        }
    }

    fn get_geometry(&self) -> ProgramType {
        ProgramType(self.pt,PTMethod::Triangle,PTSkin::Texture)
    }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

pub fn pin_texture(a: Rc<Artist>, origin: &CLeaf, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    Box::new(PinTexture::new(PTGeom::Pin,a,&CPinOrTape::Pin(*origin),offset,scale))
}

pub fn tape_texture(a: Rc<Artist>, origin: &Dot<f32,Edge<i32>>, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    Box::new(PinTexture::new(PTGeom::Tape,a,&CPinOrTape::Tape(*origin),offset,scale))
}
