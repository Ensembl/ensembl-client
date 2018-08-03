use std::collections::HashMap;
use std::rc::Rc;
use std::collections::hash_map::Entry;
use canvasutil::FCFont;
use arena::ArenaCanvases;

use texture::textureimpl::{
    TextureArtist,
    create_draw_request,
};

use texture::{
    TextureDrawRequest,
    TextureSourceManager,
};

/* TextTextureArtist - A TextureArtist which can draw text */

struct TextTextureArtist {
    chars: String,
    font: FCFont,    
}

impl TextTextureArtist {
    fn new(chars: &str, font: &FCFont) -> TextTextureArtist {
        TextTextureArtist {
            chars: chars.to_string(),
            font: font.clone()
        }
    }
}

impl TextureArtist for TextTextureArtist {
    fn draw(&self, canvs: &mut ArenaCanvases, x: u32, y: u32) {
        canvs.flat.text(&self.chars,x,y,&self.font);
    }
}

/* TextTextureStore - A TextureStore which caches string/font combinations */

pub struct TextTextureStore {
    cache: HashMap<(String,FCFont),Rc<TextureDrawRequest>>
}

impl TextTextureStore {
    pub fn new() -> TextTextureStore {
        TextTextureStore {
            cache: HashMap::<(String,FCFont),Rc<TextureDrawRequest>>::new(),
        }
    }

    pub fn add(&mut self, gtexreqman: &mut TextureSourceManager, canvas: &mut ArenaCanvases, chars: &str,font: &FCFont) -> Rc<TextureDrawRequest> {
        let tickets = &mut self.cache;
        let tr = match tickets.entry((chars.to_string(),font.clone())) {
            Entry::Occupied(v) => 
                v.into_mut(),
            Entry::Vacant(v) => {
                let (width, height) = canvas.flat.measure(chars,font);
                let val = create_draw_request(gtexreqman,canvas,
                                    Box::new(TextTextureArtist::new(chars,font)),
                                    width,height);
                v.insert(val)
            }
        };
        tr.clone()
    }
}
