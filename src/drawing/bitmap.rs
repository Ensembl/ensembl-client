use arena::{ Arena, ArenaCanvases };

use coord::{ CPixel, RPixel };

use drawing::{
    Drawing,
};

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

pub fn bitmap_texture(arena: &mut Arena, data: Vec<u8>, size: CPixel) -> Drawing {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,leafdrawman,_) = datam.burst_texture();
    let a = Box::new(BitmapArtist::new(data,size));
    leafdrawman.add_request(canvases,a)
}
