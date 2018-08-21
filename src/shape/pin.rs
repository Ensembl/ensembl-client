use arena::{ Arena, ArenaData };

use program::ProgramAttribs;
use coord::{ GCoord, PCoord, Colour };

use shape::Shape;
use shape::util::{ triangle_gl, rectangle_p, rectangle_t, multi_gl };

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * PinTriangle
 */

pub struct PinTriangle {
    origin: GCoord,
    points: [PCoord;3],
    colour: Colour
}

impl PinTriangle {
    pub fn new(origin: GCoord, points: [PCoord;3], colour: Colour) -> PinTriangle {
        PinTriangle { origin, points, colour }
    }    
}

impl Shape for PinTriangle {
    fn process(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let p = &self.points;
        triangle_gl(geom,"aVertexPosition",&[&p[0],&p[1],&p[2]]);
        multi_gl(geom,"aOrigin",&self.origin,3);
        multi_gl(geom,"aVertexColour",&self.colour,3);
        geom.advance(3);
    }
}

pub fn pin_triangle(arena: &mut Arena, origin: &GCoord, p: &[PCoord;3], colour: &Colour) {
    arena.get_geom("pin").shapes.add_item(Box::new(
        PinTriangle::new(*origin,*p,*colour)
    ));
}

/*
 * PinTexture
 */

pub struct PinTexture {
    origin: GCoord,
    scale: PCoord,
    texpos: Option<TexPart>
}

impl TexPosItem for PinTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl PinTexture {
    pub fn new(origin: &GCoord, scale: &PCoord) -> PinTexture {
        PinTexture {
            origin: *origin, scale: *scale, texpos: None
        }
    }    
}

impl Shape for PinTexture {
    fn process(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let origin = adata.dims.nudge_g(self.origin);
            
            let p = [PCoord(0.,0.), tp.size(self.scale)];
            let t = tp.to_rect(flat);

            rectangle_p(geom,"aVertexPosition",&p);
            rectangle_t(geom,"aTextureCoord",&t);
            multi_gl(geom,"aOrigin",&origin,6);
            geom.advance(6);
        }
    }
}

pub fn pin_texture(arena: &mut Arena, req: TextureDrawRequestHandle, origin: &GCoord, scale: &PCoord) {
    let ri = PinTexture::new(origin,scale);
    arena.get_geom("pintex").gtexitman.add_item(req,Box::new(ri));
}
