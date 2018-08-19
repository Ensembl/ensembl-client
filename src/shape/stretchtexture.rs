use arena::{
    ArenaData,
    Arena,
};

use geometry::coord::{
    GCoord,
    TCoord,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

use texture::{TexPart, TexPosItem, TextureDrawRequestHandle };

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
    
    pub fn triangle(&self, pdata: &mut GLProgramData,p:&[GCoord;3],tp:&[TCoord;3]) {
        pdata.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        pdata.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        pdata.advance(3);
    }
    
    pub fn rectangle(&self, geom: &mut GLProgramData,p: &[GCoord;2], t: &[TCoord;2]) {
        let tp = p[0].triangles(p[1]);
        let tt = t[0].triangles(t[1]);
        self.triangle(geom,&tp.0,&tt.0);
        self.triangle(geom,&tp.1,&tt.1);
    }
}

impl Shape for StretchTexture {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let t = tp.to_rect(flat);
            self.rectangle(geom,&self.pos,&t);
        }
    }
}

pub fn stretch_texture(arena: &mut Arena, req: TextureDrawRequestHandle, pos: &[GCoord;2]) {
    let ri = StretchTexture::new(pos);
    arena.get_geom("stretchtex").gtexitman.add_item(req,Box::new(ri));
}
