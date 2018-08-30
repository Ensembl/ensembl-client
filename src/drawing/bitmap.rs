use arena::{ Arena, ArenaCanvases };

use drawing::{
    Drawing,
};

use drawing::drawingimpl::{
    Artist,
};

struct BitmapArtist {
    data: Vec<u8>,
    width: i32,
    height: i32
}

impl BitmapArtist {
    fn new(data: Vec<u8>, width: i32, height: i32) -> BitmapArtist {
        BitmapArtist { data, width, height }
    }
}

impl Artist for BitmapArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, x: i32, y: i32) {
        canvs.flat.bitmap(&self.data,x,y,self.width,self.height);
    }
    
    fn measure(&self, _canvas: &mut ArenaCanvases) -> (i32, i32) {
        (self.width, self.height)
    }
}

pub fn bitmap_texture(arena: &mut Arena, data: Vec<u8>, width: i32, height: i32) -> Drawing {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,gtexreqman,_) = datam.burst_texture();
    let a = Box::new(BitmapArtist::new(data,width,height));
    gtexreqman.add_request(canvases,a)
}
