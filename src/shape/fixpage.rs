use std::rc::Rc;
use arena::{ ArenaData, Arena };

use program::ProgramAttribs;
use geometry::{ ProgramType, PTGeom, PTSkin, PTMethod };
use coord::{ CPixel, Colour, RPixel };

use shape::Shape;
use shape::util::{ rectangle_p, rectangle_t, multi_gl, vertices_rect };

use drawing::{ Drawing };
use campaign::OnOffExpr;

/*
 * FixRect
 */

pub struct FixRect {
    points: RPixel,
    colour: Colour,
    geom: ProgramType
}

impl FixRect {
    pub fn new(points: RPixel, colour: Colour, geom: ProgramType) -> FixRect {
        FixRect { points, colour, geom }
    }    
}

impl Shape for FixRect {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_rect(geom,None);
        rectangle_p(b,geom,"aVertexPosition",&self.points);
        multi_gl(b,geom,"aVertexColour",&self.colour,4);
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

fn rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour, gt: PTGeom, ooe: Rc<OnOffExpr>) {
    let pt = ProgramType(gt, PTMethod::Triangle, PTSkin::Colour);
    arena.add_shape(None,Box::new(FixRect::new(*p,*colour,pt)),ooe);
}

pub fn fix_rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour, ooe: Rc<OnOffExpr>) {
    rectangle(arena,p,colour,PTGeom::Fix,ooe);
}

#[allow(dead_code)]
pub fn page_rectangle(arena: &mut Arena, p: &RPixel, colour: &Colour, ooe: Rc<OnOffExpr>) {
    rectangle(arena,p,colour,PTGeom::Page,ooe);
}

/*
 * FixTexture
 */

pub struct FixTexture {
    pos: CPixel,
    scale: CPixel,
    texpos: Option<RPixel>,
    geom: ProgramType
}

impl FixTexture {
    pub fn new(pos: &CPixel, scale: &CPixel, geom: ProgramType) -> FixTexture {
        FixTexture {
            pos: *pos, scale: *scale, texpos: None, geom
        }
    }    
}

impl Shape for FixTexture {
    fn set_texpos(&mut self, data: &RPixel) {
        self.texpos = Some(*data);
    }
  
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let p = tp.at_origin() * self.scale + self.pos;
            let t = tp / adata.canvases.flat.size();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

fn texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel, gt: PTGeom, ooe: Rc<OnOffExpr>) {
    let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
    let ri = FixTexture::new(origin,scale,pt);
    arena.add_shape(Some(req),Box::new(ri),ooe);
}


pub fn fix_texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel, ooe: Rc<OnOffExpr>) {
    texture(arena, req, origin, scale, PTGeom::Fix,ooe);
}

pub fn page_texture(arena: &mut Arena,req: Drawing, origin: &CPixel, scale: &CPixel, ooe: Rc<OnOffExpr>) {
    texture(arena, req, origin, scale, PTGeom::Page,ooe);
}
