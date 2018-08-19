use arena::ArenaCanvases;

use texture::{
    TextureDrawRequestHandle,
    TextureSourceManager,
};

use texture::textureimpl::{
    TextureArtist,
    create_draw_request,
};

/* BitmapTextureArtist - a TextureArtist that can draw bitmaps */

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
}

/* BitmapTextureStore - mainly a noop, we don't cache */

pub struct BitmapTextureStore {
}

impl BitmapTextureStore {
    pub fn new() -> BitmapTextureStore {
        BitmapTextureStore { }
    }

    pub fn add(&mut self, gtexreqman: &mut TextureSourceManager, _canvas: &mut ArenaCanvases, data: Vec<u8>, width: u32, height: u32) -> TextureDrawRequestHandle {
        create_draw_request(gtexreqman,
                            Box::new(BitmapTextureArtist::new(data,width,height)),
                            width,height)
    }
}
