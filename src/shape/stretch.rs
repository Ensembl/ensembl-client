use arena::{ Arena, ArenaData };

use program::ProgramAttribs;
use coord::{ CLeaf, Colour };

use shape::Shape;
use shape::util::{ rectangle_g, rectangle_t, multi_gl, vertices_rect };

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * StretchRect
 */

pub struct StretchRect {
    points: [CLeaf;2],
    colour: Colour
}

impl StretchRect {
    pub fn new(points: [CLeaf;2], colour: Colour) -> StretchRect {
        StretchRect { points, colour }
    }    
}

impl Shape for StretchRect {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        vertices_rect(adata,geom);                                    
        rectangle_g(geom,"aVertexPosition",&self.points);
        multi_gl(geom,"aVertexColour",&self.colour,4);
    }
}

pub fn stretch_rectangle(arena: &mut Arena, p:&[CLeaf;2], colour:&Colour) {
    arena.get_geom("stretch").solid_shapes.add_item(Box::new(
        StretchRect::new(*p,*colour)
    ));
}

/*
 * StretchTexture
 */

pub struct StretchTexture {
    pos: [CLeaf;2],
    texpos: Option<TexPart>
}

impl TexPosItem for StretchTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl StretchTexture {
    pub fn new(pos: &[CLeaf;2]) -> StretchTexture {
        StretchTexture {
            pos: *pos, texpos: None
        }
    }    
}

impl Shape for StretchTexture {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let t = tp.to_rect(flat);
            vertices_rect(adata,geom);                                    
            rectangle_g(geom,"aVertexPosition",&self.pos);
            rectangle_t(geom,"aTextureCoord",&t);
        }
    }
}

pub fn stretch_texture(arena: &mut Arena, req: TextureDrawRequestHandle, pos: &[CLeaf;2]) {
    let ri = StretchTexture::new(pos);
    arena.get_geom("stretchtex").tex_shapes.add_item(req,Box::new(ri));
}
