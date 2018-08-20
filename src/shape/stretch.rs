use arena::{ Arena, ArenaData };

use compiler::GLProgramData;
use coord::{ GCoord, Colour };

use shape::Shape;
use shape::util::{ rectangle_g, rectangle_t, multi_gl };

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * StretchRect
 */

pub struct StretchRect {
    points: [GCoord;2],
    colour: Colour
}

impl StretchRect {
    pub fn new(points: [GCoord;2], colour: Colour) -> StretchRect {
        StretchRect { points, colour }
    }    
}

impl Shape for StretchRect {
    fn process(&self, geom: &mut GLProgramData, _adata: &ArenaData) {
        rectangle_g(geom,"aVertexPosition",&self.points);
        multi_gl(geom,"aVertexColour",&self.colour,6);
        geom.advance(6);
    }
}

pub fn stretch_rectangle(arena: &mut Arena, p:&[GCoord;2], colour:&Colour) {
    arena.get_geom("stretch").shapes.add_item(Box::new(
        StretchRect::new(*p,*colour)
    ));
}

/*
 * StretchTexture
 */

pub struct StretchTexture {
    pos: [GCoord;2],
    texpos: Option<TexPart>
}

impl TexPosItem for StretchTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl StretchTexture {
    pub fn new(pos: &[GCoord;2]) -> StretchTexture {
        StretchTexture {
            pos: *pos, texpos: None
        }
    }    
}

impl Shape for StretchTexture {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let t = tp.to_rect(flat);
            rectangle_g(geom,"aVertexPosition",&self.pos);
            rectangle_t(geom,"aTextureCoord",&t);
            geom.advance(6);
        }
    }
}

pub fn stretch_texture(arena: &mut Arena, req: TextureDrawRequestHandle, pos: &[GCoord;2]) {
    let ri = StretchTexture::new(pos);
    arena.get_geom("stretchtex").gtexitman.add_item(req,Box::new(ri));
}
