use arena::{
    Arena,
    ArenaData,
};

use geometry::coord::{
    GCoord,
    PCoord,
    TCoord,
};

use geometry::{
    GLProgramData,
};

use shape::Shape;

use texture::{ TexPart, TexPosItem, TextureDrawRequestHandle };

pub struct PinTexture {
    origin: GCoord,
    scale: PCoord,
    texpos: Option<TexPart>
}

impl TexPosItem for PinTexture {
    fn set_texpos(&mut self, data: &TexPart) {
        self.texpos = Some(*data);
    }
}

impl PinTexture {
    pub fn new(origin: &GCoord, scale: &PCoord) -> PinTexture {
        PinTexture {
            origin: *origin, scale: *scale, texpos: None
        }
    }
    
    fn triangle(&self, pdata: &mut GLProgramData,origin:&GCoord,p: &[PCoord;3], tp: &[TCoord;3]) {
        pdata.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        pdata.add_attrib_data("aOrigin",&[origin,origin,origin]);
        pdata.add_attrib_data("aTextureCoord",&[&tp[0], &tp[1], &tp[2]]);
        pdata.advance(3);
    }
    
    fn rectangle(&self,geom: &mut GLProgramData,origin: &GCoord,p:&[PCoord;2],t:&[TCoord;2]) {
        let tp = p[0].triangles(p[1]);
        let tt = t[0].triangles(t[1]);
        self.triangle(geom,origin,&tp.0,&tt.0);
        self.triangle(geom,origin,&tp.1,&tt.1);
    }
}

impl Shape for PinTexture {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData) {
        if let Some(tp) = self.texpos {
            let flat = &adata.canvases.flat;
            let origin = adata.dims.nudge_g(self.origin);
            
            let p = [PCoord(0.,0.), tp.size(self.scale)];
            let t = tp.to_rect(flat);
            self.rectangle(geom,&origin,&p,&t);
        }
    }
}

pub fn pin_texture(arena: &mut Arena, req: TextureDrawRequestHandle, origin: &GCoord, scale: &PCoord) {
    let ri = PinTexture::new(origin,scale);
    arena.get_geom("pintex").gtexitman.add_item(req,Box::new(ri));
}
