use std::rc::Rc;

use drawing::{ FlatCanvas, Artist, DrawingSession, OneCanvasManager };
use program::CanvasWeave;
use types::{ CPixel, area_size, cpixel };

struct BitmapArtist {
    data: Vec<u8>,
    size: CPixel,
    blur: bool
}

impl BitmapArtist {
    fn new(data: Vec<u8>, size: CPixel, blur: bool) -> BitmapArtist {
        BitmapArtist { data, size, blur }
    }
}

impl Artist for BitmapArtist {
    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        canvs.bitmap(&self.data,area_size(pos,self.size));
    }
    
    fn measure(&self, _canvas: &FlatCanvas) -> CPixel {
        self.size
    }
    
    fn select_canvas<'a>(&self, ds: &'a mut DrawingSession) -> &'a mut OneCanvasManager { 
        ds.get_ocm(if self.blur { CanvasWeave::Blur } else { CanvasWeave::Pixelate })
    }

    fn margin(&self) -> CPixel { cpixel(1,1) }
}

pub fn bitmap_texture(data: Vec<u8>, size: CPixel, blur: bool) -> Rc<Artist> {
    Rc::new(BitmapArtist::new(data,size,blur))
}
