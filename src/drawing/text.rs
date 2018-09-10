use std::rc::Rc;
use canvasutil::FCFont;
use arena::{ ArenaCanvases };

use types::{ Colour, CPixel };

use drawing::drawingimpl::{
    Artist,
    DrawingHash,
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

pub fn text_texture(chars: &str,font: &FCFont, col: &Colour) -> Rc<Artist> {
    Rc::new(TextArtist::new(chars,font,col))
}
