use std::fmt::Debug;

use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType, Input };
use types::{ CLeaf, AxisSense, Rect, Edge, RLeaf };

use shape::{ Shape, ColourSpec, ShapeSpec };
use shape::util::{
    rectangle_p, rectangle_c, rectangle_g, multi_gl, vertices_rect,
    despot
};

use drawing::{ Artwork };

#[derive(Clone,Copy,Debug)]
enum RectShape<T: Clone+Copy+Debug> {
    Pin(CLeaf,Rect<T,i32>),
    Tape(CLeaf,Rect<T,Edge<i32>>),
    Fix(Rect<Edge<i32>,Edge<i32>>),
    Stretch(RLeaf)
}

pub struct RectSpec {
    pt: PTGeom,
    offset: RectShape<i32>,
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
    offset: RectShape<i32>,
    colspec: ColourSpec,
    geom: ProgramType
}

impl Shape for PinRect {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _art: Option<Artwork>) {
        let b = vertices_rect(geom,self.colspec.to_group(geom_name));
        match self.offset {
            RectShape::Pin(origin,offset) => {
                rectangle_p(b,geom,"aVertexPosition",&offset);
                multi_gl(b,geom,"aOrigin",&origin,4);
            },
            RectShape::Tape(origin,offset) => {
                let offset = offset.x_edge(AxisSense::Pos,AxisSense::Pos);
                rectangle_c(b,geom,"aVertexPosition","aVertexSign",&offset);
                multi_gl(b,geom,"aOrigin",&origin,4);
            },
            RectShape::Fix(offset) => {
                rectangle_c(b,geom,"aVertexPositive","aVertexSign",&offset);
            },
            RectShape::Stretch(offset) => {
                rectangle_g(b,geom,"aVertexPosition",&offset);
            },
        };
        if let ColourSpec::Colour(c) = self.colspec {
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

pub fn pin_rectangle(r: &CLeaf, f: &Rect<i32,i32>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Pin,
        offset: RectShape::Pin(*r,*f),
        colspec: colspec.clone()
    })
}

pub fn tape_rectangle(r: &CLeaf, f: &Rect<i32,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Tape,
        offset: RectShape::Tape(*r,*f),
        colspec: colspec.clone()
    })
}

pub fn fix_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Fix,
        offset: RectShape::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn fixunderpage_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::FixUnderPage,
        offset: RectShape::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn fixundertape_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::FixUnderTape,
        offset: RectShape::Fix(*f),
        colspec: colspec.clone()
    })
}

#[allow(dead_code)]
pub fn page_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Page,
        offset: RectShape::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn stretch_rectangle(p: &RLeaf, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Stretch,
        offset: RectShape::Stretch(*p),
        colspec: colspec.clone()
    })
}
