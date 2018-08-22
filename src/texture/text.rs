use canvasutil::FCFont;
use arena::{ Arena, ArenaCanvases };

use coord::Colour;

use texture::textureimpl::{
    TextureArtist,
    TDRKey,
};

use texture::{
    TextureDrawRequestHandle,
};

/* TextTextureArtist - A TextureArtist which can draw text */

struct TextTextureArtist {
    chars: String,
    font: FCFont,
    colour: Colour,
}

impl TextTextureArtist {
    fn new(chars: &str, font: &FCFont, colour: &Colour) -> TextTextureArtist {
        TextTextureArtist {
            chars: chars.to_string(),
            font: font.clone(),
            colour: colour.clone(),
        }
    }
}

impl TextureArtist for TextTextureArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, x: u32, y: u32) {
        canvs.flat.text(&self.chars,x,y,&self.font, &self.colour);
    }
    
    fn memoize_key(&self) -> Option<TDRKey> {
        Some(TDRKey::new(( &self.chars, &self.font, &self.colour )))
    }
    
    fn measure(&self, canvas: &mut ArenaCanvases) -> (u32, u32) {
        canvas.flat.measure(&self.chars,&self.font)
    }
}

pub fn text_texture(arena: &mut Arena, chars: &str,font: &FCFont, col: &Colour) -> TextureDrawRequestHandle {
    let datam = &mut arena.data.borrow_mut();
    let (canvases,gtexreqman,_) = datam.burst_texture();
    let a = Box::new(TextTextureArtist::new(chars,font,col));
    gtexreqman.add_request(canvases,a)
}
