use canvasutil::FCFont;
use arena::{ Arena, ArenaCanvases };

use coord::{ Colour, CPixel };

use drawing::drawingimpl::{
    Artist,
    DrawingHash,
};

use drawing::{
    Drawing,
};

/* TextArtist - A Artist which can draw text */

struct TextArtist {
    chars: String,
    font: FCFont,
    colour: Colour,
}

impl TextArtist {
    fn new(chars: &str, font: &FCFont, colour: &Colour) -> TextArtist {
        TextArtist {
            chars: chars.to_string(),
            font: font.clone(),
            colour: colour.clone(),
        }
    }
}

impl Artist for TextArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, pos: CPixel) {
        canvs.flat.text(&self.chars,pos,&self.font, &self.colour);
    }
    
    fn memoize_key(&self) -> Option<DrawingHash> {
        Some(DrawingHash::new(( &self.chars, &self.font, &self.colour )))
    }
    
    fn measure(&self, canvas: &mut ArenaCanvases) -> CPixel {
        canvas.flat.measure(&self.chars,&self.font)
    }
}

pub fn text_texture(arena: &mut Arena, chars: &str,font: &FCFont, col: &Colour) -> Drawing {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,leafdrawman,_) = datam.burst_texture();
    let a = Box::new(TextArtist::new(chars,font,col));
    leafdrawman.add_request(canvases,a)
}
