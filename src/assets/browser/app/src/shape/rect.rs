use std::fmt::Debug;

use composit::Leaf;
use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType };
use types::{ 
    CLeaf, AxisSense, Rect, Edge, RLeaf, Anchor, Anchored, Colour,
    area_size, cleaf, cpixel
};

use shape::{ Shape, ColourSpec, ShapeSpec };
use shape::util::{
    rectangle_p, rectangle_c, rectangle_g, multi_gl, vertices_rect,
    despot, colour, ShapeInstanceData, TypeToShape, Facade, FacadeType
};
use print::PrintEdition;
use drawing::{ Artwork };
use super::boxshape::{ BoxSpec, PinBox };

#[derive(Clone,Copy,Debug)]
enum RectPosition<T: Clone+Copy+Debug> {
    Pin(CLeaf,Rect<T,i32>),
    Page(Rect<Edge<i32>,i32>),
    Tape(CLeaf,Rect<T,Edge<i32>>),
    Fix(Rect<Edge<i32>,Edge<i32>>),
    Stretch(RLeaf)
}

#[derive(Clone,Copy,Debug)]
pub struct RectSpec {
    pt: PTGeom,
    offset: RectPosition<i32>,
    colspec: ColourSpec
}

impl RectSpec {
    pub fn create(&self) -> Box<Shape> {
        let g = despot(self.pt,PTMethod::Triangle,&self.colspec);        
        Box::new(PinRect {
            offset: self.offset,
            colspec: self.colspec.clone(),
            geom: g
        })
    }
}

pub struct PinRect {
    offset: RectPosition<i32>,
    colspec: ColourSpec,
    geom: ProgramType
}

impl Shape for PinRect {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut PrintEdition) {
        let group = self.colspec.to_group(geom,e);
        let b = vertices_rect(geom,group);
        match self.offset {
            RectPosition::Pin(origin,offset) => {
                rectangle_p(b,geom,"aVertexPosition",&offset);
                multi_gl(b,geom,"aOrigin",&origin,4);
            },
            RectPosition::Page(offset) => {
                let offset = offset.y_edge(AxisSense::Max,AxisSense::Max);
                rectangle_c(b,geom,"aVertexPosition","aVertexSign",&offset);
            },
            RectPosition::Tape(origin,offset) => {
                let offset = offset.x_edge(AxisSense::Max,AxisSense::Max);
                rectangle_c(b,geom,"aVertexPosition","aVertexSign",&offset);
                multi_gl(b,geom,"aOrigin",&origin,4);
            },
            RectPosition::Fix(offset) => {
                rectangle_c(b,geom,"aVertexPosition","aVertexSign",&offset);
            },
            RectPosition::Stretch(offset) => {
                rectangle_g(b,geom,"aVertexPosition",&offset);
            },
        };
        if let ColourSpec::Colour(c) = self.colspec {
            for _ in 0..4 {
                colour(b,geom,"aVertexColour",&c);
            }
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

/* new, cleaner API */

pub struct StretchRectTypeSpec {
    pub spot: bool,
    pub hollow: bool
}

impl StretchRectTypeSpec {
    fn new_colspec(&self, rd: &ShapeInstanceData) -> ColourSpec {
        if let Facade::Colour(c) = rd.facade {
            if self.spot {
                Some(ColourSpec::Spot(c))
            } else {
                Some(ColourSpec::Colour(c))
            }
        } else { None }.unwrap()
    }
}


impl TypeToShape for StretchRectTypeSpec {
    fn new_shape(&self, rd: &ShapeInstanceData) -> ShapeSpec {
        let colspec = self.new_colspec(rd);
        let offset = area_size(cleaf(rd.pos_x,rd.pos_y),
                               cleaf(rd.aux_x,rd.aux_y));
        if self.hollow {
            ShapeSpec::PinBox(BoxSpec {
                offset,
                width: 1,
                colspec
            })
        } else {
            ShapeSpec::PinRect(RectSpec {
                pt: PTGeom::Stretch,
                offset: RectPosition::Stretch(offset),
                colspec
            })
        }
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    
    fn needs_scale(&self) -> (bool,bool) { (true,true) }
}

pub struct PinRectTypeSpec {
    pub sea_x: Option<(AxisSense,AxisSense)>,
    pub sea_y: Option<(AxisSense,AxisSense)>,
    pub ship_x: (Option<AxisSense>,i32),
    pub ship_y: (Option<AxisSense>,i32),
    pub under: Option<bool>, // page = true, tape = false
    pub spot: bool
}

impl PinRectTypeSpec {
    fn new_colspec(&self, rd: &ShapeInstanceData) -> Option<ColourSpec> {
        if let Facade::Colour(c) = rd.facade {
            if self.spot {
                Some(ColourSpec::Spot(c))
            } else {
                Some(ColourSpec::Colour(c))
            }
        } else {
            None
        }
    }
    
    fn new_pin_delta(&self, len: i32, ship: (Option<AxisSense>,i32)) -> i32 {
        match ship.0 {
            Some(AxisSense::Min) => 0,
            Some(AxisSense::Max) => len,
            None => len/2
        }
    }
    
    fn new_pin_offset(&self, rd: &ShapeInstanceData) -> Rect<i32,i32> {
        let size = cpixel(rd.aux_x as i32,rd.aux_y);
        let delta_x = self.new_pin_delta(size.0,self.ship_x);
        let delta_y = self.new_pin_delta(size.1,self.ship_y);
        area_size(cpixel(-delta_x,-delta_y),size)
    }
    
    fn new_pin(&self, rd: &ShapeInstanceData) -> ShapeSpec {
        let offset = self.new_pin_offset(rd);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Pin,
            offset: RectPosition::Pin(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec: colspec.unwrap()
        })        
    }
    
    fn new_tape(&self, rd: &ShapeInstanceData) -> ShapeSpec {
        let offset = self.new_pin_offset(rd)
                        .y_edge(self.sea_y.unwrap().0,
                                self.sea_y.unwrap().1);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Tape,
            offset: RectPosition::Tape(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec: colspec.unwrap()
        })        
    }

    fn new_page(&self, rd: &ShapeInstanceData) -> ShapeSpec {
        let pos =  (cpixel(rd.pos_x as i32,rd.pos_y) +
                    self.new_pin_offset(rd))
                        .x_edge(self.sea_x.unwrap().0,
                                self.sea_x.unwrap().1);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Page,
            offset: RectPosition::Page(pos),
            colspec: colspec.unwrap()
        })        
    }

    fn new_fix(&self, rd: &ShapeInstanceData) -> ShapeSpec {
        let pos =  (cpixel(rd.pos_x as i32,rd.pos_y) +
                    self.new_pin_offset(rd))
                        .x_edge(self.sea_x.unwrap().0,
                                self.sea_x.unwrap().1)
                        .y_edge(self.sea_y.unwrap().0,
                                self.sea_y.unwrap().1);
        let colspec = self.new_colspec(rd);
        let pt = match self.under {
            Some(true) => PTGeom::FixUnderPage,
            Some(false) => PTGeom::FixUnderTape,
            None => PTGeom::Fix,
        };
        ShapeSpec::PinRect(RectSpec {
            pt,
            offset: RectPosition::Fix(pos),
            colspec: colspec.unwrap()
        })        
    }    
}

impl TypeToShape for PinRectTypeSpec {
    fn new_shape(&self, sid: &ShapeInstanceData) -> ShapeSpec {
        match (self.sea_x.is_some(),self.sea_y.is_some()) {
            (false,false) =>self.new_pin(sid),
            (false,true) => self.new_tape(sid),
            (true,false) => self.new_page(sid),
            (true,true) => self.new_fix(sid),
        }
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    
    fn needs_scale(&self) -> (bool,bool) { (self.sea_x.is_none(),false) }
}
