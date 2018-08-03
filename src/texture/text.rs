use std::collections::HashMap;
use std::rc::Rc;
use std::collections::hash_map::Entry;
use canvasutil::FCFont;
use arena::ArenaCanvases;

use texture::{
    TextureRequest,
    TextureGenerator,
    TextureItem,
    GTextureItemManager,
    GTextureRequestManager,
};

struct TextTextureGenerator {
    chars: String,
    font: FCFont,    
}

impl TextTextureGenerator {
    fn new(chars: &str, font: &FCFont) -> TextTextureGenerator {
        TextTextureGenerator {
            chars: chars.to_string(),
            font: font.clone()
        }
    }
}

impl TextureGenerator for TextTextureGenerator {
    fn draw(&self, canvs: &mut ArenaCanvases, x: u32, y: u32) {
        canvs.flat.text(&self.chars,x,y,&self.font);
    }
}

pub struct TextTextureStore {
    cache: HashMap<(String,FCFont),Rc<TextureRequest>>
}

impl TextTextureStore {
    pub fn new() -> TextTextureStore {
        TextTextureStore {
            cache: HashMap::<(String,FCFont),Rc<TextureRequest>>::new(),
        }
    }

    pub fn add(&mut self,gtexitman: &mut GTextureItemManager, gtexreqman: &mut GTextureRequestManager, canvas: &mut ArenaCanvases, origin:&[f32;2],chars: &str,font: &FCFont) {
        let tickets = &mut self.cache;
        let tr = match tickets.entry((chars.to_string(),font.clone())) {
            Entry::Occupied(v) => 
                v.into_mut(),
            Entry::Vacant(v) => {
                let flat = &canvas.flat;
                let (width, height) = flat.measure(chars,font);
                let flat_alloc = &mut canvas.flat_alloc;
                let val = Rc::new(TextureRequest::new(
                                    Box::new(TextTextureGenerator::new(chars,font)),
                                    flat_alloc.request(width,height)));
                gtexreqman.add_request(val.clone());
                v.insert(val)
            }
        };
        
        let req = TextureItem::new(tr.clone(),origin,&[1.,1.]);
        gtexitman.add_item(req);
    }
}
