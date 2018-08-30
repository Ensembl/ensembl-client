use arena::{ Arena, ArenaData };

use program::ProgramAttribs;
use coord::{ CLeaf, CPixel, RPixel };

use shape::{ Shape, ColourSpec };
use shape::util::{
    triangle_gl, rectangle_p, rectangle_t,
    multi_gl, vertices_rect, vertices_tri,
    despot, ColourSpecImpl
};

use texture::{ Drawing };

/*
 * PinTriangle
 */

pub struct PinTriangle {
    origin: CLeaf,
    points: [CPixel;3],
    colspec: ColourSpecImpl
}

impl PinTriangle {
    pub fn new(origin: CLeaf, points: [CPixel;3], colspec: ColourSpecImpl) -> PinTriangle {
        PinTriangle { origin, points, colspec }
    }    
}

impl Shape for PinTriangle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let p = &self.points;
        let b = vertices_tri(geom,self.colspec.to_group());
        triangle_gl(b,geom,"aVertexPosition",&[&p[0],&p[1],&p[2]]);
        multi_gl(b,geom,"aOrigin",&self.origin,3);
        if let ColourSpecImpl::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,3);
        }
    }
}

pub fn pin_triangle(arena: &mut Arena, origin: &CLeaf, p: &[CPixel;3], colspec: &ColourSpec) {
    let (g,c) = despot("pin",colspec);
    arena.get_geom(&g).shapes.add_item(None,Box::new(
        PinTriangle::new(*origin,*p,c)
    ));
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
  
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let p = tp.at_origin() * self.scale;
            let t = tp / adata.canvases.flat.size();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
            multi_gl(b,geom,"aOrigin",&self.origin,4);
        }
    }
}

pub fn pin_texture(arena: &mut Arena, req: Drawing, origin: &CLeaf, scale: &CPixel) {
    let ri = PinTexture::new(origin,scale);
    arena.get_geom("pintex").shapes.add_item(Some(req),Box::new(ri));
}
