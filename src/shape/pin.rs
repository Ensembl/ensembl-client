use std::f32;
use std::rc::Rc;
use arena::ArenaData;

use program::{
    ProgramAttribs, DataBatch, PTGeom, PTMethod, PTSkin, ProgramType,
    Input
};

use types::{ CLeaf, CPixel, RPixel, CFraction, cfraction, Dot, AxisSense, Bounds };

use shape::{ Shape, ColourSpec, MathsShape };
use shape::util::{
    rectangle_p, rectangle_t,
    multi_gl, poly_p, vertices_poly,
    vertices_rect, vertices_hollowpoly,
    despot
};

use drawing::Artist;

/*
 * PinPoly
 */

pub struct PinPoly {
    origin: CLeaf,
    anchor: Dot<Option<AxisSense>,Option<AxisSense>>,
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
        multi_gl(b,geom,"aOrigin",&self.origin,nump);
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
        let h = match self.anchor.0 {
            Some(AxisSense::Pos) => b.offset().0,
            Some(AxisSense::Neg) => b.far_offset().0,
            None => (b.offset().0+b.far_offset().0)/2.
        };
        let v = match self.anchor.1 {
            Some(AxisSense::Pos) => b.offset().1,
            Some(AxisSense::Neg) => b.far_offset().1,
            None => (b.offset().1+b.far_offset().1)/2.
        };
        cfraction(h,v)
    }
}

impl Shape for PinPoly {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData, _texpos: Option<RPixel>) {
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

fn pin_poly_impl(gt: PTGeom,
                 anchor: Dot<Option<AxisSense>,Option<AxisSense>>,
                 mt: PTMethod, origin: &CLeaf, points: u16,
                 size: f32, width: f32, offset: f32, 
                 colspec: &ColourSpec, hollow: bool) -> Box<Shape> {
    let g = despot(gt,mt,colspec);
    Box::new(PinPoly {
        origin: *origin, points, size, offset, width, colspec: colspec.clone(),
        hollow, geom: g, anchor
    })
}

const CIRC_TOL : f32 = 1.; // max px undercut

fn circle_points(r: f32) -> u16 {
    // 2*sqrt(pi*r) via 2nd order cos approx to max pixel undercut
    (3.54 * (r/CIRC_TOL).sqrt()) as u16
}

pub fn pin_mathsshape(origin: &CLeaf,
                      anchor: Dot<Option<AxisSense>,Option<AxisSense>>,
                      size: f32, width: Option<f32>, ms: MathsShape,
                      colspec: &ColourSpec) -> Box<Shape> {
    /* Convert circles to polygons */
    let (points, offset) = match ms {
        MathsShape::Circle => (circle_points(size),0.),
        MathsShape::Polygon(p,o) => (p,o)
    };
    /* hollow or solid? */
    let (mt,width,hollow) = match width {
        Some(width) => (PTMethod::Strip,width,true),
        None        => (PTMethod::Triangle,0.,false)
    };
    pin_poly_impl(PTGeom::Pin,anchor,mt,origin,points,size,width,offset,colspec,hollow)
}

/*
 * PinTexture
 */

pub struct PinTexture {
    origin: CLeaf,
    scale: CPixel,
    artist: Rc<Artist>
}

impl PinTexture {
    pub fn new(artist: Rc<Artist>,origin: &CLeaf, scale: &CPixel) -> PinTexture {
        PinTexture {
            origin: *origin, scale: *scale,
            artist: artist.clone()
        }
    }        
}

impl Shape for PinTexture {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData, texpos: Option<RPixel>) {
        if let Some(tp) = texpos {
            let p = tp.at_origin() * self.scale;
            let t = tp.as_fraction() / adata.canvases.flat.size().as_fraction();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
            multi_gl(b,geom,"aOrigin",&self.origin,4);
        }
    }

    fn get_geometry(&self) -> ProgramType {
        ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Texture)
    }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

pub fn pin_texture(a: Rc<Artist>, origin: &CLeaf, scale: &CPixel) -> Box<Shape> {
    Box::new(PinTexture::new(a,origin,scale))
}
