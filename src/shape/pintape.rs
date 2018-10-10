use std::fmt::Debug;
use std::f32;
use std::rc::Rc;

use program::{
    ProgramAttribs, DataBatch, PTGeom, PTMethod, PTSkin, ProgramType,
    Input
};

use types::{
    CLeaf, CPixel, CFraction, cfraction, Dot, AxisSense, 
    Bounds, area_size, Rect, Edge, APixel, Anchors
};

use shape::{ Shape, ColourSpec, MathsShape };
use shape::util::{
    rectangle_p, rectangle_t, rectangle_c,
    multi_gl, poly_p, vertices_poly,
    vertices_rect, vertices_hollowpoly,
    despot
};

use drawing::{ Artist, Artwork };

/*
 * PinRect
 */

#[derive(Clone,Copy,Debug)]
enum RPinOrTape<T: Clone+Copy+Debug> {
    Pin(Rect<T,i32>),
    Tape(Rect<T,Edge<i32>>)
}

#[derive(Clone,Copy,Debug)]
enum CPinOrTape<T: Clone+Copy+Debug> {
    Pin(Dot<T,i32>),
    Tape(Dot<T,Edge<i32>>)
}

pub struct PinRect {
    origin: CLeaf,
    offset: RPinOrTape<i32>,
    colspec: ColourSpec,
    geom: ProgramType
}

impl PinRect {
    fn new(origin: CLeaf, offset: RPinOrTape<i32>, colspec: &ColourSpec, geom: ProgramType) -> PinRect {
        PinRect { origin, offset, colspec: colspec.clone(), geom }
    }
}

impl Shape for PinRect {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _art: Option<Artwork>) {
        let b = vertices_rect(geom,self.colspec.to_group(geom_name));
        match self.offset {
            RPinOrTape::Pin(offset) => {
                rectangle_p(b,geom,"aVertexPosition",&offset);
                multi_gl(b,geom,"aOrigin",&self.origin,4);
            },
            RPinOrTape::Tape(offset) => {
                let offset = offset.x_edge(AxisSense::Pos,AxisSense::Pos);
                rectangle_c(b,geom,"aVertexPosition","aVertexSign",&offset);
                multi_gl(b,geom,"aOrigin",&self.origin,4);
                
            },
        };
        if let ColourSpec::Colour(c) = self.colspec {
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

pub fn pin_rectangle(r: &CLeaf, f: &Rect<i32,i32>, colour: &ColourSpec) -> Box<Shape> {
    let g = despot(PTGeom::Pin,PTMethod::Triangle,colour);
    Box::new(PinRect::new(*r,RPinOrTape::Pin(*f),colour,g))
}

pub fn tape_rectangle(r: &CLeaf, f: &Rect<i32,Edge<i32>>, colour: &ColourSpec) -> Box<Shape> {
    let g = despot(PTGeom::Tape,PTMethod::Triangle,colour);
    Box::new(PinRect::new(*r,RPinOrTape::Tape(*f),colour,g))
}

/*
 * PinPoly
 */

pub struct PinPoly {
    origin: CPinOrTape<f32>,
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
        poly_p(b,geom,"aVertexPosition",&w);
        match self.origin {
            CPinOrTape::Pin(origin) => {
                multi_gl(b,geom,"aOrigin",&origin,nump);
            },
            CPinOrTape::Tape(origin) => {
                let origin = origin.x_edge(AxisSense::Pos);
                multi_gl(b,geom,"aOrigin",&origin.quantity(),nump);
                multi_gl(b,geom,"aVertexSign",&origin.corner(),nump);
            }
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

struct PinPolySpec {
    pt: PTGeom,
    origin: CPinOrTape<f32>,
    anchor: Anchors,
    size: f32,
    width: Option<f32>,
    ms: MathsShape,
    colspec: ColourSpec
}

fn spec_to_shape(spec: PinPolySpec) -> Box<Shape> {
    /* Convert circles to polygons */
    let (points, offset) = match spec.ms {
        MathsShape::Circle => (circle_points(spec.size),0.),
        MathsShape::Polygon(p,o) => (p,o)
    };
    /* hollow or solid? */
    let (mt,width,hollow) = match spec.width {
        Some(width) => (PTMethod::Strip,width,true),
        None        => (PTMethod::Triangle,0.,false)
    };
    /* Do it! */
    let geom = despot(spec.pt,mt,&spec.colspec);
    Box::new(PinPoly {
        origin: spec.origin, 
        size: spec.size, 
        colspec: spec.colspec,
        geom: geom,
        anchor: spec.anchor,
        points, offset, width, hollow,
    })
}

pub fn pin_mathsshape(origin: &Dot<f32,i32>,
                      anchor: Anchors,
                      size: f32, width: Option<f32>, ms: MathsShape,
                      colspec: &ColourSpec) -> Box<Shape> {
    spec_to_shape(PinPolySpec {
        pt: PTGeom::Pin,
        origin: CPinOrTape::Pin(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}

pub fn tape_mathsshape(origin: &Dot<f32,Edge<i32>>,
                       anchor: Anchors,
                       size: f32, width: Option<f32>, ms: MathsShape,
                       colspec: &ColourSpec) -> Box<Shape> {
    spec_to_shape(PinPolySpec {
        pt: PTGeom::Tape,
        origin: CPinOrTape::Tape(*origin),
        colspec: colspec.clone(),
        anchor, size, width, ms
    })
}

/*
 * PinTexture
 */

pub struct PinTexture {
    pt: PTGeom,
    origin: CPinOrTape<f32>,
    offset: CPixel,
    scale: APixel,
    artist: Rc<Artist>
}

impl PinTexture {
    fn new(pt: PTGeom, artist: Rc<Artist>,origin: &CPinOrTape<f32>, 
           offset: &CPixel, scale: &APixel) -> PinTexture {
        PinTexture {
            pt, origin: *origin, offset: *offset, scale: *scale,
            artist: artist.clone()
        }
    }        
}

impl Shape for PinTexture {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, 
                    artwork: Option<Artwork>) {
        if let Some(art) = artwork {
            let b = vertices_rect(geom,Some(art.index.get_group(geom_name)));
            let mut mp = art.mask_pos;
            let mut ap = art.pos;
            let mut scale = self.scale;            
            match self.origin {
                CPinOrTape::Pin(origin) => {
                    multi_gl(b,geom,"aOrigin",&origin,4);
                },
                CPinOrTape::Tape(origin) => {
                    let origin = origin.x_edge(AxisSense::Pos);
                    ap = ap.flip_d(origin);
                    mp = mp.flip_d(origin);
                    scale = scale.flip(origin);
                    multi_gl(b,geom,"aOrigin",&origin.quantity(),4);
                    multi_gl(b,geom,"aVertexSign",&origin.corner(),4);
                }
            }
            /* create rect the scaled rect and displace by offset */
            let p = area_size(self.offset,art.size * scale.quantity());
            /* modify offset relative to chosen point */
            let p = scale.from_nw(p.as_fraction());
            rectangle_t(b,geom,"aTextureCoord",&ap);
            rectangle_t(b,geom,"aMaskCoord",&mp);
            rectangle_t(b,geom,"aVertexPosition",&p);
        }
    }

    fn get_geometry(&self) -> ProgramType {
        ProgramType(self.pt,PTMethod::Triangle,PTSkin::Texture)
    }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

pub fn pin_texture(a: Rc<Artist>, origin: &CLeaf, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    Box::new(PinTexture::new(PTGeom::Pin,a,&CPinOrTape::Pin(*origin),offset,scale))
}

pub fn tape_texture(a: Rc<Artist>, origin: &Dot<f32,Edge<i32>>, offset: &CPixel, scale: &APixel) -> Box<Shape> {
    Box::new(PinTexture::new(PTGeom::Tape,a,&CPinOrTape::Tape(*origin),offset,scale))
}
