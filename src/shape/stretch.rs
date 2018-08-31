use std::rc::Rc;

use arena::{ Arena, ArenaData };

use program::{ ProgramAttribs, DataGroup };
use coord::{ CLeaf, RLeaf, RPixel, RFraction, CFraction, CPixel };

use shape::{ Shape, ColourSpec, Spot };
use shape::util::{
    rectangle_g, rectangle_t, points_g,
    multi_gl,
    vertices_rect, vertices_strip,
    despot, ColourSpecImpl
};

use drawing::{ Drawing };

use onoff::OnOffExpr;

/*
 * StretchRect
 */

pub struct StretchRect {
    points: RLeaf,
    colspec: ColourSpecImpl,
}

impl StretchRect {
    pub fn new(points: RLeaf, colspec: ColourSpecImpl) -> StretchRect {
        StretchRect { points, colspec }
    }
}

impl Shape for StretchRect {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_rect(geom,self.colspec.to_group());
        rectangle_g(b,geom,"aVertexPosition",&self.points);
        if let ColourSpecImpl::Colour(c) = self.colspec {        
            multi_gl(b,geom,"aVertexColour",&c,4);
        }
    }
}

pub fn stretch_rectangle(arena: &mut Arena, p:&RLeaf, colour: &ColourSpec, ooe: Rc<OnOffExpr>) {
    let (g,c) = despot("stretch",colour);
    arena.get_geom(&g).shapes.add_item(None,Box::new(
        StretchRect::new(*p,c)
    ),ooe);
}

/*
 * StretchWiggle
 */

pub struct StretchWiggle {
    points: Vec<CLeaf>,
    y: i32,
    group: DataGroup
}

impl StretchWiggle {
    pub fn new(points: Vec<CLeaf>, group: DataGroup, y: i32) -> StretchWiggle {
        StretchWiggle { points, group, y }
    }
}

impl Shape for StretchWiggle {
    fn into_objects(&self, geom: &mut ProgramAttribs, _adata: &ArenaData) {
        let b = vertices_strip(geom,self.points.len() as u16*2,Some(self.group));
        points_g(b,geom,"aVertexPosition",&self.points,self.y);
    }
}

pub fn stretch_wiggle(arena: &mut Arena, p: Vec<CLeaf>, y: i32, spot: &Spot, ooe: Rc<OnOffExpr>) {
    arena.get_geom("stretchstrip").shapes.add_item(None,Box::new(
        StretchWiggle::new(p,spot.get_group("stretchstrip"),y)
    ),ooe);
}

/*
 * StretchTexture
 */

pub struct StretchTexture {
    pos: RLeaf,
    texpos: Option<RPixel>
}

impl StretchTexture {
    pub fn new(pos: &RLeaf) -> StretchTexture {
        StretchTexture {
            pos: *pos, texpos: None
        }
    }
}

const CHUNK_SIZE : f32 = 10.;

impl Shape for StretchTexture {
    fn set_texpos(&mut self, data: &RPixel) {
        self.texpos = Some(*data);
    }

    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let t = tp / adata.canvases.flat.size();
            
            /* some cards baulk at very large textured areas, so split */
            let mut chunks = ((self.pos.1).0.abs() / CHUNK_SIZE) as i32;
            if chunks < 1 { chunks = 1; }
            
            let widthp = self.pos.1 / CPixel(chunks,1);
            let widtht = t.1 / CFraction(chunks as f32,1.);
            
            let mut p = RLeaf(self.pos.0,widthp);
            let mut t = RFraction(t.0,widtht);
            for _i in 0..chunks {
                let b = vertices_rect(geom,None);
                rectangle_g(b,geom,"aVertexPosition",&p);
                rectangle_t(b,geom,"aTextureCoord",&t);
                p = p + CLeaf(widthp.0,0);
                t = t + CFraction(widtht.0,0.);
            }
        }
    }
}

pub fn stretch_texture(arena: &mut Arena, req: Drawing, pos: &RLeaf, ooe: Rc<OnOffExpr>) {
    let ri = StretchTexture::new(pos);
    arena.get_geom("stretchtex").shapes.add_item(Some(req),Box::new(ri),ooe);
}
