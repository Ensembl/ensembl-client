use std::collections::HashMap;
use std::collections::hash_map::Entry;
use canvasutil::FCFont;
use arena::ArenaCanvases;

use coord::Colour;

use texture::textureimpl::{
    TextureArtist,
    create_draw_request,
};

use texture::{
    TextureDrawRequestHandle,
    TextureSourceManager,
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
}

/* TextTextureStore - A TextureStore which caches string/font combinations */

pub struct TextTextureStore {
    cache: HashMap<(String,FCFont,Colour),TextureDrawRequestHandle>
}

impl TextTextureStore {
    pub fn new() -> TextTextureStore {
        TextTextureStore {
            cache: HashMap::<(String,FCFont,Colour),TextureDrawRequestHandle>::new(),
        }
    }

    pub fn add(&mut self, gtexreqman: &mut TextureSourceManager, canvas: &mut ArenaCanvases, chars: &str,font: &FCFont, colour: &Colour) -> TextureDrawRequestHandle {
        let tickets = &mut self.cache;
        let tr = match tickets.entry((chars.to_string(),font.clone(),colour.clone())) {
            Entry::Occupied(v) => 
                v.into_mut(),
            Entry::Vacant(v) => {
                let (width, height) = canvas.flat.measure(chars,font);
                let val = create_draw_request(gtexreqman,
                                    Box::new(TextTextureArtist::new(chars,font,colour)),
                                    width,height);
                v.insert(val)
            }
        };
        tr.clone()
    }
}
