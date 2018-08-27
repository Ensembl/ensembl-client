use arena::{ Arena, ArenaData };

use program::ProgramAttribs;
use coord::{ CLeaf, CPixel, Colour };

use shape::Shape;
use shape::util::{
    triangle_gl, rectangle_p, rectangle_t,
    multi_gl, vertices_rect, vertices_tri,
};

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * PinTriangle
 */

pub struct PinTriangle {
    origin: CLeaf,
    points: [CPixel;3],
    colour: Colour
}

impl PinTriangle {
    pub fn new(origin: CLeaf, points: [CPixel;3], colour: Colour) -> PinTriangle {
        PinTriangle { origin, points, colour }
    }    
}

impl Shape for PinTriangle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let p = &self.points;
        let b = vertices_tri(geom);
        triangle_gl(b,geom,"aVertexPosition",&[&p[0],&p[1],&p[2]]);
        multi_gl(b,geom,"aOrigin",&self.origin,3);
        multi_gl(b,geom,"aVertexColour",&self.colour,3);
    }
}

pub fn pin_triangle(arena: &mut Arena, origin: &CLeaf, p: &[CPixel;3], colour: &Colour) {
    arena.get_geom("pin").solid_shapes.add_item(Box::new(
        PinTriangle::new(*origin,*p,*colour)
    ));
}

/*
 * PinTexture
 */

pub struct PinTexture {
    origin: CLeaf,
    scale: CPixel,
    texpos: Option<TexPart>
}

impl TexPosItem for PinTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl PinTexture {
    pub fn new(origin: &CLeaf, scale: &CPixel) -> PinTexture {
        PinTexture {
            origin: *origin, scale: *scale, texpos: None
        }
    }    
}

impl Shape for PinTexture {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;            
            let p = [CPixel(0,0), tp.size(self.scale)];
            let t = tp.to_rect(flat);
            let b = vertices_rect(geom);                                    
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
            multi_gl(b,geom,"aOrigin",&self.origin,4);
        }
    }
}

pub fn pin_texture(arena: &mut Arena, req: TextureDrawRequestHandle, origin: &CLeaf, scale: &CPixel) {
    let ri = PinTexture::new(origin,scale);
    arena.get_geom("pintex").tex_shapes.add_item(req,Box::new(ri));
}
