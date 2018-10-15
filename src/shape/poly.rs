use std::fmt::Debug;
use std::f32;

use program::{
    ProgramAttribs, DataBatch, PTGeom, PTMethod, ProgramType,
    Input
};

use types::{
    CFraction, cfraction, Dot, AxisSense, Bounds, Edge, Anchors, 
    RFraction, TOPLEFT
};

use shape::{ Shape, ColourSpec, MathsShape, ShapeSpec };
use shape::util::{
    multi_gl, poly_p, vertices_poly, vertices_hollowpoly, despot,
};
use print::PrintEdition;
use drawing::{ Artwork };

#[derive(Clone,Copy,Debug)]
enum PolyPosition<T: Clone+Copy+Debug> {
    Pin(Dot<T,i32>),
    Tape(Dot<T,Edge<i32>>),
    Fix(Dot<Edge<i32>,Edge<i32>>),
    Page(Dot<Edge<i32>,i32>)
}

#[derive(Clone,Copy,Debug)]
pub struct PinPolySpec {
    pt: PTGeom,
    origin: PolyPosition<f32>,
    anchor: Anchors,
    size: f32,
    width: Option<f32>,
    ms: MathsShape,
    colspec: ColourSpec
}

impl PinPolySpec {
    pub fn create(&self) -> Box<Shape> {
        /* Convert circles to polygons */
        let (points, offset) = match self.ms {
            MathsShape::Circle => (circle_points(self.size),0.),
            MathsShape::Polygon(p,o) => (p,o)
        };
        /* hollow or solid? */
        let (mt,width,hollow) = match self.width {
            Some(width) => (PTMethod::Strip,width,true),
            None        => (PTMethod::Triangle,0.,false)
        };
        /* Do it! */
        let geom = despot(self.pt,mt,&self.colspec);
        Box::new(PinPoly {
            origin: self.origin, 
            size: self.size, 
            colspec: self.colspec.clone(),
            geom: geom,
            anchor: self.anchor,
            points, offset, width, hollow,
        })
    }
}

/*
 * PinPoly
 */

pub struct PinPoly {
    origin: PolyPosition<f32>,
    anchor: Anchors,
    size: f32,
    width: f32,
    points: u16,
    offset: f32,
    colspec: ColourSpec,
    hollow: bool,
    geom: ProgramType
}

impl PinPoly {
    fn add(&self, b: DataBatch, geom: &mut ProgramAttribs, 
           v: Vec<CFraction>, nump: u16) {
        let bbox = self.bounding_box(&v);
        /* Which corner will, ultimately, our axes be based against,
         * ie in which direction will they run?
         */
        let corner = match self.origin {
            PolyPosition::Pin(_) => TOPLEFT,
            PolyPosition::Tape(origin) => origin.x_edge(AxisSense::Pos).corner(),
            PolyPosition::Page(origin) => origin.y_edge(AxisSense::Pos).corner(),
            PolyPosition::Fix(origin) => origin.corner(),
        };
        /* What's the offset to the MIDDLE of our shape from our
         * chosen anchor point?
         */
        let middle = self.anchor.flip(&corner).to_middle(bbox);
        /* For geometries without an explicit origin, add that in. */
        let delta = match self.origin {
            PolyPosition::Fix(origin) =>
                origin.quantity().as_fraction(),
            PolyPosition::Page(origin) =>
                origin.y_edge(AxisSense::Pos).quantity().as_fraction(),
            _ => cfraction(0.,0.)
        };
        /* Transform each of our points according to the middle above,
         * then flipping them, if necessary, to take into account our
         * chosen co-ordinate system (to preserve orientation)
         */
        let bbox = bbox + middle;        
        let v : Vec<CFraction> = v.iter().map(|s|
            bbox.flip_area(*s+middle,corner)+delta
        ).collect();
        let w : Vec<&Input> = v.iter().map(|s| s as &Input).collect();
        match self.origin {
            PolyPosition::Pin(origin) => {
                poly_p(b,geom,"aVertexPosition",&w);
                multi_gl(b,geom,"aOrigin",&origin,nump);
            },
            PolyPosition::Tape(origin) => {
                let origin = origin.x_edge(AxisSense::Pos);
                poly_p(b,geom,"aVertexPosition",&w);
                multi_gl(b,geom,"aOrigin",&origin.quantity(),nump);
                multi_gl(b,geom,"aVertexSign",&origin.corner(),nump);
            },
            PolyPosition::Fix(origin) => {
                poly_p(b,geom,"aVertexPositive",&w);
                multi_gl(b,geom,"aVertexSign",&origin.corner(),nump);
            },
            PolyPosition::Page(origin) => {
                poly_p(b,geom,"aVertexPositive",&w);
                multi_gl(b,geom,"aVertexSign",&origin.y_edge(AxisSense::Pos).corner(),nump);
            },
        }
        if let ColourSpec::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,nump);
        }
    }
    
    fn build_points(&self, hollow: bool) -> Vec<CFraction> {
        let mut v = Vec::<CFraction>::new();
        let delta = f32::consts::PI * 2. / self.points as f32;
        let mut t = self.offset * f32::consts::PI * 2.;
        if !hollow { v.push(cfraction(0.,0.)); }
        let outer = self.size + self.width;
        for _i in 0..self.points {
            let (x,y) = (t.cos(),t.sin());
            t += delta;
            if hollow {
                v.push(cfraction(x*outer,y*outer));
            }
            v.push(cfraction(x * self.size,y * self.size));
        }
        v
    }

    fn bounding_box(&self, pts: &Vec<CFraction>) -> RFraction {
        let mut b = Bounds::new();
        for p in pts { b.add(*p); }
        b.get().unwrap()
    }    
}

impl Shape for PinPoly {
    fn into_objects(&self, geom: &mut ProgramAttribs, _art: Option<Artwork>, e: &mut PrintEdition) {
        let group = self.colspec.to_group(geom,e);
        if self.hollow {
            let b = vertices_hollowpoly(geom,self.points,group);
            let v = self.build_points(true);
            self.add(b,geom,v,self.points*2);
        } else {
            let b = vertices_poly(geom,self.points,group);
            let v = self.build_points(false);
            self.add(b,geom,v,self.points+1);
        }
    }

    fn get_geometry(&self) -> ProgramType { self.geom }
}

const CIRC_TOL : f32 = 1.; // max px undercut

fn circle_points(r: f32) -> u16 {
    // 2*sqrt(pi*r) via 2nd order cos approx to max pixel undercut
    (3.54 * (r/CIRC_TOL).sqrt()) as u16
}

pub fn pin_mathsshape(origin: &Dot<f32,i32>,
                      anchor: Anchors,
                      size: f32, width: Option<f32>, ms: MathsShape,
                      colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinPoly(PinPolySpec {
        pt: PTGeom::Pin,
        origin: PolyPosition::Pin(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}

pub fn fix_mathsshape(origin: &Dot<Edge<i32>,Edge<i32>>,
                       anchor: Anchors,
                       size: f32, width: Option<f32>, ms: MathsShape,
                       colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinPoly(PinPolySpec {
        pt: PTGeom::Fix,
        origin: PolyPosition::Fix(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}

pub fn page_mathsshape(origin: &Dot<Edge<i32>,i32>,
                       anchor: Anchors,
                       size: f32, width: Option<f32>, ms: MathsShape,
                       colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinPoly(PinPolySpec {
        pt: PTGeom::Page,
        origin: PolyPosition::Page(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}

pub fn tape_mathsshape(origin: &Dot<f32,Edge<i32>>,
                       anchor: Anchors,
                       size: f32, width: Option<f32>, ms: MathsShape,
                       colspec: &ColourSpec) -> ShapeSpec {
    ShapeSpec::PinPoly(PinPolySpec {
        pt: PTGeom::Tape,
        origin: PolyPosition::Tape(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}
