use std::fmt::Debug;

use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType };
use types::{ CLeaf, AxisSense, Rect, Edge, RLeaf };

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

pub fn pin_rectangle(r: &CLeaf, f: &Rect<i32,i32>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Pin,
        offset: RectPosition::Pin(*r,*f),
        colspec: colspec.clone()
    })
}

pub fn tape_rectangle(r: &CLeaf, f: &Rect<i32,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Tape,
        offset: RectPosition::Tape(*r,*f),
        colspec: colspec.clone()
    })
}

pub fn page_rectangle(f: &Rect<Edge<i32>,i32>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Page,
        offset: RectPosition::Page(*f),
        colspec: colspec.clone()
    })
}

pub fn fix_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Fix,
        offset: RectPosition::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn fixunderpage_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::FixUnderPage,
        offset: RectPosition::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn fixundertape_rectangle(f: &Rect<Edge<i32>,Edge<i32>>, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::FixUnderTape,
        offset: RectPosition::Fix(*f),
        colspec: colspec.clone()
    })
}

pub fn stretch_rectangle(p: &RLeaf, colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinRect(RectSpec {
        pt: PTGeom::Stretch,
        offset: RectPosition::Stretch(*p),
        colspec: colspec.clone()
    })
}
