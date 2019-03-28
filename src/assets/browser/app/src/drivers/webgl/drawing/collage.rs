use types::{ CPixel, RPixel, Colour };
use super::{ FlatCanvas, Artist, Mark };
use model::shape::{ CollageArtist, DrawingSpec, MarkSpec, RectMark };

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
