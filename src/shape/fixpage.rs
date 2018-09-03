use std::rc::Rc;
use arena::{ ArenaData, Arena };

use program::ProgramAttribs;
use geometry::{ ProgramType, PTGeom, PTSkin, PTMethod };
use coord::{ CPixel, RPixel };

use shape::{ Shape, ColourSpec };
use shape::util::{ rectangle_p, rectangle_t, multi_gl, vertices_rect, despot };

use drawing::Artist;
use campaign::OnOffExpr;

/*
 * FixRect
 */

pub struct FixRect {
    points: RPixel,
    colspec: ColourSpec,
    geom: ProgramType
}

impl FixRect {
    pub fn new(points: RPixel, colspec: ColourSpec, geom: ProgramType) -> FixRect {
        FixRect { points, colspec, geom }
    }    
}

impl Shape for FixRect {
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData, _texpos: Option<RPixel>) {
        let b = vertices_rect(geom,self.colspec.to_group(geom_name));
        rectangle_p(b,geom,"aVertexPosition",&self.points);
        if let ColourSpec::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }
}

fn rectangle(arena: &mut Arena, p: &RPixel, colspec: &ColourSpec, gt: PTGeom, ooe: Rc<OnOffExpr>) {
    let pt = despot(gt,PTMethod::Triangle,colspec);
    arena.add_shape(Box::new(FixRect::new(*p,colspec.clone(),pt)),ooe);
}

pub fn fix_rectangle(arena: &mut Arena, p: &RPixel, colour: &ColourSpec, ooe: Rc<OnOffExpr>) {
    rectangle(arena,p,colour,PTGeom::Fix,ooe);
}

#[allow(dead_code)]
pub fn page_rectangle(arena: &mut Arena, p: &RPixel, colour: &ColourSpec, ooe: Rc<OnOffExpr>) {
    rectangle(arena,p,colour,PTGeom::Page,ooe);
}

/*
 * FixTexture
 */

pub struct FixTexture {
    pos: CPixel,
    scale: CPixel,
    geom: ProgramType,
    artist: Rc<Artist>
}

impl FixTexture {
    pub fn new(pos: &CPixel, scale: &CPixel, geom: ProgramType, artist: &Rc<Artist>) -> FixTexture {
        FixTexture {
            pos: *pos, scale: *scale, geom, artist: artist.clone()
        }
    }    
}

impl Shape for FixTexture {
    fn into_objects(&self, _geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData, texpos: Option<RPixel>) {
        if let Some(tp) = texpos {
            let p = tp.at_origin() * self.scale + self.pos;
            let t = tp / adata.canvases.flat.size();
            let b = vertices_rect(geom,None);
            rectangle_p(b,geom,"aVertexPosition",&p);
            rectangle_t(b,geom,"aTextureCoord",&t);
        }
    }
    
    fn get_geometry(&self) -> ProgramType { self.geom }

    fn get_artist(&self) -> Option<Rc<Artist>> { Some(self.artist.clone()) }
}

fn texture(arena: &mut Arena, a: Rc<Artist>, origin: &CPixel, scale: &CPixel, gt: PTGeom, ooe: Rc<OnOffExpr>) {
    let pt = ProgramType(gt,PTMethod::Triangle,PTSkin::Texture);
    let ri = FixTexture::new(origin,scale,pt,&a);
    arena.add_shape(Box::new(ri),ooe);
}


pub fn fix_texture(arena: &mut Arena, req: Rc<Artist>, origin: &CPixel, scale: &CPixel, ooe: Rc<OnOffExpr>) {
    texture(arena, req, origin, scale, PTGeom::Fix,ooe);
}

pub fn page_texture(arena: &mut Arena, req: Rc<Artist>, origin: &CPixel, scale: &CPixel, ooe: Rc<OnOffExpr>) {
    texture(arena, req, origin, scale, PTGeom::Page,ooe);
}
