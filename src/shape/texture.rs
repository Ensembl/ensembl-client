use std::fmt::Debug;
use std::rc::Rc;

use program::{ ProgramType, PTGeom, PTSkin, PTMethod, ProgramAttribs };
use types::{
    EPixel, Rect, Edge, area_size, APixel, AxisSense, Dot, CPixel, 
    CLeaf, area_centred, Anchors, cfraction
};

use shape::{ Shape, ColourSpec, ShapeSpec };
use shape::util::{
    rectangle_t, multi_gl, vertices_rect, despot, rectangle_c
};

use drawing::{ Artist, Artwork, DrawingSpec };
use print::PrintEdition;

#[derive(Clone,Copy,Debug)]
enum TexturePosition<T: Clone+Copy+Debug> {
    Pin(Dot<T,i32>),
    Tape(Dot<T,Edge<i32>>),
    Fix(EPixel),
}

#[derive(Clone,Debug)]
pub struct TextureSpec {
    origin: TexturePosition<f32>,
    offset: CPixel,
    
    anchor: Anchors,
    scale: CPixel,
    geom: ProgramType,
    aspec: DrawingSpec
}

impl Shape for TextureSpec {
    fn into_objects(&self, geom: &mut ProgramAttribs, 
                    artwork: Option<Artwork>, e: &mut PrintEdition) {
        if let Some(art) = artwork {
            let group = e.canvas().get_group(geom,&art.weave);
            let b = vertices_rect(geom,Some(group));
            let mut mp = art.mask_pos;
            let mut ap = art.pos;
            let mut anchor = self.anchor;
            let mut pos = cfraction(0.,0.);
            let mut offset = self.offset.as_fraction();
            match self.origin {
                TexturePosition::Pin(origin) => {
                    multi_gl(b,geom,"aOrigin",&origin,4);
                },
                TexturePosition::Tape(origin) => {
                    let origin = origin.x_edge(AxisSense::Pos);
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    offset = offset.flip(&origin.corner());
                    anchor = anchor.flip(&origin.corner());
                    multi_gl(b,geom,"aOrigin",&origin.quantity(),4);
                    multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                },
                TexturePosition::Fix(origin) => {
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    anchor = anchor.flip(&origin.corner());
                    pos = origin.quantity().as_fraction();
                    multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                }
            }
            let p = area_centred(pos,
                                 (art.size * self.scale).as_fraction());
            let p = anchor.to_middle(p) + p + offset;
            rectangle_t(b,geom,"aTextureCoord",&ap);
            rectangle_t(b,geom,"aMaskCoord",&mp);
            rectangle_t(b,geom,"aVertexPosition",&p);
        }
    }

    fn get_geometry(&self) -> ProgramType { self.geom }

    fn get_artist(&self) -> Option<Rc<Artist>> { 
        Some(self.aspec.to_artist())
    }
}

impl TextureSpec {
    fn new(geom: ProgramType, aspec: DrawingSpec, origin: &TexturePosition<f32>, 
           offset: &CPixel, scale: &APixel) -> TextureSpec {
        TextureSpec {
            geom, aspec, origin: *origin, offset: *offset, 
            scale: scale.quantity(),
            anchor: scale.corner()
        }
    }        
}

pub fn pin_texture(a: DrawingSpec, origin: &CLeaf, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    let pt = ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Texture);
    Box::new(TextureSpec::new(pt,a,&TexturePosition::Pin(*origin),offset,scale))
}

pub fn tape_texture(a: DrawingSpec, origin: &Dot<f32,Edge<i32>>, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    let pt = ProgramType(PTGeom::Tape,PTMethod::Triangle,PTSkin::Texture);
    Box::new(TextureSpec::new(pt,a,&TexturePosition::Tape(*origin),offset,scale))
}

fn texture(a: DrawingSpec, origin: &EPixel, scale: &APixel, offset: &CPixel, gt: PTGeom) -> Box<Shape> {
    let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
    Box::new(TextureSpec::new(pt,a,&TexturePosition::Fix(*origin),offset,scale))
}

pub fn fix_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, offset, PTGeom::Fix)
}

pub fn fixunderpage_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, offset, PTGeom::FixUnderPage)
}

pub fn fixundertape_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, offset, PTGeom::FixUnderTape)
}

pub fn page_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    texture(req, origin, scale, offset, PTGeom::Page)
}
