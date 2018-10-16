use std::rc::Rc;

use types::{ CPixel, RPixel, Colour };
use drawing::{ FlatCanvas, Artist, DrawingSpec };

pub trait Mark : Artist {
    fn get_offset(&self) -> CPixel;
}

#[derive(Clone,Debug)]
pub enum MarkSpec {
    Rect(RectMark)
}

impl MarkSpec {
    pub fn to_mark(&self) -> Box<Mark> {
        match self {
            MarkSpec::Rect(rm) => Box::new(rm.clone())
        }
    }
}

#[derive(Clone,Debug)]
pub struct CollageArtist {
    parts: Vec<MarkSpec>,
    size: CPixel
}

impl CollageArtist {
    fn new(parts: Vec<MarkSpec>, size: CPixel) -> CollageArtist {
        CollageArtist { parts, size }
    }
}

impl Artist for CollageArtist {
    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        for part in &self.parts {
            let mark = part.to_mark();
            let loc = mark.get_offset();
            mark.draw(canvs,pos+loc);
        }
    }
    
    fn measure(&self, _canvas: &FlatCanvas) -> CPixel {
        self.size
    }
}

pub fn collage(parts: Vec<MarkSpec>, size: CPixel) -> DrawingSpec {
    DrawingSpec::Collage(CollageArtist::new(parts,size))
}

#[derive(Clone,Debug)]
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

pub fn mark_rectangle(coords: &RPixel, colour: &Colour) -> MarkSpec {
    MarkSpec::Rect(RectMark { coords: *coords, colour: *colour })
}
