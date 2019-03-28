use std::fmt::Debug;

use composit::Leaf;
use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType };
use types::{ 
    CLeaf, AxisSense, Rect, Edge, RLeaf, Anchor, Anchored, Colour,
    area_size, cleaf, cpixel
};
use model::shape::{ ColourSpec, ShapeSpec };
use drivers::webgl::{
    Facade, FacadeType, ShapeInstanceDataType, ShapeShortInstanceData,
    TypeToShape,
};

#[derive(Clone,Copy,Debug)]
pub enum RectPosition<T: Clone+Copy+Debug> {
    Pin(CLeaf,Rect<T,i32>),
    Page(Rect<Edge<i32>,i32>),
    Tape(CLeaf,Rect<T,Edge<i32>>),
    Fix(Rect<Edge<i32>,Edge<i32>>),
    Stretch(RLeaf)
}

#[derive(Clone,Copy,Debug)]
pub struct RectSpec {
    pub pt: PTGeom,
    pub offset: RectPosition<i32>,
    pub colspec: ColourSpec
}

#[derive(Clone,Copy,Debug)]
pub struct BoxSpec {
    pub offset: RLeaf,
    pub width: i32,
    pub colspec: ColourSpec
}

pub struct PinRectTypeSpec {
    pub sea_x: Option<(AxisSense,AxisSense)>,
    pub sea_y: Option<(AxisSense,AxisSense)>,
    pub ship_x: (Option<AxisSense>,i32),
    pub ship_y: (Option<AxisSense>,i32),
    pub under: i32, // page = true, tape = false
    pub spot: bool
}

pub struct StretchRectTypeSpec {
    pub spot: bool,
    pub hollow: bool
}

impl StretchRectTypeSpec {
    fn new_colspec(&self, rd: &ShapeShortInstanceData) -> ColourSpec {
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
    fn new_short_shape(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let colspec = self.new_colspec(rd);
        let offset = area_size(cleaf(rd.pos_x,rd.pos_y),
                               cleaf(rd.aux_x,rd.aux_y));
        if rd.pos_x <= 1. && rd.pos_x+rd.aux_x >= 0. {
            if self.hollow {
                Some(ShapeSpec::PinBox(BoxSpec {
                    offset,
                    width: 1,
                    colspec
                }))
            } else {
                Some(ShapeSpec::PinRect(RectSpec {
                    pt: PTGeom::Stretch,
                    offset: RectPosition::Stretch(offset),
                    colspec
                }))
            }
        } else {
            None
        }
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    fn needs_scale(&self) -> (bool,bool) { (true,true) }
    fn sid_type(&self) -> ShapeInstanceDataType { ShapeInstanceDataType::Short }
}

impl PinRectTypeSpec {
    fn new_colspec(&self, rd: &ShapeShortInstanceData) -> Option<ColourSpec> {
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
    
    fn new_pin_offset(&self, rd: &ShapeShortInstanceData) -> Rect<i32,i32> {
        let size = cpixel(rd.aux_x as i32,rd.aux_y);
        let delta_x = self.new_pin_delta(size.0,self.ship_x);
        let delta_y = self.new_pin_delta(size.1,self.ship_y);
        area_size(cpixel(-delta_x,-delta_y),size)
    }
    
    fn new_pin(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let offset = self.new_pin_offset(rd);
        let colspec = self.new_colspec(rd);
        Some(ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Pin,
            offset: RectPosition::Pin(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec: colspec.unwrap()
        }))
    }
    
    fn new_tape(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let offset = self.new_pin_offset(rd)
                        .y_edge(self.sea_y.unwrap().0,
                                self.sea_y.unwrap().1);
        let colspec = self.new_colspec(rd);
        Some(ShapeSpec::PinRect(RectSpec {
            pt: PTGeom::Tape,
            offset: RectPosition::Tape(cleaf(rd.pos_x,rd.pos_y),offset),
            colspec: colspec.unwrap()
        }))     
    }

    fn new_page(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let pos =  (cpixel(rd.pos_x as i32,rd.pos_y) +
                    self.new_pin_offset(rd))
                        .x_edge(self.sea_x.unwrap().0,
                                self.sea_x.unwrap().1);
        let colspec = self.new_colspec(rd);
        let pt = match self.under {
            3 => PTGeom::PageUnderAll,
            _ => PTGeom::Page
        };
        Some(ShapeSpec::PinRect(RectSpec {
            pt,
            offset: RectPosition::Page(pos),
            colspec: colspec.unwrap()
        }))     
    }

    fn new_fix(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let pos =  (cpixel(rd.pos_x as i32,rd.pos_y) +
                    self.new_pin_offset(rd))
                        .x_edge(self.sea_x.unwrap().0,
                                self.sea_x.unwrap().1)
                        .y_edge(self.sea_y.unwrap().0,
                                self.sea_y.unwrap().1);
        let colspec = self.new_colspec(rd);
        let pt = match self.under {
            1 => PTGeom::FixUnderPage,
            2 => PTGeom::FixUnderTape,
            3 => PTGeom::PageUnderAll,
            _ => PTGeom::Fix,
        };
        Some(ShapeSpec::PinRect(RectSpec {
            pt,
            offset: RectPosition::Fix(pos),
            colspec: colspec.unwrap()
        }))     
    }    
}

impl TypeToShape for PinRectTypeSpec {
    fn new_short_shape(&self, sid: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        match (self.sea_x.is_some(),self.sea_y.is_some()) {
            (false,false) =>self.new_pin(sid),
            (false,true) => self.new_tape(sid),
            (true,false) => self.new_page(sid),
            (true,true) => self.new_fix(sid),
        }
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    fn needs_scale(&self) -> (bool,bool) { (self.sea_x.is_none(),false) }
    fn sid_type(&self) -> ShapeInstanceDataType { ShapeInstanceDataType::Short }
}
