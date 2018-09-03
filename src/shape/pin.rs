use std::f32;
use std::rc::Rc;
use arena::{ Arena, ArenaData };

use program::{ ProgramAttribs, DataBatch };
use coord::{ CLeaf, CPixel, RPixel, Input, CFraction };

use shape::{ Shape, ColourSpec, MathsShape };
use shape::util::{
    triangle_gl, rectangle_p, rectangle_t,
    multi_gl, poly_p, vertices_poly,
    vertices_rect, vertices_tri, vertices_hollowpoly,
    despot
};

use geometry::{ PTGeom, PTMethod, PTSkin, ProgramType };

use drawing::{ Drawing };
use campaign::OnOffExpr;

/*
 * PinTriangle
 */

pub struct PinTriangle {
    origin: CLeaf,
    points: [CPixel;3],
    colspec: ColourSpec,
    geom: ProgramType
}

impl PinTriangle {
    pub fn new(origin: CLeaf, points: [CPixel;3], colspec: &ColourSpec, geom: ProgramType) -> PinTriangle {
        PinTriangle { origin, points, colspec: colspec.clone(), geom }
    }    
}

impl Shape for PinTriangle {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let p = &self.points;
        let b = vertices_tri(geom,self.colspec.to_group(geom_name));
        triangle_gl(b,geom,"aVertexPosition",&[&p[0],&p[1],&p[2]]);
        multi_gl(b,geom,"aOrigin",&self.origin,3);
        if let ColourSpec::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,3);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

pub fn pin_triangle(arena: &mut Arena, origin: &CLeaf, p: &[CPixel;3], colspec: &ColourSpec, ooe: Rc<OnOffExpr>) {
    let g = despot(PTGeom::Pin,PTMethod::Triangle,colspec);
    arena.add_shape(None,Box::new(PinTriangle::new(*origin,*p,colspec,g)),ooe);
}

/*
 * PinPoly
 */

pub struct PinPoly {
    origin: CLeaf,
    size: f32,
    width: f32,
    points: u16,
    offset: f32,
    colspec: ColourSpec,
    hollow: bool,
    geom: ProgramType
}

impl PinPoly {
    fn add(&self, b: DataBatch, geom: &mut ProgramAttribs, v: Vec<CFraction>, nump: u16) {
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
        if !hollow { v.push(CFraction(0.,0.)); }
        let outer = self.size + self.width;
        for _i in 0..self.points {
            let (x,y) = (t.cos(),t.sin());
            t += delta;
            if hollow {
                v.push(CFraction(x*outer,y*outer));
            }
            v.push(CFraction(x * self.size,y * self.size));
        }
        v
    }    
}

impl Shape for PinPoly {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let group = self.colspec.to_group(geom_name);
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

fn pin_poly_impl(arena: &mut Arena, gt: PTGeom, mt: PTMethod, origin: &CLeaf, points: u16,
                 size: f32, width: f32, offset: f32, 
                 colspec: &ColourSpec, hollow: bool, ooe: Rc<OnOffExpr>) {
    let g = despot(gt,mt,colspec);
    let ri = PinPoly {
        origin: *origin, points, size, offset, width, colspec: colspec.clone(),
        hollow, geom: g
    };
    arena.add_shape(None,Box::new(ri),ooe);
}

const CIRC_TOL : f32 = 1.; // max px undercut

fn circle_points(r: f32) -> u16 {
    // 2*sqrt(pi*r) via 2nd order cos approx to max pixel undercut
    (3.54 * (r/CIRC_TOL).sqrt()) as u16
}

pub fn pin_mathsshape(a: &mut Arena, origin: &CLeaf,
                      size: f32, width: Option<f32>, ms: MathsShape,
                      colspec: &ColourSpec, ooe: Rc<OnOffExpr>) {
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
    pin_poly_impl(a,PTGeom::Pin,mt,origin,points,size,width,offset,colspec,hollow,ooe);
}

/*
 * PinTexture
 */

pub struct PinTexture {
    origin: CLeaf,
    scale: CPixel,
    texpos: Option<RPixel>
}

impl PinTexture {
    pub fn new(origin: &CLeaf, scale: &CPixel) -> PinTexture {
        PinTexture {
            origin: *origin, scale: *scale, texpos: None
        }
    }        
}

impl Shape for PinTexture {
    fn set_texpos(&mut self, data: &RPixel) {
        self.texpos = Some(*data);
    }
  
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let p = tp.at_origin() * self.scale;
            let t = tp / adata.canvases.flat.size();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
            multi_gl(b,geom,"aOrigin",&self.origin,4);
        }
    }

    fn get_geometry(&self) -> ProgramType {
        ProgramType(PTGeom::Pin,PTMethod::Triangle,PTSkin::Texture)
    }
}

pub fn pin_texture(arena: &mut Arena, req: Drawing, origin: &CLeaf, scale: &CPixel, ooe: Rc<OnOffExpr>) {
    let ri = PinTexture::new(origin,scale);
    arena.add_shape(Some(req),Box::new(ri),ooe);
}
