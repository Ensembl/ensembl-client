use std::rc::Rc;

use types::{ CPixel, area_size };

use drawing::FlatCanvas;
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
    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        canvs.bitmap(&self.data,area_size(pos,self.size));
    }
    
    fn measure(&self, _canvas: &FlatCanvas) -> CPixel {
        self.size
    }
}

pub fn bitmap_texture(data: Vec<u8>, size: CPixel) -> Rc<Artist> {
    Rc::new(BitmapArtist::new(data,size))
}
