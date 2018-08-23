use arena::{ ArenaData, Arena };

use program::ProgramAttribs;
use coord::{ CPixel, Colour };

use shape::Shape;
use shape::util::{ rectangle_p, rectangle_t, multi_gl };

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * FixRect
 */

pub struct FixRect {
    points: [CPixel;2],
    colour: Colour,
}

impl FixRect {
    pub fn new(points: [CPixel;2], colour: Colour) -> FixRect {
        FixRect { points, colour }
    }    
}

impl Shape for FixRect {
    fn process(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        rectangle_p(geom,"aVertexPosition",&self.points);
        multi_gl(geom,"aVertexColour",&self.colour,6);
        geom.advance(6);
    }
}

pub fn fix_rectangle(arena: &mut Arena, p: &[CPixel;2], colour: &Colour) {
    let geom = arena.get_geom("fix");
    geom.shapes.add_item(Box::new(
        FixRect::new(*p,*colour)
    ));
}

/*
 * FixTexture
 */

pub struct FixTexture {
    pos: CPixel,
    scale: CPixel,
    texpos: Option<TexPart>
}

impl TexPosItem for FixTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl FixTexture {
    pub fn new(pos: &CPixel, scale: &CPixel) -> FixTexture {
        FixTexture {
            pos: *pos, scale: *scale, texpos: None
        }
    }    
}

impl Shape for FixTexture {
    fn process(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let t = tp.to_rect(flat);
            let p = [self.pos, self.pos + tp.size(self.scale)];
            rectangle_p(geom,"aVertexPosition",&p);
            rectangle_t(geom,"aTextureCoord",&t);
            geom.advance(6);
        }
    }
}

pub fn fix_texture(arena: &mut Arena,req: TextureDrawRequestHandle, origin: &CPixel, scale: &CPixel) {
    let ri = FixTexture::new(origin,scale);
    arena.get_geom("fixtex").gtexitman.add_item(req,Box::new(ri));
}
