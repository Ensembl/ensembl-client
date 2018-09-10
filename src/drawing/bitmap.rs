use std::rc::Rc;
use arena::{ ArenaCanvases };

use types::{ CPixel, RPixel };

use drawing::drawingimpl::{
    Artist,
};

struct BitmapArtist {
    data: Vec<u8>,
    size: CPixel,
}

impl BitmapArtist {
    fn new(data: Vec<u8>, size: CPixel) -> BitmapArtist {
        BitmapArtist { data, size }
    }
}

impl Artist for BitmapArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, pos: CPixel) {
        canvs.flat.bitmap(&self.data,RPixel(pos,self.size));
    }
    
    fn measure(&self, _canvas: &mut ArenaCanvases) -> CPixel {
        self.size
    }
}

pub fn bitmap_texture(data: Vec<u8>, size: CPixel) -> Rc<Artist> {
    Rc::new(BitmapArtist::new(data,size))
}
