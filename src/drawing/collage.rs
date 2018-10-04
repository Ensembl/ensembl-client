use std::rc::Rc;

use types::{ CPixel, RPixel, Colour };
use drawing::{ FlatCanvas, Artist };

pub trait Mark : Artist {
    fn get_offset(&self) -> CPixel;
}

struct CollageArtist {
    parts: Vec<Box<Mark>>,
    size: CPixel
}

impl CollageArtist {
    fn new(parts: Vec<Box<Mark>>, size: CPixel) -> CollageArtist {
        CollageArtist { parts, size }
    }
}

impl Artist for CollageArtist {
    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        for part in &self.parts {
            let loc = part.get_offset();
            part.draw(canvs,pos+loc);
        }
    }
    
    fn measure(&self, _canvas: &FlatCanvas) -> CPixel {
        self.size
    }
}

pub fn collage(parts: Vec<Box<Mark>>, size: CPixel) -> Rc<Artist> {
    Rc::new(CollageArtist::new(parts,size))
}

pub struct RectMark {
    coords: RPixel,
    colour: Colour
}

impl Mark for RectMark {
    fn get_offset(&self) -> CPixel { self.coords.offset() }
}

impl Artist for RectMark {
    fn measure(&self, _canvas: &FlatCanvas) -> CPixel {
        self.coords.area()
    }

    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        canvs.rectangle(self.coords.at_origin() + pos, &self.colour);
    }
}

pub fn mark_rectangle(coords: &RPixel, colour: &Colour) -> Box<Mark> {
    Box::new(RectMark { coords: *coords, colour: *colour })
}
