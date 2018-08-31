use arena::{ Arena, ArenaCanvases };
use coord::{ CPixel, RPixel, Colour };

use drawing::{
    Drawing,
};

use drawing::drawingimpl::{
    Artist,
};

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
    fn draw(&self, canvs: &mut ArenaCanvases, pos: CPixel) {
        for part in &self.parts {
            let loc = part.get_offset();
            part.draw(canvs,pos+loc);
        }
    }
    
    fn measure(&self, _canvas: &mut ArenaCanvases) -> CPixel {
        self.size
    }
}

pub fn collage(arena: &mut Arena, parts: Vec<Box<Mark>>, size: CPixel) -> Drawing {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,leafdrawman,_) = datam.burst_texture();
    let a = Box::new(CollageArtist::new(parts,size));
    leafdrawman.add_request(canvases,a)
}

pub struct RectMark {
    coords: RPixel,
    colour: Colour
}

impl Mark for RectMark {
    fn get_offset(&self) -> CPixel { self.coords.0 }
}

impl Artist for RectMark {
    fn measure(&self, _canvas: &mut ArenaCanvases) -> CPixel {
        self.coords.1
    }

    fn draw(&self, canvs: &mut ArenaCanvases, pos: CPixel) {
        canvs.flat.rectangle(self.coords.at_origin() + pos, &self.colour);
    }
}

pub fn mark_rectangle(coords: &RPixel, colour: &Colour) -> Box<Mark> {
    Box::new(RectMark { coords: *coords, colour: *colour })
}
