use arena::{ Arena, ArenaData };

use program::{ ProgramAttribs, DataGroup };
use coord::{ CLeaf, Colour };

use shape::Shape;
use shape::util::{ rectangle_g, rectangle_t, multi_gl, vertices_rect };

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * Monochrome
 */

pub struct StretchSpot {
    //colour: Colour,
    group: DataGroup
}

impl StretchSpot {
    pub fn new(arena: &mut Arena, c: &Colour) -> StretchSpot {
        let geom = arena.get_geom("stretchspot");
        let group = geom.new_group();
        if let Some(obj) = geom.get_object("uColour") {
            obj.set_uniform(Some(group),c.to_uniform());
        }
        StretchSpot { group }
    }
}

pub struct StretchSpotRect {
    points: [CLeaf;2],
    spot: DataGroup,
}

impl StretchSpotRect {
    pub fn new(points: [CLeaf;2], spot: &StretchSpot) -> StretchSpotRect {
        StretchSpotRect { points: points, spot: spot.group }
    }
}

impl Shape for StretchSpotRect {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_rect(geom,Some(self.spot));
        rectangle_g(b,geom,"aVertexPosition",&self.points);
    }
}

pub fn stretchspot_rectangle(arena: &mut Arena, p: &[CLeaf;2], spot: &StretchSpot) {
    arena.get_geom("stretchspot").solid_shapes.add_item(Box::new(
        StretchSpotRect::new(*p,spot)
    ));
}

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
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_rect(geom,None);
        rectangle_g(b,geom,"aVertexPosition",&self.points);
        multi_gl(b,geom,"aVertexColour",&self.colour,4);
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
            let b = vertices_rect(geom,None);                                    
            rectangle_g(b,geom,"aVertexPosition",&self.pos);
            rectangle_t(b,geom,"aTextureCoord",&t);
        }
    }
}

pub fn stretch_texture(arena: &mut Arena, req: TextureDrawRequestHandle, pos: &[CLeaf;2]) {
    let ri = StretchTexture::new(pos);
    arena.get_geom("stretchtex").tex_shapes.add_item(req,Box::new(ri));
}
