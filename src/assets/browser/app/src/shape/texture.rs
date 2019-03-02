use std::fmt::Debug;
use std::rc::Rc;

use program::{ ProgramType, PTGeom, PTSkin, PTMethod, ProgramAttribs };
use types::{
    EPixel, Edge, APixel, AxisSense, Dot, CPixel, 
    CLeaf, area_centred, Anchors, cfraction, Anchor, cpixel, cleaf
};

use shape::{ Shape, ShapeSpec, ShapeInstanceData, Facade, TypeToShape, FacadeType };
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
            let mut mp = art.mask_pos;
            let mut ap = art.pos;
            let mut anchor = self.anchor;
            let mut pos = cfraction(0.,0.);
            let mut offset = self.offset.as_fraction();
            let mut bounds_check = false;
            match self.origin {
                TexturePosition::Pin(origin) => {
                    bounds_check = true;
                },
                TexturePosition::Tape(origin) => {
                    let origin = origin.x_edge(AxisSense::Max);
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    offset = offset.flip(&origin.corner());
                    anchor = anchor.flip(&origin.corner());
                },
                TexturePosition::Fix(origin) => {
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    anchor = anchor.flip(&origin.corner());
                    pos = origin.quantity().as_fraction();
                }
            }
            let p = area_centred(pos,
                                 (art.size * self.scale).as_fraction());
            let p = anchor.to_middle(p) + p + offset;
            if !bounds_check || p.offset().0 <= 1. && p.far_offset().0 >= 0. {
                let b = vertices_rect(geom,Some(group));
                rectangle_t(b,geom,"aTextureCoord",&ap);
                rectangle_t(b,geom,"aMaskCoord",&mp);
                rectangle_t(b,geom,"aVertexPosition",&p);
                match self.origin {
                    TexturePosition::Pin(origin) => {
                        multi_gl(b,geom,"aOrigin",&origin,4);
                    },
                    TexturePosition::Tape(origin) => {
                        let origin = origin.x_edge(AxisSense::Max);
                        multi_gl(b,geom,"aOrigin",&origin.quantity(),4);
                        multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                    },
                    TexturePosition::Fix(origin) => {
                        multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                    }
                }
            }
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

fn texture(f: &Facade, origin: &TexturePosition<f32>, scale: &APixel, offset: &CPixel, gt: PTGeom) -> ShapeSpec {
    if let Facade::Drawing(d) = f {
        let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
        Some(ShapeSpec::PinTexture(TextureSpec::new(pt,d.clone(),origin,offset,scale)))
    } else { None }.unwrap()
}

pub struct TextureTypeSpec {
    pub sea_x: Option<AxisSense>,
    pub sea_y: Option<AxisSense>,
    pub ship_x: (Option<AxisSense>,i32),
    pub ship_y: (Option<AxisSense>,i32),
    pub under: Option<bool>, // page = true, tape = false
    pub scale_x: f32,
    pub scale_y: f32
}

impl TextureTypeSpec {
    fn anchor_pt(&self) -> Anchors {
        Dot(Anchor(self.ship_x.0),Anchor(self.ship_y.0))
    }

    fn new_fix(&self, td: &ShapeInstanceData) -> ShapeSpec {
        let origin = cpixel(td.pos_x as i32,td.pos_y)
                        .x_edge(self.sea_x.unwrap())
                        .y_edge(self.sea_y.unwrap());
        let scale = cpixel(self.scale_x as i32,self.scale_y as i32).anchor(self.anchor_pt());
        let offset = cpixel(td.aux_x as i32-self.ship_x.1,
                            td.aux_y as i32-self.ship_y.1);
        let pt = match self.under {
            Some(true) => PTGeom::FixUnderPage,
            Some(false) => PTGeom::FixUnderTape,
            None => PTGeom::Fix,
        };
        texture(&td.facade,&TexturePosition::Fix(origin),&scale,&offset,pt)
    }

    fn new_page(&self, td: &ShapeInstanceData) -> ShapeSpec {
        let origin = cpixel(td.pos_x as i32,td.pos_y)
                        .x_edge(self.sea_x.unwrap())
                        .y_edge(AxisSense::Max);
        let scale = cpixel(self.scale_x as i32,self.scale_y as i32).anchor(self.anchor_pt());
        let offset = cpixel(td.aux_x as i32-self.ship_x.1,
                            td.aux_y as i32-self.ship_y.1);
        texture(&td.facade,&TexturePosition::Fix(origin),&scale,&offset,PTGeom::Page)
    }
    
    fn new_pin(&self, td: &ShapeInstanceData) -> Option<ShapeSpec> {
        let origin = cleaf(td.pos_x,td.pos_y);
        let scale = cpixel(self.scale_x as i32,self.scale_y as i32).anchor(self.anchor_pt());
        let offset = cpixel(td.aux_x as i32-self.ship_x.1,
                            td.aux_y as i32-self.ship_y.1);
        if origin.0 <= 1. {
            Some(texture(&td.facade,&TexturePosition::Pin(origin),&scale,&offset,PTGeom::Pin))
        } else {
            None
        }
    }
    
    fn new_tape(&self, td: &ShapeInstanceData) -> ShapeSpec {
        let origin = cleaf(td.pos_x,td.pos_y).y_edge(self.sea_y.unwrap());
        let scale = cpixel(self.scale_x as i32,self.scale_y as i32).anchor(self.anchor_pt());
        let offset = cpixel(td.aux_x as i32-self.ship_x.1,
                            td.aux_y as i32-self.ship_y.1);
        texture(&td.facade,&TexturePosition::Tape(origin),&scale,&offset,PTGeom::Tape)
    }
}

impl TypeToShape for TextureTypeSpec {
    fn new_shape(&self, td: &ShapeInstanceData) -> Option<ShapeSpec> {
        Some(match (self.sea_x.is_some(),self.sea_y.is_some()) {
            (false,false) => self.new_pin(td),
            (false,true) => Some(self.new_tape(td)),
            (true,false) => Some(self.new_page(td)),
            (true,true) => Some(self.new_fix(td))
        }.unwrap())
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Drawing }
    
    fn needs_scale(&self) -> (bool,bool) { (self.sea_x.is_none(),false) }
}
