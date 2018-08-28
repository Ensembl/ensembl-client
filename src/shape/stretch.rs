use arena::{ Arena, ArenaData };

use program::{ ProgramAttribs, DataGroup };
use coord::{ CLeaf };

use shape::{ Shape, ColourSpec, Spot };
use shape::util::{
    rectangle_g, rectangle_t, points_g,
    multi_gl,
    vertices_rect, vertices_strip,
    despot, ColourSpecImpl
};

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

/*
 * StretchRect
 */

pub struct StretchRect {
    points: [CLeaf;2],
    colspec: ColourSpecImpl,
}

impl StretchRect {
    pub fn new(points: [CLeaf;2], colspec: ColourSpecImpl) -> StretchRect {
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

pub fn stretch_rectangle(arena: &mut Arena, p:&[CLeaf;2], colour: &ColourSpec) {
    let (g,c) = despot("stretch",colour);
    arena.get_geom(&g).solid_shapes.add_item(Box::new(
        StretchRect::new(*p,c)
    ));
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

pub fn stretch_wiggle(arena: &mut Arena, p: Vec<CLeaf>, y: i32, spot: &Spot) {
    arena.get_geom("stretchstrip").solid_shapes.add_item(Box::new(
        StretchWiggle::new(p,spot.get_group("stretchstrip"),y)
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
