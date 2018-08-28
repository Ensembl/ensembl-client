use arena::{ ArenaData, Arena };

use program::ProgramAttribs;
use coord::{ CPixel, Colour, RPixel };

use shape::Shape;
use shape::util::{ rectangle_p, rectangle_t, multi_gl, vertices_rect };

use texture::{ DrawnShape, Drawing };

/*
 * FixRect
 */

pub struct FixRect {
    points: RPixel,
    colour: Colour,
}

impl FixRect {
    pub fn new(points: RPixel, colour: Colour) -> FixRect {
        FixRect { points, colour }
    }    
}

impl Shape for FixRect {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_rect(geom,None);
        rectangle_p(b,geom,"aVertexPosition",&self.points);
        multi_gl(b,geom,"aVertexColour",&self.colour,4);
    }
}

fn rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour, geom: &str) {
    let geom = arena.get_geom(geom);
    geom.solid_shapes.add_item(Box::new(
        FixRect::new(*p,*colour)
    ));
}

pub fn fix_rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour) {
    rectangle(arena, p, colour, "fix");
}

#[allow(dead_code)]
pub fn page_rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour) {
    rectangle(arena, p, colour, "page");
}

/*
 * FixTexture
 */

pub struct FixTexture {
    pos: CPixel,
    scale: CPixel,
    texpos: Option<RPixel>
}

impl DrawnShape for FixTexture {
    fn set_texpos(&mut self, data: &RPixel) {
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
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let p = tp.at_origin() * self.scale + self.pos;
            let t = tp / adata.canvases.flat.size();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
        }
    }
}

fn texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel, geom: &str) {
    let ri = FixTexture::new(origin,scale);
    arena.get_geom(geom).tex_shapes.add_item(req,Box::new(ri));
}


pub fn fix_texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel) {
    texture(arena, req, origin, scale, "fixtex");
}

pub fn page_texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel) {
    texture(arena, req, origin, scale, "pagetex");
}
