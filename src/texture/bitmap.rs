use arena::{ Arena, ArenaCanvases };

use texture::{
    TextureDrawRequestHandle,
};

use texture::textureimpl::{
    TextureArtist,
};

struct BitmapTextureArtist {
    data: Vec<u8>,
    width: u32,
    height: u32
}

impl BitmapTextureArtist {
    fn new(data: Vec<u8>, width: u32, height: u32) -> BitmapTextureArtist {
        BitmapTextureArtist { data, width, height }
    }
}

impl TextureArtist for BitmapTextureArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, x: u32, y: u32) {
        canvs.flat.bitmap(&self.data,x,y,self.width,self.height);
    }
    
    fn measure(&self, _canvas: &mut ArenaCanvases) -> (u32, u32) {
        (self.width, self.height)
    }
}

pub fn bitmap_texture(arena: &mut Arena, data: Vec<u8>, width: u32, height: u32) -> TextureDrawRequestHandle {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,gtexreqman,_) = datam.burst_texture();
    let a = Box::new(BitmapTextureArtist::new(data,width,height));
    gtexreqman.add_request(canvases,a)
}
