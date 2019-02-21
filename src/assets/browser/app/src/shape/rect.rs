use std::fmt::Debug;

use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType };
use types::{ 
    CLeaf, AxisSense, Rect, Edge, RLeaf, Anchor, Anchored, Colour,
    area_size, cleaf, cpixel
};

use shape::{ Shape, ColourSpec, ShapeSpec };
use shape::util::{
    rectangle_p, rectangle_c, rectangle_g, multi_gl, vertices_rect,
    despot, colour
};
use print::PrintEdition;
use drawing::{ Artwork };

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
    pub spot: bool
}

impl StretchRectTypeSpec {
    fn new_colspec(&self, rd: &RectData) -> ColourSpec {
        if self.spot {
            ColourSpec::Spot(rd.colour)
        } else {
            ColourSpec::Colour(rd.colour)
        }
    }

    pub fn new_shape(&self, rd: &RectData) -> ShapeSpec {
        let colspec = self.new_colspec(rd);
        let offset = area_size(cleaf(rd.pos_x,rd.pos_y),
                               cleaf(rd.aux_x,rd.aux_y));
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Stretch,
            offset: RectPosition::Stretch(offset),
            colspec
        })
    }
}

pub struct PinRectTypeSpec {
    pub sea_x: Option<(AxisSense,AxisSense)>,
    pub sea_y: Option<(AxisSense,AxisSense)>,
    pub ship_x: (Option<AxisSense>,i32),
    pub ship_y: (Option<AxisSense>,i32),
    pub under: Option<bool>, // page = true, tape = false
    pub spot: bool
}

pub struct RectData {
    pub pos_x: f32,
    pub pos_y: i32,
    pub aux_x: f32,
    pub aux_y: i32,
    pub colour: Colour
}

impl PinRectTypeSpec {
    fn new_colspec(&self, rd: &RectData) -> ColourSpec {
        if self.spot {
            ColourSpec::Spot(rd.colour)
        } else {
            ColourSpec::Colour(rd.colour)
        }
    }
    
    fn new_pin_delta(&self, len: i32, ship: (Option<AxisSense>,i32)) -> i32 {
        match ship.0 {
            Some(AxisSense::Min) => 0,
            Some(AxisSense::Max) => len,
            None => len/2
        }
    }
    
    fn new_pin_offset(&self, rd: &RectData) -> Rect<i32,i32> {
        let size = cpixel(rd.aux_x as i32,rd.aux_y);
        let delta_x = self.new_pin_delta(size.0,self.ship_x);
        let delta_y = self.new_pin_delta(size.1,self.ship_y);
        area_size(cpixel(-delta_x,-delta_y),size)
    }
    
    fn new_pin(&self, rd: &RectData) -> ShapeSpec {
        let offset = self.new_pin_offset(rd);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Pin,
            offset: RectPosition::Pin(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec
        })        
    }
    
    fn new_tape(&self, rd: &RectData) -> ShapeSpec {
        let offset = self.new_pin_offset(rd)
                        .y_edge(self.sea_y.unwrap().0,
                                self.sea_y.unwrap().1);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Tape,
            offset: RectPosition::Tape(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec
        })        
    }

    fn new_page(&self, rd: &RectData) -> ShapeSpec {
        let pos =  (cpixel(rd.pos_x as i32,rd.pos_y) +
                    self.new_pin_offset(rd))
                        .x_edge(self.sea_x.unwrap().0,
                                self.sea_x.unwrap().1);
        let colspec = self.new_colspec(rd);
        ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Page,
            offset: RectPosition::Page(pos),
            colspec
        })        
    }

    fn new_fix(&self, rd: &RectData) -> ShapeSpec {
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
            colspec
        })        
    }
    
    pub fn new_shape(&self, rd: &RectData) -> ShapeSpec {
        match (self.sea_x.is_some(),self.sea_y.is_some()) {
            (false,false) =>self.new_pin(rd),
            (false,true) => self.new_tape(rd),
            (true,false) => self.new_page(rd),
            (true,true) => self.new_fix(rd),
        }
    }
}
