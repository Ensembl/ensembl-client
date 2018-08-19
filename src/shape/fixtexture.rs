use arena::{
    Arena,
    ArenaData,
};

use geometry::coord::{
    PCoord,
    TCoord,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

pub struct FixTexture {
    pos: PCoord,
    scale: PCoord,
    texpos: Option<TexPart>
}

impl TexPosItem for FixTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl FixTexture {
    pub fn new(pos: &PCoord, scale: &PCoord) -> FixTexture {
        FixTexture {
            pos: *pos, scale: *scale, texpos: None
        }
    }
        
    fn triangle(&self, pdata: &mut GLProgramData,p: &[PCoord;3],tp: &[TCoord;3]) {
        pdata.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        pdata.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        pdata.advance(3);
    }
    
    fn rectangle(&self, geom: &mut GLProgramData,p:&[PCoord;2],t:&[TCoord;2]) {
        let tp = p[0].triangles(p[1]);
        let tt = t[0].triangles(t[1]);
        self.triangle(geom,&tp.0,&tt.0);
        self.triangle(geom,&tp.1,&tt.1);
    }
}

impl Shape for FixTexture {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let t = tp.to_rect(flat);
            let pos = adata.dims.nudge_p(self.pos);
            let p = [PCoord(pos.0,pos.1),
                    PCoord(pos.0,pos.1) + tp.size(self.scale)];
            self.rectangle(geom,&p,&t);
        }
    }
}

pub fn fix_texture(arena: &mut Arena,req: TextureDrawRequestHandle, origin: &PCoord, scale: &PCoord) {
    let ri = FixTexture::new(origin,scale);
    arena.get_geom("fixtex").gtexitman.add_item(req,Box::new(ri));
}
