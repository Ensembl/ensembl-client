use std::fmt::Debug;

use composit::Leaf;
use program::{ ProgramAttribs, PTGeom, PTMethod, ProgramType };
use types::{ 
    CLeaf, AxisSense, Rect, Edge, RLeaf, Anchor, Anchored, Colour,
    area_size, cleaf, cpixel
};

use super::GLShape;
use super::util::{
    rectangle_p, rectangle_c, rectangle_g, multi_gl, vertices_rect,
    despot, colour, ShapeInstanceData, ShapeShortInstanceData, 
    TypeToShape, Facade, FacadeType, ShapeInstanceDataType,
    colourspec_to_group
};
use model::shape::{ BoxSpec, ColourSpec, ShapeSpec, RectPosition, RectSpec };
use drivers::webgl::{ GLProgData, Artwork };

impl GLShape for RectSpec {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut GLProgData) {
        let group = colourspec_to_group(&self.colspec,geom,e);
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
    
    fn get_geometry(&self) -> ProgramType {
        despot(self.pt,PTMethod::Triangle,&self.colspec)
    }    
}
