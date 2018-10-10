use std::fmt::Debug;
use std::f32;

use program::{
    ProgramAttribs, DataBatch, PTGeom, PTMethod, ProgramType,
    Input
};

use types::{
    CLeaf, CPixel, CFraction, cfraction, Dot, AxisSense, 
    Bounds,  Rect, Edge, Anchors 
};

use shape::{ Shape, ColourSpec, MathsShape, ShapeSpec };
use shape::util::{
    multi_gl, poly_p, vertices_poly, vertices_hollowpoly, despot,
    rectangle_c
};

use drawing::{ Artwork };

#[derive(Clone,Copy,Debug)]
enum PolyPosition<T: Clone+Copy+Debug> {
    Pin(Dot<T,i32>),
    Tape(Dot<T,Edge<i32>>),
}

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
           v: Vec<CFraction>, d: CFraction, nump: u16) {
        let v : Vec<CFraction> = v.iter().map(|s| *s-d).collect();
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
    
    fn delta(&self, pts: &Vec<CFraction>) -> CFraction {
        let mut b = Bounds::new();
        for p in pts { b.add(*p); }
        let b = b.get().unwrap();
        self.anchor.delta(b)
    }
}

impl Shape for PinPoly {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _art: Option<Artwork>) {
        let group = self.colspec.to_group(geom_name);
        if self.hollow {
            let b = vertices_hollowpoly(geom,self.points,group);
            let v = self.build_points(true);
            let d = self.delta(&v);
            self.add(b,geom,v,d,self.points*2);
        } else {
            let b = vertices_poly(geom,self.points,group);
            let v = self.build_points(false);
            let d = self.delta(&v);
            self.add(b,geom,v,d,self.points+1);
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

/*
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
*/

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
