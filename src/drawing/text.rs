use std::rc::Rc;

use drawing::{ FCFont, Artist, FlatCanvas };
use drawing::drawingimpl::DrawingHash;
use types::{ Colour, CPixel };

/* TextArtist - A Artist which can draw text */

struct TextArtist {
    chars: String,
    font: FCFont,
    colour: Colour,
    background: Colour
}

impl TextArtist {
    fn new(chars: &str, font: &FCFont, colour: &Colour, background: &Colour) -> TextArtist {
        TextArtist {
            chars: chars.to_string(),
            font: font.clone(),
            colour: colour.clone(),
            background: background.clone()
        }
    }
}

impl Artist for TextArtist {
    fn draw(&self, canvs: &FlatCanvas, pos: CPixel) {
        canvs.text(&self.chars,pos,&self.font, &self.colour, &self.background);
    }
        
    fn draw_mask(&self, canvs: &FlatCanvas, pos: CPixel) {
        canvs.text(&self.chars,pos,&self.font, &Colour(0,0,0), &Colour(255,255,255));
    }
    
    fn memoize_key(&self) -> Option<DrawingHash> {
        Some(DrawingHash::new(( &self.chars, &self.font, &self.colour )))
    }
    
    fn measure(&self, canvas: &FlatCanvas) -> CPixel {
        canvas.measure(&self.chars,&self.font)
    }
}

pub fn text_texture(chars: &str,font: &FCFont, col: &Colour, bg: &Colour) -> Rc<Artist> {
    Rc::new(TextArtist::new(chars,font,col,bg))
}
