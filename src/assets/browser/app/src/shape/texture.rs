use std::fmt::Debug;
use std::rc::Rc;

use program::{ ProgramType, PTGeom, PTSkin, PTMethod, ProgramAttribs };
use types::{
    EPixel, Edge, APixel, AxisSense, Dot, CPixel, 
    CLeaf, area_centred, Anchors, cfraction
};

use shape::{ Shape, ShapeSpec };
use shape::util::{ rectangle_t, multi_gl, vertices_rect };

use drawing::{ Artist, Artwork, DrawingSpec };
use print::PrintEdition;

#[derive(Clone,Copy,Debug)]
pub enum TexturePosition<T: Clone+Copy+Debug> {
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

impl TextureSpec {
    pub fn create(&self) -> Box<Shape> {
        Box::new(self.clone())
    }
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
                    let origin = origin.x_edge(AxisSense::Max);
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

fn texture(a: DrawingSpec, origin: &TexturePosition<f32>, scale: &APixel, offset: &CPixel, gt: PTGeom) -> ShapeSpec {
    let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
    ShapeSpec::PinTexture(TextureSpec::new(pt,a,origin,offset,scale))
}

pub fn pin_texture(a: DrawingSpec, origin: &CLeaf, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(a, &TexturePosition::Pin(*origin), scale, offset, PTGeom::Pin)
}

pub fn tape_texture(a: DrawingSpec, origin: &Dot<f32,Edge<i32>>, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(a, &TexturePosition::Tape(*origin), scale, offset, PTGeom::Tape)
}

pub fn fix_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(req, &TexturePosition::Fix(*origin), scale, offset, PTGeom::Fix)
}

#[allow(unused)]
pub fn fixunderpage_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(req, &TexturePosition::Fix(*origin), scale, offset, PTGeom::FixUnderPage)
}

#[allow(unused)]
pub fn fixundertape_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(req, &TexturePosition::Fix(*origin), scale, offset, PTGeom::FixUnderTape)
}

pub fn page_texture(req: DrawingSpec, origin: &EPixel, offset: &CPixel, scale: &APixel) -> ShapeSpec {
    texture(req, &TexturePosition::Fix(*origin), scale, offset, PTGeom::Page)
}
